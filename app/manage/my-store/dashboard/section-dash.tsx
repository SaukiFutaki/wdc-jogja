/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Calendar,
  Download,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 5000 },
  { name: "Mar", value: 3000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 5500 },
  { name: "Jun", value: 4800 },
];

const barData = [
  { name: "Jan", desktop: 2400, mobile: 2000 },
  { name: "Feb", desktop: 3200, mobile: 3800 },
  { name: "Mar", desktop: 2800, mobile: 2600 },
  { name: "Apr", desktop: 2000, mobile: 1800 },
  { name: "May", desktop: 3600, mobile: 3200 },
  { name: "Jun", desktop: 2800, mobile: 2400 },
];

const returningRateData = [
  { name: "Jan", rate1: 30, rate2: 20 },
  { name: "Feb", rate1: 45, rate2: 35 },
  { name: "Mar", rate1: 55, rate2: 40 },
  { name: "Apr", rate1: 40, rate2: 45 },
  { name: "May", rate1: 50, rate2: 50 },
  { name: "Jun", rate1: 52, rate2: 48 },
];

// Recent orders demo data
const recentOrders = [
  {
    id: "ORD-7352",
    customer: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    date: "2025-03-01",
    amount: "$129.99",
    status: "completed",
    items: 3,
    customer_image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ7MHP4dBZeGhmHFG8VDI4FrsNQSIylvvmmTDE9dogiaGyPRVPz=s96-c",
  },
  {
    id: "ORD-7351",
    customer: "Michael Chen",
    customerEmail: "m.chen@example.com",
    date: "2025-03-01",
    amount: "$89.50",
    status: "processing",
    items: 2,
    customer_image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ7MHP4dBZeGhmHFG8VDI4FrsNQSIylvvmmTDE9dogiaGyPRVPz=s96-c",
  },
  {
    id: "ORD-7350",
    customer: "Emma Davis",
    customerEmail: "emma.d@example.com",
    date: "2025-02-29",
    amount: "$245.75",
    status: "completed",
    items: 4,
    customer_image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ7MHP4dBZeGhmHFG8VDI4FrsNQSIylvvmmTDE9dogiaGyPRVPz=s96-c",
  },
  {
    id: "ORD-7349",
    customer: "James Wilson",
    customerEmail: "jwilson@example.com",
    date: "2025-02-29",
    amount: "$49.99",
    status: "completed",
    items: 1,
    customer_image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ7MHP4dBZeGhmHFG8VDI4FrsNQSIylvvmmTDE9dogiaGyPRVPz=s96-c",
  },
  {
    id: "ORD-7348",
    customer_image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ7MHP4dBZeGhmHFG8VDI4FrsNQSIylvvmmTDE9dogiaGyPRVPz=s96-c",
    customer: "Olivia Rodriguez",
    customerEmail: "o.rodriguez@example.com",
    date: "2025-02-28",
    amount: "$178.25",
    status: "pending",
    items: 3,
  },
];

// Best selling products demo data
const bestSellingProducts = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    category: "Electronics",
    price: "$89.99",
    stock: 125,
    sold: 843,
    image: "/earbuds.jpg",
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    category: "Furniture",
    price: "$199.99",
    stock: 42,
    sold: 632,
    image: "/chair.jpg",
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    category: "Electronics",
    price: "$249.99",
    stock: 78,
    sold: 591,
    image: "/watch.jpg",
  },
  {
    id: 4,
    name: "Premium Coffee Maker",
    category: "Kitchen",
    price: "$129.99",
    stock: 104,
    sold: 529,
    image: "/coffeemaker.jpg",
  },
  {
    id: 5,
    name: "Portable Power Bank",
    category: "Electronics",
    price: "$45.99",
    stock: 215,
    sold: 487,
    image: "/powerbank.jpg",
  },
];
export default function DashSection() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <ContentLayout title="my dashboard">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ScrollArea className="h-[calc(100vh-48px-36px-16px-32px)] lg:h-[calc(100vh-32px-40px-32px)]">
        {/* Top cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Revenue Card */}
          <Card>
            <CardHeader>
              <CardTitle>Line Chart - Label</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Sales Card */}
          <Card>
            <CardHeader>
              <CardTitle>Line Chart - Label</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Active Users Card */}
          <Card>
            <CardHeader>
              <CardTitle>Line Chart - Label</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Orders</CardTitle>
                <CardDescription>
                  You have {recentOrders.length} orders this period
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 flex-row">
                          <Avatar>
                            <AvatarImage
                              src={order.customer_image}
                              alt="avatar"
                            />
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{order.customer}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.customerEmail}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "processing"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Best Selling Products Section */}
        <div className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Best Selling Products</CardTitle>
                <CardDescription>
                  Your top 5 products this month
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All Products
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Units Sold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bestSellingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={product.image}
                              alt={product.name}
                            />
                            <AvatarFallback className="bg-muted">
                              <Package className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        {product.stock < 50 ? (
                          <span className="text-red-500">{product.stock}</span>
                        ) : (
                          product.stock
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.sold}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Total Revenue */}
          <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>

          {/* Returning Rate */}
          <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
        </div>
      </ScrollArea>
      {/* Settings Button */}
    </ContentLayout>
  );
}
