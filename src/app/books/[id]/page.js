"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBook, FaShoppingCart, FaSpinner } from "react-icons/fa";

export default function BookDetails({ params }) {
  const { id } = params; // Extract book ID from the URL params
  const [book, setBook] = useState(null);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();

  // Fetch book details
  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await fetch(`/api/books?type=book&id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch book details");
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    }
    fetchBookDetails();
  }, [id]);

  // Fetch cart items
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const response = await fetch(`/api/books?type=cart`);
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCartItems();
  }, []);

  // Add book to cart
  const handleAddToCart = async () => {
    try {
      const response = await fetch(`/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookID: id }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      const updatedCart = await fetch(`/api/books?type=cart`);
      setCart(await updatedCart.json());
    } catch (err) {
      setError(err.message);
    }
  };

  // Remove book from cart
  const handleRemoveFromCart = async (cartID) => {
    try {
      const response = await fetch(`/api/books?id=${cartID}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove from cart");
      const updatedCart = await fetch(`/api/books?type=cart`);
      setCart(await updatedCart.json());
    } catch (err) {
      setError(err.message);
    }
  };

  // Render loader while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF7EB]">
        <FaSpinner className="text-4xl text-[#8D6F5E] animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF7EB]">
      <nav className="bg-[#FAF0DF] p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-lg font-bold mb-4 text-[#8D6F5E] flex items-center">
            <FaBook className="mr-2" /> BooksRental.mv
          </h1>
          <div className="space-x-4 flex items-center">
            <FaShoppingCart className="text-2xl text-[#C69E80] hover:text-[#8D6F5E] cursor-pointer" onClick={() => router.push("/cart")}/>
          </div>
        </header>
        {/* Breadcrumb */}
        <span className="text-[#8D6F5E]">
          <button
            onClick={() => router.push("/")}
            className="hover:underline text-[#8D6F5E] font-bold"
          >
            Home
          </button>{" "}
          / {book.title}
        </span>
      </nav>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Book Details */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold text-[#8D6F5E] mb-2">
            {book.title}
          </h1>
          <p className="text-lg text-[#C69E80] mb-4">{book.author}</p>
          <img
            src={book.imagePath || "/placeholder.jpg"}
            alt={book.title}
            className="w-1/2 rounded-lg mb-6 mx-auto"
          />
          <h2 className="text-2xl font-semibold text-[#8D6F5E] mb-4">
            Rent or Buy
          </h2>
          <div className="flex flex-col space-y-2">
            <label>
              <input
                type="radio"
                name="rentOptions"
                value="1_week"
                className="mr-2"
              />
              Rent for 1 week
            </label>
            <label>
              <input
                type="radio"
                name="rentOptions"
                value="2_weeks"
                className="mr-2"
              />
              Rent for 2 weeks
            </label>
            <label>
              <input
                type="radio"
                name="rentOptions"
                value="3_weeks"
                className="mr-2"
              />
              Rent for 3 weeks
            </label>
            <label>
              <input
                type="radio"
                name="rentOptions"
                value="buy"
                className="mr-2"
              />
              Buy Now
            </label>
          </div>
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-lg mt-6 font-bold"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>

        {/* Cart Items */}
        <aside className="bg-[#FAF0DF] p-4 rounded-lg">
          <h3 className="text-xl font-bold text-[#8D6F5E] mb-4">Your Cart</h3>
          {cart.length > 0 ? (
            <>
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.cartID}
                    className="mb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-[#8D6F5E] font-semibold">
                        {item.title}
                      </p>
                      <p className="text-[#C69E80] text-sm">{item.author}</p>
                    </div>
                    <button
                      className="bg-red-400 text-white px-2 py-1 rounded-lg text-sm"
                      onClick={() => handleRemoveFromCart(item.cartID)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="bg-orange-400 font-bold text-white px-4 py-2 rounded-lg mt-6 w-full"
                onClick={() => router.push("/cart")}
              >
                Go to Cart
              </button>
            </>
          ) : (
            <p className="text-[#C69E80] text-sm">Your cart is empty.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
