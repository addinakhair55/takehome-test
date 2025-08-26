import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

export default function Products() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ type: null, data: null });

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "price") {
      // hilangkan semua karakter non-angka
      const numericValue = value.replace(/\D/g, "");
      // format dengan titik ribuan
      value = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    setForm({ ...form, [name]: value });
  };

  const parseNumber = (val) => Number(val.replace(/\./g, "") || 0);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name Product is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    const price = parseNumber(form.price);
    if (!price) {
      newErrors.price = "Price is required";
    } else if (price <= 0) {
      newErrors.price = "Price must be greater than 0";
    } else if (price > 2147483647) {
      newErrors.price = "Price is too large";
    }

    const stock = Number(form.stock);
    if (!form.stock) {
      newErrors.stock = "Stock is required";
    } else if (stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      const res = await api.post("/products", {
        ...form,
        price: parseNumber(form.price),
        stock: Number(form.stock),
      });
      setProducts([...products, res.data.data]);
      setForm({ name: "", description: "", price: "", stock: "" });
      setErrors({});
    } catch (err) {
      alert(err.response?.data?.message || "Error creating product");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const res = await api.put(`/products/${editing}`, {
        ...form,
        price: parseNumber(form.price),
        stock: Number(form.stock),
      });
      setProducts(products.map((p) => (p.id === editing ? res.data.data : p)));
      setEditing(null);
      setForm({ name: "", description: "", price: "", stock: "" });
      setErrors({});
      setModal({ type: null, data: null });
    } catch (err) {
      alert(err.response?.data?.message || "Error updating product");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${modal.data}`);
      setProducts(products.filter((p) => p.id !== modal.data));
      setModal({ type: null, data: null });
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting product");
    }
  };

  const startEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      stock: product.stock,
    });
    setErrors({});
  };

  const confirmUpdate = () => setModal({ type: "update", data: null });
  const confirmDelete = (id) => setModal({ type: "delete", data: id });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
        Products
      </h1>

      {user?.role === "admin" && (
        <div className="mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-md">
          <h2 className="font-semibold text-base sm:text-lg mb-3 md:mb-4">
            {editing ? "Edit Product" : "Add Product"}
          </h2>
          <div className="flex flex-col gap-3 sm:gap-4">
            <input
              name="name"
              placeholder="Name Product"
              value={form.name}
              onChange={handleChange}
              className={`border p-2 sm:p-3 rounded-lg text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className={`border p-2 sm:p-3 rounded-lg text-sm ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

            {/* Price with formatting */}
            <input
              type="text"
              name="price"
              placeholder="Price (e.g., 1.000.000)"
              value={form.price}
              onChange={handleChange}
              className={`border p-2 sm:p-3 rounded-lg text-sm ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className={`border p-2 sm:p-3 rounded-lg text-sm ${
                errors.stock ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={editing ? confirmUpdate : handleCreate}
                className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg text-sm hover:bg-blue-600 transition w-full sm:w-auto"
              >
                {editing ? "Update Product" : "Add Product"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", description: "", price: "", stock: "" });
                    setErrors({});
                  }}
                  className="bg-gray-300 text-gray-800 p-2 sm:p-3 rounded-lg text-sm hover:bg-gray-400 transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 sm:p-3 border font-medium">Name</th>
              <th className="p-2 sm:p-3 border font-medium hidden sm:table-cell">Description</th>
              <th className="p-2 sm:p-3 border font-medium">Price</th>
              <th className="p-2 sm:p-3 border font-medium">Stock</th>
              {user?.role === "admin" && (
                <th className="p-2 sm:p-3 border font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 sm:p-3 border">{p.name}</td>
                <td className="p-2 sm:p-3 border hidden sm:table-cell">{p.description}</td>
                <td className="p-2 sm:p-3 border">{formatRupiah(p.price)}</td>
                <td className="p-2 sm:p-3 border">{p.stock}</td>
                {user?.role === "admin" && (
                  <td className="p-2 sm:p-3 border flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-yellow-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {modal.type === "delete"
                ? "Are you sure you want to delete this product?"
                : "Are you sure you want to update this product?"}
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal({ type: null, data: null })}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={modal.type === "delete" ? handleDelete : handleUpdate}
                className={`px-4 py-2 rounded-lg text-white ${
                  modal.type === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
