// First, extract the component to be a proper React component

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct, updateProduct } from "@/lib/actions/product";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { Eye, Loader2, MoreHorizontal, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
// Define product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: "new" | "used" | "rework";
  quantity: number;
  discount: number;
  type: "barter" | "jual";
  sustainableRating: number;
  primaryImageUrl?: string;
  status: string;
  updatedAt: string;
}

interface SelectableFields {
  category: string;
  condition: "new" | "used" | "rework";
  type: "barter" | "jual";
}

export const ActionCell = ({ row }: { row: Row<Product> }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...row.original });
  const product = row.original;

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  const handleSave = async () => {
   
    startTransition(() => {
      const productUpdate = {
        name: editedProduct.name,
        description: editedProduct.description,
        price: editedProduct.price,
        category: editedProduct.category,
        condition: editedProduct.condition as "new" | "used" | "rework",
        quantity: editedProduct.quantity,
        discount: editedProduct.discount,
      
        type:
          editedProduct.type === "barter" || editedProduct.type === "jual"
            ? editedProduct.type
            : "barter",
      
        sustainabilityRating: editedProduct.sustainableRating,
      };

      updateProduct(product.id, productUpdate);
      setIsEditing(false);
      toast({
        title: "Produk diperbarui",
        description: "Perubahan pada produk berhasil disimpan",
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setEditedProduct((prev: Product) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity"
          ? Number(value)
          : name === "discount"
          ? Math.min(Number(value), 100) //  max 100
          : value,
    }));
  };

  const handleSelectChange = (
    fieldName: keyof SelectableFields,
    value: string
  ): void => {
    setEditedProduct((prev: Product) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const priceAfterDiscount =
    product.price - (product.price * product.discount) / 100;

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(product.id)}
          >
            Copy product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsViewDialogOpen(true);
                  setIsEditing(false);
                  setEditedProduct({ ...product });
                }}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View product
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-card border-card">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-semibold text-white">
                    {isEditing ? "Edit Produk" : "Detail produk"}
                  </DialogTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="text-white border-white mt-4"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-2">
          
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                  <Image
                    src={product.primaryImageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                      {product.discount}%
                    </div>
                  )}
                </div>

            
                <div className="space-y-6">
                  <div>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-400">Nama Produk</Label>
                          <Input
                            name="name"
                            value={editedProduct.name}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">
                            Deskripsi Produk
                          </Label>
                          <Input
                            name="description"
                            value={editedProduct.description}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-white">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-gray-400">
                          {product.description}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">Harga Produk</Label>
                          <Input
                            name="price"
                            type="number"
                            value={editedProduct.price}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400">
                            Diskon Produk (%)
                          </Label>
                          <Input
                            name="discount"
                            type="number"
                            value={editedProduct.discount}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        {product.discount > 0 && (
                          <span className="text-lg text-gray-500">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(priceAfterDiscount)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < product.sustainableRating
                                ? "fill-yellow-500 text-yellow-500"
                                : "fill-gray-600 text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        Rating keberlanjutan
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {isEditing ? (
                      <>
                        <div>
                          <Label className="text-gray-400">
                            Kategori Produk
                          </Label>
                          <Select
                            defaultValue={editedProduct.category}
                            onValueChange={(value) =>
                              handleSelectChange("category", value)
                            }
                          >
                            <SelectTrigger className="mt-1 bg-gray-800 text-white w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clothes">Baju</SelectItem>
                              <SelectItem value="pants">Celana</SelectItem>
                              <SelectItem value="jacket">Jaket</SelectItem>
                              <SelectItem value="accessories">
                                Aksesories
                              </SelectItem>
                              <SelectItem value="other">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-400">Tipe Produk</Label>
                          <Select
                            value={editedProduct.type}
                            onValueChange={(value) =>
                              handleSelectChange("type", value)
                            }
                          >
                            <SelectTrigger className="mt-1 bg-gray-800 text-white w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="barter">Barter</SelectItem>
                              <SelectItem value="jual">Jual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-400">Kondisi</Label>
                          <Select
                            value={editedProduct.condition}
                            onValueChange={(value) =>
                              handleSelectChange("condition", value)
                            }
                          >
                            <SelectTrigger className="mt-1 bg-gray-800 text-white w-full">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="used">Used</SelectItem>
                              <SelectItem value="rework">Rework</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-400">Jumlah</Label>
                          <Input
                            name="quantity"
                            type="number"
                            value={editedProduct.quantity}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 text-white"
                          />
                        </div>
                      </>
                    ) : (
                    
                      <>
                        <div>
                          <span className="text-gray-400">Category</span>
                          <p className="mt-1 font-medium text-white">
                            {product.category}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Type</span>
                          <p className="mt-1 font-medium text-white">
                            {product.type}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Condition</span>
                          <p className="mt-1 font-medium text-white">
                            {product.condition}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-400">Status</span>
                          <Badge
                            variant="outline"
                            className={
                              product.condition === "new"
                                ? "bg-green-500/20 text-green-500 border-green-500 text-center"
                                : product.condition === "used"
                                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500 text-center"
                                : "bg-gray-500/20 text-gray-500 border-gray-500"
                            }
                          >
                            {product.condition}
                          </Badge>
                          
                        </div>
                        <div>
                          <span className="text-gray-400">Quantity</span>
                          <p className="mt-1 font-medium text-white">
                            {product.quantity}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Updated</span>
                          <p className="mt-1 font-medium text-white">
                            {format(new Date(product.updatedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator className="bg-gray-800" />

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin w-4 h-4 text-center" />
                        ) : (
                          "Simpan Perubahan"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedProduct({ ...product });
                        }}
                        disabled={isPending}
                        className="text-white border-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenuItem
            onClick={() => handleDelete(product.id)}
            className="text-red-500 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
