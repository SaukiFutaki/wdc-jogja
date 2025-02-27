/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  HelpCircleIcon,
  LucideIcon,
  MailIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

const components: {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Product Card",
    href: "/components/product-card",
    description:
      "Menampilkan informasi produk seperti gambar, harga, dan tombol beli.",
    icon: ShoppingBagIcon,
  },
  {
    title: "Review",
    href: "/components/review",
    description: "Menampilkan ulasan pelanggan dengan rating dan komentar.",
    icon: StarIcon,
  },
  {
    title: "Shopping Cart",
    href: "/components/cart",
    description:
      "Menampilkan daftar barang yang ditambahkan ke keranjang belanja.",
    icon: ShoppingCartIcon,
  },
  {
    title: "FAQ",
    href: "/components/faq",
    description:
      "Menampilkan pertanyaan dan jawaban umum seputar layanan dan produk.",
    icon: HelpCircleIcon,
  },
  {
    title: "Blog Post",
    href: "/components/blog",
    description:
      "Menampilkan artikel atau tutorial tentang fashion dan rework pakaian.",
    icon: FileTextIcon,
  },
  {
    title: "Subscription Form",
    href: "/components/subscription",
    description:
      "Formulir untuk berlangganan newsletter atau penawaran eksklusif.",
    icon: MailIcon,
  },
];

export default function RichNavigationMenu({
  className,
}: {
  className?: string;
}) {
  const textOnlyTriggerStyle =
    "text-white hover:text-gray-300 bg-transparent border-none shadow-none font-medium px-4 py-2 flex items-center gap-1 transition-colors";
  return (
    <div className={cn("flex justify-center w-full", className)}>
      <NavigationMenu className="z-20">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="  !bg-transparent hover:!bg-transparent text-white hover:text-gray-300 !border-0 !shadow-none !rounded-none font-medium px-4 py-2"
              style={{ boxShadow: "none" }}
            >
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-4">
              <div className="grid grid-cols-3 gap-3 p-4 w-[900px] divide-x">
                <div className="col-span-2">
                  <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                    Capabilities
                  </h6>
                  <ul className="mt-2.5 grid grid-cols-2 gap-3">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        icon={component.icon}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>

                <div className="pl-4">
                  <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground ">
                    Product & Features
                  </h6>
                  <ul className="mt-2.5 grid gap-3">
                    {components.slice(0, 3).map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        icon={component.icon}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="!bg-transparent hover:!bg-transparent text-white hover:text-gray-300 !border-0 !shadow-none !rounded-none font-medium px-4 py-2"
              style={{ boxShadow: "none" }}
            >
              Solutions
            </NavigationMenuTrigger>
            <NavigationMenuContent className="px-4 py-6">
              <div className="pl-4">
                <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                  Solutions
                </h6>
                <ul className="mt-2.5 grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/rework" legacyBehavior passHref>
              <NavigationMenuLink   className="!bg-transparent hover:!bg-transparent text-white hover:text-gray-300 !border-0 !shadow-none !rounded-none font-medium px-4 py-2"
                style={{ boxShadow: 'none' }}>
                  Rework
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/barter" legacyBehavior passHref>
              <NavigationMenuLink   className="!bg-transparent hover:!bg-transparent text-white hover:text-gray-300 !border-0 !shadow-none !rounded-none font-medium px-4 py-2"
                style={{ boxShadow: 'none' }}>
                Barter
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: LucideIcon }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="font-semibold tracking-tight leading-none flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
