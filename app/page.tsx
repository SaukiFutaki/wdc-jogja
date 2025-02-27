/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import ProductForm from "@/components/demo/FormData";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  
  return (
    <div className="container  mx-10">
    
    </div>
  );
}
