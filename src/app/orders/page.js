"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBook, FaShoppingCart, FaUser } from "react-icons/fa";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch orders from the API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/books?type=orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FFF7EB]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#FAF0DF] p-6">
        <h1 className="text-lg font-bold mb-4 text-[#8D6F5E] flex items-center">
          <FaBook className="mr-2" /> BooksRental.mv
        </h1>
        <nav>
          <ul className="space-y-2">
            <li className="hover:bg-[#EFE4D4] p-2 rounded-lg">
              <a href="/" className="block text-[#8D6F5E]">
                Home
              </a>
            </li>
            <li className="hover:bg-[#EFE4D4] p-2 rounded-lg">
              <a href="/books" className="block text-[#8D6F5E]">
                Books
              </a>
            </li>
            <li className="hover:bg-[#EFE4D4] p-2 rounded-lg">
              <a href="/orders" className="block text-[#8D6F5E]">
                Orders
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <header className="bg-[#FAF0DF] py-4 pr-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#8D6F5E]">Orders</h2>
          <div className="space-x-4 flex items-center">
            <FaShoppingCart
              className="text-2xl text-[#C69E80] hover:text-[#8D6F5E] cursor-pointer"
              onClick={() => router.push("/cart")}
            />
          </div>
        </header>

        {/* Orders List */}
        <main className="p-6">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.orderID}
                  className="flex items-center justify-between bg-[#FAF0DF] p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center">
                    <img
                      src={order.imagePath || "/placeholder.jpg"}
                      alt={order.title}
                      className="w-20 h-20 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#8D6F5E]">
                        {order.title}
                      </h3>
                      <p className="text-sm text-[#C69E80]">{order.author}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-[#8D6F5E] font-bold">
                      Payment: {order.paymentStatus}
                    </p>
                    <p className="text-lg text-[#8D6F5E] font-bold">
                      Delivery: {order.deliveryStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#C69E80] text-lg">No orders available.</p>
          )}
        </main>
      </div>
    </div>
  );
}
