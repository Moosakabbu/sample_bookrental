"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBook, FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.rentalPrice, 0).toFixed(2);
  };

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
        </header>
        {/* Breadcrumb */}
        <span className="text-[#8D6F5E]">
          <button
            onClick={() => router.push("/")}
            className="hover:underline text-[#8D6F5E] font-bold"
          >
            Home
          </button>
        </span>
      </nav>

      <main className="p-6">
        <h2 className="text-3xl font-bold text-[#8D6F5E] mb-6">
          Shopping Cart
        </h2>
        {cart.length > 0 ? (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.cartID}
                className="flex items-center justify-between bg-[#FAF0DF] p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <img
                    src={item.imagePath || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-[#8D6F5E]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#C69E80]">{item.author}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-lg text-[#8D6F5E] font-bold mr-6">
                    ${item.rentalPrice.toFixed(2)}
                  </p>
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleRemoveFromCart(item.cartID)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center p-4 bg-[#FAF0DF] rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-[#8D6F5E]">
                Subtotal ({cart.length} items)
              </h3>
              <p className="text-lg font-bold text-[#8D6F5E]">
                ${calculateSubtotal()}
              </p>
            </div>
            <button
              className="bg-orange-400 text-white px-6 py-3 rounded-lg w-full font-bold"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[#C69E80] text-lg mb-6">Your cart is empty.</p>
            <button
              className="bg-orange-400 text-white px-6 py-3 rounded-lg font-bold"
              onClick={() => router.push("/")}
            >
              Go Back to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
