import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";
interface OrderSpecificSectionWrapper extends PropsWithChildren {
  className?:string
}

const OrderSpecificSectionWrapper = ({
  className,
  children,
}: OrderSpecificSectionWrapper) => {
  return <div>
    <div className={cn(`${className} flex gap-1.5 bg-gray-50 shadow-sm py-4`)}>{children}</div>
  </div>
};

export default OrderSpecificSectionWrapper;
