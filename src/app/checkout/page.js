"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBook } from "react-icons/fa";

export default function CheckoutPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: 1 }), // Example userID; replace with dynamic value if needed
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      alert("Order placed successfully!");
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7EB]">
      {/* Navbar */}
      <nav className="bg-[#FAF0DF] p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-lg font-bold mb-4 text-[#8D6F5E] flex items-center">
            <FaBook className="mr-2" /> BooksRental.mv
          </h1>
        </header>
        <span className="text-[#8D6F5E]">
          <button
            onClick={() => router.push("/")}
            className="hover:underline text-[#8D6F5E] font-bold"
          >
            Home
          </button>
          {" / "}
          <button
            onClick={() => router.push("/cart")}
            className="hover:underline text-[#8D6F5E] font-bold"
          >
            Cart
          </button>{" "}
          / Checkout
        </span>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-3xl font-bold text-[#8D6F5E] mb-6">Checkout</h2>
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <p className="text-[#8D6F5E] font-bold mb-2">Step 1 of 4</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-400 h-2 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
            <p className="text-sm text-[#C69E80] mt-2">Shipping</p>
          </div>

          {/* Shipping Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8D6F5E] font-bold mb-1">
                First name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div>
              <label className="block text-[#8D6F5E] font-bold mb-1">
                Last name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[#8D6F5E] font-bold mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter address"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[#8D6F5E] font-bold mb-1">
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                placeholder="Enter additional address information"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div>
              <label className="block text-[#8D6F5E] font-bold mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div>
              <label className="block text-[#8D6F5E] font-bold mb-1">ZIP</label>
              <input
                type="text"
                placeholder="Enter ZIP code"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[#8D6F5E] font-bold mb-1">
                Phone number
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full p-3 rounded-lg border border-[#E7D8C7] bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
              />
            </div>
            <div className="col-span-2 flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-[#8D6F5E] text-sm">
                Save this information for next time
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="bg-[#EFE4D4] text-[#8D6F5E] px-6 py-3 rounded-lg font-bold hover:bg-[#E3D9C5]"
              onClick={() => router.push("/cart")}
            >
              Back to Cart
            </button>
            <button
              className="bg-orange-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-500"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center mt-4">Error: {error}</p>
          )}
        </div>
      </main>
    </div>
  );
}
