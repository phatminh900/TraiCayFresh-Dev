'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const CheckoutDiscount = () => {
    const [discount,setDiscount]=useState('')
  return (
    <form  className="flex items-center mb-6">
        <Input value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="Mã giảm giá" className="w-full"/>
        <Button variant='secondary'>Áp dụng</Button>

    </form>
  )
}

export default CheckoutDiscount