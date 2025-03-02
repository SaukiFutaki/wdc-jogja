"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsLogin from "./tabs-login";
import TabsRegis from "./tabs-regis";

export default function TabsAuth() {

  return (
    <Tabs defaultValue="register" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>

      {/* Register Form */}
      <TabsContent value="register">
       <TabsRegis />
      </TabsContent>

      {/* Login Form */}
      <TabsContent value="login">
        <TabsLogin />
      </TabsContent>
    </Tabs>
  );
}
