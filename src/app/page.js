"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link from next/link
import { useRouter } from "next/navigation";
import { FaHeart, FaShoppingCart, FaUser, FaBook } from "react-icons/fa";



export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const router = useRouter();

  // Fetch books and categories from the API
  useEffect(() => {
    async function fetchData() {
      try {
        const booksResponse = await fetch("/api/books?type=books");
        if (!booksResponse.ok) throw new Error("Failed to fetch books");
        const booksData = await booksResponse.json();
        setBooks(Array.isArray(booksData) ? booksData : []);
        setFilteredBooks(Array.isArray(booksData) ? booksData : []);

        const categoriesResponse = await fetch("/api/books?type=categories");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Filter books by search query and category
  useEffect(() => {
    if (Array.isArray(books)) {
      const filtered = books.filter((book) => {
        const matchesSearch = book.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || book.categoryID === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      setFilteredBooks(filtered);
    }
  }, [searchQuery, selectedCategory, books]);

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
          <input
            type="text"
            placeholder="Search"
            className="p-3 rounded-lg border border-[#E7D8C7] w-96 bg-[#FDF8F2] text-[#8D6F5E] placeholder-[#C6AC96]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-x-4 flex items-center">
            <FaShoppingCart
              className="text-2xl text-[#C69E80] hover:text-[#8D6F5E] cursor-pointer"
              onClick={() => router.push("/cart")}
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Categories */}
          <div className="mb-6 space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === "All" ? "bg-[#E3D9C5]" : "bg-[#EFE4D4]"
              } hover:bg-[#E3D9C5] text-[#8D6F5E]`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryID}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category.categoryID
                    ? "bg-[#E3D9C5]"
                    : "bg-[#EFE4D4]"
                } hover:bg-[#E3D9C5] text-[#8D6F5E]`}
                onClick={() => setSelectedCategory(category.categoryID)}
              >
                {category.categoryName}
              </button>
            ))}
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <Link key={index} href={`/books/${book.bookID}`} passHref>
                  <div className="rounded-2xl bg-[#FFF7EB] p-4 hover:shadow-lg hover:bg-[#F5EAD5] cursor-pointer">
                    <img
                      src={`${book.imagePath}`}
                      alt={book.title}
                      className="mb-4 rounded-lg"
                    />
                    <h3 className="text-lg font-bold text-[#8D6F5E]">
                      {book.title}
                    </h3>
                    <p className="text-[#B08968]">{book.author}</p>
                    <p className="text-green-600 font-bold">
                      ${book.rentalPrice.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-[#8D6F5E]">No books available</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
