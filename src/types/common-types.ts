import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";

export interface IUser {
    user:Customer|CustomerPhoneNumber|undefined
}