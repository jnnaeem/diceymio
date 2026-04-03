import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { globalErrorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.route";
import productRoutes from "./modules/product/product.route";
import cartRoutes from "./modules/cart/cart.route";
import orderRoutes from "./modules/order/order.route";
import adminProductRoutes from "./modules/admin/admin-product.route";
import adminOrderRoutes from "./modules/admin/admin-order.route";
import adminUserRoutes from "./modules/admin/admin-user.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const staticPath = path.join(process.cwd(), "uploads");
console.log(`[Static] Serving files from: ${staticPath}`);
app.use("/uploads", express.static(staticPath));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error Handler (must be last)
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
