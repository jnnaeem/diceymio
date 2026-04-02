import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import {
  listAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./admin-product.controller";

const router = Router();

router.get("/", authenticate, authorizeAdmin, listAllProductsController);
router.post("/", authenticate, authorizeAdmin, createProductController);
router.put("/:id", authenticate, authorizeAdmin, updateProductController);
router.delete("/:id", authenticate, authorizeAdmin, deleteProductController);

export default router;
