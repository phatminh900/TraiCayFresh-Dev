"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CheckoutNote = () => {
  const [notes, setNotes] = useState("");
  return <div data-cy='note-box-checkout' className="mb-6 mt-6">
    <Textarea value={notes} onChange={(e)=>setNotes(e.target.value)}  placeholder='Thời gian nhận hàng mong muốn (...)' />
  </div>
};

export default CheckoutNote;
