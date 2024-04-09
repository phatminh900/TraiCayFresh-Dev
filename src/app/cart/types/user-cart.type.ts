import { Product } from "@/payload/payload-types";

export type UserCart=(Product & {quantity:number})[]
