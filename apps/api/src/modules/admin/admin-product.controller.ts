import { asyncHandler } from "../../middleware/asyncHandler";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";
import { createProductSchema, updateProductSchema } from "./admin-product.validation";
import {
  listAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./admin-product.service";

export const listAllProductsController = asyncHandler(async (req, res) => {
  const products = await listAllProductsAdmin();
  sendSuccess(res, 200, products, "Products retrieved successfully");
});

export const createProductController = asyncHandler(async (req, res) => {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const product = await createProduct(result.data);
  sendSuccess(res, 201, product, "Product created successfully");
});

export const updateProductController = asyncHandler(async (req, res) => {
  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const product = await updateProduct(req.params.id as string, result.data);
  sendSuccess(res, 200, product, "Product updated successfully");
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const product = await deleteProduct(req.params.id as string);
  sendSuccess(res, 200, product, "Product deleted successfully");
});
