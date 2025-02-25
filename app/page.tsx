import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);
  return (
    <div>
      <Navbar />
    </div>
  );
}
