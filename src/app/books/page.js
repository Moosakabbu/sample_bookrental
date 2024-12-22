"use client";
import { useEffect, useState } from "react";
import { FaBook } from 'react-icons/fa';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    rentalPrice: "",
    categoryID: "",
    availability: true,
    bookID: null, // Ensure bookID is part of the form data
  });

  // Fetch books and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const booksResponse = await fetch("/api/books?type=books");
        if (!booksResponse.ok) throw new Error("Failed to fetch books");
        const booksData = await booksResponse.json();
        setBooks(booksData);

        const categoriesResponse = await fetch("/api/books?type=categories");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    setModalType("add");
    setFormData({
      title: "",
      author: "",
      rentalPrice: "",
      categoryID: categories.length ? categories[0].categoryID : "",
      availability: true,
      bookID: null, // Clear bookID for new entries
    });
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setModalType("edit");
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      rentalPrice: book.rentalPrice,
      categoryID: book.categoryID,
      availability: book.availability,
      bookID: book.bookID, // Ensure bookID is set for updates
    });
    setShowModal(true);
  };

  const handleDelete = async (bookID) => {
    try {
      const response = await fetch(`/api/books?id=${bookID}`, {
        method: "DELETE",
      });
      if (response.ok) setBooks(books.filter((book) => book.bookID !== bookID));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const fetchUpdatedBook = async (bookID) => {
    try {
      const response = await fetch(`/api/books?id=${bookID}&type=book`);
      if (!response.ok) throw new Error("Failed to fetch updated book");
      const updatedBook = await response.json();
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.bookID === updatedBook.bookID ? updatedBook : b
        )
      );
    } catch (error) {
      console.error("Error fetching updated book:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate formData
      if (
        !formData.title ||
        !formData.author ||
        !formData.rentalPrice ||
        !formData.categoryID
      ) {
        throw new Error("Please fill in all required fields.");
      }

      const url =
        modalType === "add" ? "/api/books" : `/api/books?id=${formData.bookID}`;
      const method = modalType === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rentalPrice: parseFloat(formData.rentalPrice), // Ensure rentalPrice is a number
        }),
      });

      const updatedBook = await response.json();

      if (modalType === "add") {
        setBooks([...books, updatedBook]);
      } else if (modalType === "edit") {
        await fetchUpdatedBook(formData.bookID); // Fetch and update the modified book
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save book:", error);
      alert(error.message); // Inform the user about missing fields
    }
  };

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
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#8D6F5E]">Manage Books</h2>
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-lg font-bold"
            onClick={handleAdd}
          >
            + Add Book
          </button>
        </header>
        <ul className="mt-6 space-y-4">
          {books.map((book, key) => (
            <li
              key={key}
              className="flex justify-between items-center bg-[#FAF0DF] p-4 rounded-lg"
            >
              <div>
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p>{book.author}</p>
                <p>
                  $
                  {book.rentalPrice
                    ? parseFloat(book.rentalPrice).toFixed(2)
                    : "N/A"}
                </p>
              </div>
              <div className="space-x-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleDelete(book.bookID)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">
                {modalType === "add" ? "Add Book" : "Edit Book"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  name="rentalPrice"
                  placeholder="Rental Price"
                  value={formData.rentalPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
                <select
                  name="categoryID"
                  value={formData.categoryID}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryID}
                      value={category.categoryID}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Available
                </label>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
