"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminProductAPI } from "@/lib/adminServices";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number");
      return;
    }

    const stock = parseInt(form.stock) || 0;

    try {
      setLoading(true);
      await adminProductAPI.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price,
        stock,
        image: form.image.trim() || undefined,
      });
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Add a new product to your catalog</p>
        </div>
        <Link href="/dashboard/products" className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="product-name" className="form-label">Product Name *</label>
              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                placeholder="e.g. Catan Board Game"
              />
            </div>

            <div className="form-group">
              <label htmlFor="product-desc" className="form-label">Description</label>
              <textarea
                id="product-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="form-textarea"
                placeholder="Brief description of the product..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="product-price" className="form-label">Price ($) *</label>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="form-input"
                  placeholder="29.99"
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-stock" className="form-label">Stock</label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="form-input"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="product-image" className="form-label">Image URL</label>
              <input
                id="product-image"
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
              {form.image && (
                <div className="image-preview">
                  <img src={form.image} alt="Preview" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
              <Link href="/dashboard/products" className="btn btn-outline">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
