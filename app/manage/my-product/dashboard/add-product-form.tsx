"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProductFormValues, productSchema } from "@/lib/db/product.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { createProduct } from "@/lib/actions/product";
import { authClient } from "@/lib/auth-client";

export default function AddProductForm() {
  const session = authClient.useSession();
  const userId = session.data?.user.id;
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Initialize form with the schema resolver
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "", // This will be generated on the server
      sellerId: userId || "",
      name: "",
      description: "",
      price: 0,
      category: "",
      condition: "new",
      status: "available",
      sustainabilityRating: 1,
      primaryImageUrl: "", // This will be set after uploading images
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...newFiles]);
    }
  };

  // Handle form submission
  async function onSubmit(data: ProductFormValues) {
    startTransition(() => {
      createProduct(data, imageFiles)
        .then(() => {
          toast({
            title: "Product added successfully",
            description: "Your product has been added to the store.",
          });
          form.reset();
          setImageFiles([]);
        })
        .catch((error) => {
          toast({
            title: "Failed to add product",
            description: error.message,
            variant: "destructive",
          });
        });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Left Column - Product Details */}
        <Card className="p-6 bg-card">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Informasi Produk
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nama produk"
                          className="bg-gray-800 border-gray-700"
                        />
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
                      <FormLabel>Deskripsi Produk</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Masukkan deskripsi produk"
                          className="min-h-[100px] bg-gray-800 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi Produk</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Pilih kondisi produk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">Baru</SelectItem>
                          <SelectItem value="used">Bekas</SelectItem>
                          <SelectItem value="rework">Rework</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sustainabilityRating"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Rating Keberlanjutan</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          max="10"
                          value={value || ""}
                          onChange={(e) =>
                            onChange(parseInt(e.target.value) || 1)
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Masukkan rating keberlanjutan produk (1-10).
                        <br />1 ={" "}
                        <span className="text-red-500">
                          Sangat Tidak Berkelanjutan
                        </span>
                        , 10 =
                        <span className="text-green-500">
                          {" "}
                          Sangat Berkelanjutan
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="primaryImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar Produk</FormLabel>
                  <FormControl>
                    <div>
                      <div className="grid gap-4">
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ImagePlus className="h-8 w-8 text-gray-400" />
                            <div>
                              <Input
                                id="productImages"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                  handleImageChange(e);
                                  field.onChange(e);
                                }}
                                value={field.value}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                className="bg-gray-800"
                                onClick={() =>
                                  document
                                    .getElementById("productImages")
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4" /> Browse
                                Images
                              </Button>
                            </div>
                            <p className="text-sm text-gray-400">
                              or drag and drop
                            </p>
                          </div>
                        </div>

                        {/* Display selected images */}
                        {imageFiles.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              Selected Images ({imageFiles.length})
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                              {imageFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="relative bg-gray-800 rounded p-1"
                                >
                                  <div className="text-xs text-gray-400 truncate">
                                    {file.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    <span className="text-red-500">* </span>
                    gambar pertama adalah gambar utama produk
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Right Column - Pricing & Status */}
        <div className="space-y-6">
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-medium text-white mb-4">Harga</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      Harga{" "}
                      <span className="text-sm text-gray-400">
                        (IDR / unit)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        value={value ? value.toLocaleString("id-ID") : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, ""); // Hapus semua non-angka
                          onChange(rawValue ? parseInt(rawValue) : 0);
                        }}
                        placeholder="Rp."
                        className="bg-gray-800 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <h3 className="text-lg font-medium text-white mb-4">
              Status Produk
            </h3>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Tersedia</SelectItem>
                      <SelectItem value="sold">Terjual</SelectItem>
                      <SelectItem value="barter">Ditukar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-400">
                    Pilih status produk
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="p-6 bg-card ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Kategori Produk
              </h3>
              {/* <Button
                type="button"
                size="sm"
                variant="secondary"
                className="bg-gray-800"
                onClick={() => setOpenCategoryDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button> */}
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-card border-white">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clothing">Baju</SelectItem>
                      <SelectItem value="accessories">Aksesoris</SelectItem>
                      <SelectItem value="footwear">Sepatu</SelectItem>
                      {/* Add more categories as needed */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin text-center"/> : "Tambah Produk"}
            </Button>
          </div>
        </div>
      </form>

      {/* Category Dialog */}
      {/* {openCategoryDialog && (
        <AddCategoryDialog
          open={openCategoryDialog}
          onOpenChange={setOpenCategoryDialog}
        />
      )} */}
    </Form>
  );
}
