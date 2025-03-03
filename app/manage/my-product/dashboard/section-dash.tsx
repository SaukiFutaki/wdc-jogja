"use client";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductList, { Product } from "./product-list";
import AddProductForm from "./add-product-form";

export default function SectionDashProd({ data }: { data: Product[] }) {
  return (
    <ContentLayout title="my ">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>My Product</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4">
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className=" p-0 bg-background justify-start border-b rounded-none">
            <TabsTrigger
              value="list"
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              List Produk
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Tambah Produk
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <ProductList data={data} />
          </TabsContent>
          <TabsContent value="add">
            <AddProductForm />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
