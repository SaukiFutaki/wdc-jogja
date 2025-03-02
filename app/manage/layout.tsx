import { auth } from "@/auth";
import DashboardPanelLayout from "@/components/dashboard-panel/dashboard-panel-layout";
import { Overpass_Mono } from "next/font/google";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";

const overpassMono = Overpass_Mono({
  weight : ["400"],
  subsets : ["latin"]
})

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session) {
    redirect("/auth")
  }
  if (session?.user.emailVerified === false) {
    forbidden()
  }
  return <DashboardPanelLayout className={`${overpassMono.className}`}>{children}</DashboardPanelLayout>;
}
