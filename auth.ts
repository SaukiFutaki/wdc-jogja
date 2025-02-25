import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/db"; // your drizzle instance
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", 
    }),
    emailAndPassword :{
        enabled     : true,
    },
    socialProviders: { 
        github: { 
         clientId: process.env.GITHUB_CLIENT_ID!, 
         clientSecret: process.env.GITHUB_CLIENT_SECRET!, 
        } 
     }, 
});