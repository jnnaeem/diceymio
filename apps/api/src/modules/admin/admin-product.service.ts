import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";
import { CreateProductInput, UpdateProductInput } from "./admin-product.validation";

export const listAllProductsAdmin = async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createProduct = async (input: CreateProductInput) => {
  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      image: input.image,
    },
  });
};

export const updateProduct = async (id: string, input: UpdateProductInput) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: input,
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
};
