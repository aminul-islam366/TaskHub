"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Load product from localStorage
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const foundProduct = products.find((p) => p.id === parseInt(params.id));

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Product not found, redirect to products page
      Swal.fire({
        title: "Product Not Found",
        text: "The product you are looking for does not exist.",
        icon: "error",
        confirmButtonColor: "#4F46E5",
      }).then(() => {
        router.push("/products");
      });
    }
  }, [params.id, router]);

  const handleOrder = () => {
    if (quantity > product.stock) {
      Swal.fire({
        title: "Insufficient Stock",
        text: `Only ${product.stock} items available in stock.`,
        icon: "warning",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    Swal.fire({
      title: "Confirm Order",
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Product:</strong> ${product.name}</p>
          <p class="mb-2"><strong>Quantity:</strong> ${quantity}</p>
          <p class="mb-2"><strong>Price per item:</strong> $${product.price.toFixed(2)}</p>
          <p class="mb-2 text-xl"><strong>Total:</strong> $${(product.price * quantity).toFixed(2)}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Place Order",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        // Update stock in localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const updatedProducts = products.map((p) => {
          if (p.id === product.id) {
            return { ...p, stock: p.stock - quantity };
          }
          return p;
        });
        localStorage.setItem("products", JSON.stringify(updatedProducts));

        // Show success message
        Swal.fire({
          title: "Order Placed Successfully!",
          html: `
            <div class="text-left">
              <p class="mb-2">Thank you for your order! 🎉</p>
              <p class="mb-2"><strong>Order Details:</strong></p>
              <p class="mb-1">Product: ${product.name}</p>
              <p class="mb-1">Quantity: ${quantity}</p>
              <p class="mb-1">Total: $${(product.price * quantity).toFixed(2)}</p>
              <p class="mt-4 text-green-600 font-semibold">Your order will be delivered soon!</p>
            </div>
          `,
          icon: "success",
          confirmButtonText: "Continue Shopping",
          confirmButtonColor: "#4F46E5",
        }).then(() => {
          router.push("/products");
        });
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete product from localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const updatedProducts = products.filter((p) => p.id !== product.id);
        localStorage.setItem("products", JSON.stringify(updatedProducts));

        Swal.fire({
          title: "Deleted!",
          text: "Product has been deleted.",
          icon: "success",
          confirmButtonColor: "#4F46E5",
        }).then(() => {
          router.push("/products");
        });
      }
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {product.category}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of Stock"}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              product.stock,
                              parseInt(e.target.value) || 1,
                            ),
                          ),
                        )
                      }
                      min="1"
                      max={product.stock}
                      className="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      +
                    </button>
                    <span className="text-gray-600">
                      Total: ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-auto">
                <button
                  onClick={handleOrder}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-lg font-semibold text-lg transition ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : "Place Order"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Product ID:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {product.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Added:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
