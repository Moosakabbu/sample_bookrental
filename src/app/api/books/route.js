import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Configure the database connection
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "welcome123#",
  database: "book_ordering",
});

// Fetch all available books
export async function fetchBooks() {
  try {
    const [books] = await db.execute(`
      SELECT bookID, title, author, rentalPrice, imagePath, categoryID, availability
      FROM Books
      WHERE isDeleted = 0
      ORDER BY bookID DESC
    `);
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  }
}

// Fetch a single book by ID
export async function fetchBookByID(bookID) {
  try {
    const [books] = await db.execute(
      `
      SELECT bookID, title, author, rentalPrice, imagePath, categoryID, availability
      FROM Books
      WHERE bookID = ? AND isDeleted = 0
    `,
      [bookID]
    );
    return books[0]; // Return the single book object
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    throw new Error("Failed to fetch book");
  }
}

// Fetch all categories
export async function fetchCategories() {
  try {
    const [categories] = await db.execute(`
      SELECT categoryID, categoryName
      FROM Categories
    `);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Fetch all cart items
export async function fetchCartItems() {
  try {
    const [cartItems] = await db.execute(`
      SELECT 
        Cart.cartID, 
        Cart.bookID, 
        Books.title, 
        Books.author, 
        Books.rentalPrice, 
        Books.imagePath
      FROM Cart
      JOIN Books ON Cart.bookID = Books.bookID
      ORDER BY Cart.cartID DESC
    `);
    return cartItems.length ? cartItems : []; // Return an empty array if no items
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items");
  }
}

// Fetch all orders
export async function fetchOrders() {
  try {
    const [orders] = await db.execute(`
        SELECT 
          Orders.orderID, 
          Books.title, 
          Books.author, 
          Orders.paymentStatus, 
          Orders.deliveryStatus, 
          Books.imagePath 
        FROM Orders 
        JOIN Books ON Orders.bookID = Books.bookID
        ORDER BY Orders.orderDate DESC
      `);
    return orders.length ? orders : []; // Return an empty array if no orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

// Add a book to the cart
export async function addToCart(bookID) {
  try {
    const [result] = await db.execute(
      `
      INSERT INTO Cart (bookID)
      VALUES (?)
    `,
      [bookID]
    );
    return {
      cartID: result.insertId,
      message: "Book added to cart successfully",
    };
  } catch (error) {
    console.error("Error adding book to cart:", error);
    throw new Error("Failed to add book to cart");
  }
}

// Remove a book from the cart
export async function removeFromCart(cartID) {
  try {
    await db.execute(
      `
        DELETE FROM Cart
        WHERE cartID = ?
      `,
      [cartID]
    );
    return { message: "Book removed from cart successfully" };
  } catch (error) {
    console.error("Error removing book from cart:", error);
    throw new Error("Failed to remove book from cart");
  }
}

// Place an order
export async function placeOrder() {
  try {
    const [cartItems] = await db.execute(`
        SELECT bookID FROM Cart
      `);

    if (cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot place order.");
    }

    const orderDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const paymentStatus = "PENDING";
    const deliveryStatus = "PENDING";

    // Insert each book in the cart into the Orders table
    for (const item of cartItems) {
      await db.execute(
        `
          INSERT INTO Orders (userID, bookID, orderDate, rentalPeriod, paymentStatus, deliveryStatus)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [null, item.bookID, orderDate, null, paymentStatus, deliveryStatus]
      );
    }

    // Clear the cart after placing the order
    await db.execute(`DELETE FROM Cart`);

    return { message: "Order placed successfully" };
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error("Failed to place order");
  }
}

// API endpoint handlers
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const bookID = searchParams.get("id");

  try {
    if (type === "books") {
      const books = await fetchBooks();
      return NextResponse.json(books);
    } else if (type === "book" && bookID) {
      const book = await fetchBookByID(bookID);
      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      return NextResponse.json(book);
    } else if (type === "categories") {
      const categories = await fetchCategories();
      return NextResponse.json(categories);
    } else if (type === "cart") {
      const cartItems = await fetchCartItems();
      return NextResponse.json(cartItems);
    } else if (type === "orders") {
      const orders = await fetchOrders();
      return NextResponse.json(orders);
    } else {
      return NextResponse.json(
        { error: "Invalid type or missing parameters" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { bookID, userID } = data;

    if (bookID) {
      const result = await addToCart(bookID);
      return NextResponse.json(result, { status: 201 });
    }

    if (userID) {
      const result = await placeOrder(userID);
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json(
      { error: "Invalid payload. Either bookID or userID is required." },
      { status: 400 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartID = searchParams.get("id");

    if (!cartID) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    const result = await removeFromCart(cartID);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to remove book from cart" },
      { status: 500 }
    );
  }
}
