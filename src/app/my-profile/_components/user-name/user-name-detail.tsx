import { cn } from "@/lib/utils"
import { IoCreateOutline } from "react-icons/io5"

interface UserNameDetailProps{
        userName?:string|null
        onToggleExpand:()=>void
}
const UserNameDetail = ({onToggleExpand,userName}:UserNameDetailProps) => {
  return (
    <div className='flex gap'>
    <p data-cy='user-name-my-profile' className='min-w-[50px]'>Tên:</p>
    <div className='flex'>
      <p
        data-cy='user-name-my-profile'
        className={cn(
          "font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block",
          {
            "min-w-[150px]": userName,
          }
        )}
      >
        {userName}
      </p>
    
      <button
        data-cy='adjust-user-name-my-profile'
        onClick={onToggleExpand}
        className='flex items-center gap-2'
      >
        <IoCreateOutline className='text-primary' />{" "}
        <span className='text-primary'>
          {!userName ? "Thêm tên của bạn" : "Sửa"}
        </span>{" "}
      </button>
    </div>
  </div>
  )
}

export default UserNameDetail