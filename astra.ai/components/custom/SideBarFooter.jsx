import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';
import { googleLogout } from '@react-oauth/google';

function SideBarFooter() {
    const router=useRouter();
    const {toggleSidebar}=useSidebar();
    const options = [
        {
            name:'Settings',
            icon:Settings
        },
        {
            name:'Help Center',
            icon:HelpCircle
        },
        {
            name:'My Subscription',
            icon:Wallet,
            path:'/pricing'
        },
        {
            name:'Sign Out',
            icon:LogOut
        }
    ]

    const onOptionClick=(option) =>{
        if(option.name==='Sign Out'){
            googleLogout();
            localStorage.clear();
            window.location.reload();
        }
        router.push(option.path);
    }

  return (
    <div className='p-2 mb-10'>
        {options.map((option,index) => (
            <Button variant="ghost" 
            onClick={() => {
                onOptionClick(option)
                toggleSidebar();
            }}
            className="w-full flex justify-start my-3" key={index}>
                <option.icon />
                {option.name}
            </Button>
        ))}
    </div>
  )
}

export default SideBarFooter