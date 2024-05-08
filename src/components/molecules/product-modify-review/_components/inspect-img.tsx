import {PropsWithChildren, useState} from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IoCloseOutline } from "react-icons/io5"
interface ProductInspectReviewImgProps extends PropsWithChildren{}
export function ProductInspectReviewImg({children}:ProductInspectReviewImgProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        
        <p>Hello</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
        {children}

        </Button>
      </SheetTrigger>
      <SheetContent side='bottom' className="h-screen bg-white/90 backdrop-blur-sm flex items-center">
        <div className="w-full mx-auto aspect-square relative">
            {children}
        </div>
          <SheetClose asChild>
            <button className="absolute top-[2%] right-[4%]">
            <IoCloseOutline size={30} className="hover:text-destructive"/>
            </button>
          </SheetClose>
      </SheetContent>
    </Sheet>
  )
}


export default ProductInspectReviewImg