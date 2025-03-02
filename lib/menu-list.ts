
import {
  Bookmark,
  LayoutGrid,
  LucideIcon,
  Settings,
  Store,
  Tag,
  Users
} from "lucide-react";
  
  type Submenu = {
    href: string;
    label: string;
    active?: boolean;
  };
  
  type Menu = {
    href: string;
    label: string;
    active?: boolean;
    icon: LucideIcon;
    submenus?: Submenu[];
  };
  
  type Group = {
    groupLabel: string;
    menus: Menu[];
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function getMenuList(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/",
            label: "Dashboard",
            icon: LayoutGrid,
            submenus: []
          }
        ]
      },
      {
        groupLabel: "Contents",
        menus: [
          {
            href: "/manage/my-store",
            label: "My Store",
            icon: Store,
            submenus: [
                {
                    href: "/manage/my-store/dashboard/",
                    label: "Dashboard"
                  },
              {
                href: "/manage/my-store/products",
                label: "Products"
           
              }
           
            ]
          },
          {
            href: "/categories",
            label: "Categories",
            icon: Bookmark
          },
          {
            href: "/tags",
            label: "Tags",
            icon: Tag
          }
        ]
      },
      {
        groupLabel: "Settings",
        menus: [
          {
            href: "/users",
            label: "Users",
            icon: Users
          },
          {
            href: "/account",
            label: "Account",
            icon: Settings
          }
        ]
      }
    ];
  }
  