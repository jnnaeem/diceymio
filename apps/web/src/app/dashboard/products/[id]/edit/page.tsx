"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminProductAPI } from "@/lib/adminServices";
import { productAPI } from "@/lib/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required").refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be a positive number"),
  stock: z.string().min(1, "Stock is required").refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Stock must be 0 or greater"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "0",
      image: "",
    },
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await productAPI.getOne(productId);
      form.reset({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price),
        stock: String(product.stock),
        image: product.image || "",
      });
    } catch (err) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setError("");
    try {
      setSaving(true);
      await adminProductAPI.update(productId, {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: parseFloat(data.price),
        stock: parseInt(data.stock || "0"),
        image: data.image?.trim() || undefined,
      });
      router.push("/dashboard/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-accent font-bold md:text-2xl text-xl">Edit Product</h2>
          <p className="text-accent-foreground md:text-base text-sm">
            Update product details
          </p>
        </div>
        <Button asChild variant="outline" className="bg-white dark:bg-[#27292D] hover:bg-card active:scale-95 transition-all">
          <Link href="/dashboard/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="border card-border shadow-lg shadow-[#2E2D740D] rounded-[10px] overflow-hidden bg-card mt-8 sm:p-8 p-5">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (BDT) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" min={1} {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                      </span>
                      <Input {...field} className="pl-10 h-11" />
                    </div>
                  </FormControl>
                  <FormMessage />

                  {field.value && !form.formState.errors.image && (
                    <div className="mt-4 border card-border rounded-lg p-2 max-w-[200px] bg-muted/20">
                      <img
                        src={field.value}
                        alt="Preview"
                        className="w-full h-auto rounded object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
                disabled={saving}
                className="active:scale-95 transition-all cursor-pointer hover:bg-card"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-white active:scale-95 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

