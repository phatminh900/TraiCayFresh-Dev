import * as React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
// import { useMediaQuery } from "@/hooks/use-media-query"
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { APP_URL } from "@/constants/navigation.constant";

export function CartRequestLogin() {
  const [open, setOpen] = React.useState(false);
  //   const isDesktop = useMediaQuery("(min-width: 768px)")

  //   if (isDesktop) {
  //     return (
  //       <Dialog open={open} onOpenChange={setOpen}>
  //         <DialogTrigger asChild>
  //           <Button variant="outline">Edit Profile</Button>
  //         </DialogTrigger>
  //         <DialogContent className="sm:max-w-[425px]">
  //           <DialogHeader>
  //             <DialogTitle>Edit profile</DialogTitle>
  //             <DialogDescription>
  //               Make changes to your profile here. Click save when you're done.
  //             </DialogDescription>
  //           </DialogHeader>
  //           <ProfileForm />
  //         </DialogContent>
  //       </Dialog>
  //     )
  //   }

  return (
    <Drawer  >
      <DrawerTrigger asChild>
        <Button variant='outline'>Thanh toán</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-4/5 pb-6 max-w-sm h-[50vh]'>
          <DrawerHeader className='text-center'>
            <DrawerTitle className='text-lg font-semibold'>
              Bạn chưa đăng nhập
            </DrawerTitle>
            <DrawerDescription className='text-sm'>
             Vui lòng đăng nhập tại đây
            </DrawerDescription>
            <Link
              href={{
                pathname: APP_URL.login,
                query: { origin: APP_URL.checkout.slice(1) },
              }}
              className={buttonVariants({ variant: "link",size:'lg', className: "mt text-lg" })}
            >
              Đăng nhập 
            </Link>
          </DrawerHeader>
          <div className="relative flex justify-center items-center mt-3 mb-8">
            <span className="absolute inset-0 border border-t-gray-300"/>
                <p className="flex items-center justify-center">
                    <span className="absolute block px-2 bg-background text-xs">Hoặc</span>
                </p>
        </div>
        <form className="flex flex-col ">

        <p className="text-lg font-bold text-center mb-2">Mua hàng bằng số điện thoại</p>
        <Input placeholder="Nhập số điện thoại" className="w-full"/>
        <Button className="w-1/2 self-center mt-4 block">Xác nhận</Button>
        <DrawerClose className="absolute top-[5%] right-[8%]" asChild>
            <button><IoCloseOutline className="hover:text-destructive" size={30}/></button>
          </DrawerClose>
        </form>
          {/* <ProfileForm className='px-4' /> */}
          {/* <DrawerFooter className="pt-2">
         */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input type='email' id='email' defaultValue='shadcn@example.com' />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='username'>Username</Label>
        <Input id='username' defaultValue='@shadcn' />
      </div>
      <Button type='submit'>Save changes</Button>
    </form>
  );
}

export default CartRequestLogin;

// import * as React from "react"
// import { Minus, Plus } from "lucide-react"
// // import { Bar, BarChart, ResponsiveContainer } from "recharts"

// import { Button } from "@/components/ui/button"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"

// const data = [
//   {
//     goal: 400,
//   },
//   {
//     goal: 300,
//   },
//   {
//     goal: 200,
//   },
//   {
//     goal: 300,
//   },
//   {
//     goal: 200,
//   },
//   {
//     goal: 278,
//   },
//   {
//     goal: 189,
//   },
//   {
//     goal: 239,
//   },
//   {
//     goal: 300,
//   },
//   {
//     goal: 200,
//   },
//   {
//     goal: 278,
//   },
//   {
//     goal: 189,
//   },
//   {
//     goal: 349,
//   },
// ]

//  function CartLoginRequest() {
//   const [goal, setGoal] = React.useState(350)

//   function onClick(adjustment: number) {
//     setGoal(Math.max(200, Math.min(400, goal + adjustment)))
//   }

//   return (
//     <Drawer>
//       <DrawerTrigger asChild>
//         <Button variant="outline">Open Drawer</Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <div className="mx-auto w-full max-w-sm">
//           <DrawerHeader>
//             <DrawerTitle>Move Goal</DrawerTitle>
//             <DrawerDescription>Set your daily activity goal.</DrawerDescription>
//           </DrawerHeader>
//           <div className="p-4 pb-0">
//             <div className="flex items-center justify-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(-10)}
//                 disabled={goal <= 200}
//               >
//                 <Minus className="h-4 w-4" />
//                 <span className="sr-only">Decrease</span>
//               </Button>
//               <div className="flex-1 text-center">
//                 <div className="text-7xl font-bold tracking-tighter">
//                   {goal}
//                 </div>
//                 <div className="text-[0.70rem] uppercase text-muted-foreground">
//                   Calories/day
//                 </div>
//               </div>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-8 w-8 shrink-0 rounded-full"
//                 onClick={() => onClick(10)}
//                 disabled={goal >= 400}
//               >
//                 <Plus className="h-4 w-4" />
//                 <span className="sr-only">Increase</span>
//               </Button>
//             </div>
//             <div className="mt-3 h-[120px]">
//                 <p>hello</p>
//               {/* <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data}>
//                   <Bar
//                     dataKey="goal"
//                     style={
//                       {
//                         fill: "hsl(var(--foreground))",
//                         opacity: 0.9,
//                       } as React.CSSProperties
//                     }
//                   />
//                 </BarChart>
//               </ResponsiveContainer> */}
//             </div>
//           </div>
//           <DrawerFooter>
//             <Button>Submit</Button>
//             <DrawerClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DrawerClose>
//           </DrawerFooter>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }
// export default CartLoginRequest
