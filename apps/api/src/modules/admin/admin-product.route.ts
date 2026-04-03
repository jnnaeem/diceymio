import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import {
  listAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController,
  uploadProductImageController,
} from "./admin-product.controller";

const router = Router();

router.get("/", authenticate, authorizeAdmin, listAllProductsController);
router.post("/", authenticate, authorizeAdmin, createProductController);
router.post("/upload", authenticate, authorizeAdmin, upload.single("image"), uploadProductImageController);
router.put("/:id", authenticate, authorizeAdmin, updateProductController);
router.delete("/:id", authenticate, authorizeAdmin, deleteProductController);

export default router;
