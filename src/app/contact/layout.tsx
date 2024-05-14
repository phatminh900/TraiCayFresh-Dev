import BreadCrumbLinks from '@/components/molecules/breadcrumbLinks'
import { APP_URL } from '@/constants/navigation.constant'
import React, { ReactNode } from 'react'

const ContactLayoutPage = ({children}:{children:ReactNode}) => {
  return (
    <section>
      <BreadCrumbLinks links={[{label:"Liên hệ",href:APP_URL.contact}]}/>
        {children}
    </section>
  )
}

export default ContactLayoutPage