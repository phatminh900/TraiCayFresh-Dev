import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const MyProfileSkeleton = () => {
  return (
    <>
      <Skeleton className='w-40 h-4 mb-4' />
      <div className='flex gap-3 mb-6'>
        <Skeleton className='w-[50px] h-4' />
        <Skeleton className='w-[150px] h-4' />
        <Skeleton className='w-[50px] h-4' />
      </div>
      <div className='flex gap-3 mb-6'>
        <Skeleton className='w-[50px] h-4' />
        <Skeleton className='w-[150px] h-4' />
        <Skeleton className='w-[50px] h-4' />
      </div>
      <Skeleton className='w-[150px] h-4 mb-8' />
      <Skeleton className='w-[150px] h-4 mb-4' />
      <Skeleton className='w-[200px] h-4 mb-4' />

      <Skeleton className='w-full h-12 mb-4' />
      <Skeleton className='w-[150px] h-4 mb-12' />

      <Skeleton className='w-full h-12 mb-4' />
      <div className='flex justify-center'>
        <Skeleton className='w-10 h-6' />
      </div>
    </>
  );
};

export default MyProfileSkeleton;
