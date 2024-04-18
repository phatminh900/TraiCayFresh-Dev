import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { DeliveryAddressProps } from '.';
interface UserNameAddressProps extends Pick<DeliveryAddressProps,'onSetName'> {
  defaultValue?: string;
}
const UserNameAddress = ({defaultValue,onSetName}:UserNameAddressProps) => {
  const [name,setName]=useState(defaultValue||'')
  return (
    <div data-cy='user-name-address' className='flex-1'>
    <Input placeholder='Họ và tên' id='name'  value={name} onChange={(e)=>{
      const value=e.target.value
      setName(value)
      onSetName(value)
    }}/>
  </div>
  )
}

export default UserNameAddress