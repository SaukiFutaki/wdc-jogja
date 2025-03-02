/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ProductFormValues } from "./db/schema.zod";
import { db } from "./db/db";
import { product, productToCategory } from "./db/schema";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
