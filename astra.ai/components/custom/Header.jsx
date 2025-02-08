import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext';
import Link from 'next/link';
import { LucideDownload } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import { ActionContext } from '@/context/ActionContext';

function Header() {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const {toggleSidebar} = useSidebar();
    const {action, setAction} = useContext(ActionContext)
    const path = usePathname();


    const onActionBtn = (action) => {
        setAction({
            actionType:action,
            timeStamp:Date.now()
        })
    }

    return (
        <div className='p-4 flex justify-between items-center border-b'>
            <Link href={'/'}>
            <Image src={'/astra-logo.png'} alt='Logo' width={100} height={40} />
            </Link>
            {!userDetail?.name && <div className='flex gap-5'>
                <Button variant="ghost">Sign In</Button>
                <Button className="text-white" style={{
                    backgroundColor: Colors.BLUE,
                }}>Get Started</Button>
            </div>}
            {path?.includes('workspace') && <div className='flex gap-3 items-center'>
                <Button variant="ghost" onClick={() => onActionBtn('export')}><LucideDownload />Export</Button>
                <Button onClick={() => onActionBtn('deploy')} className="bg-blue-500 text-white hover:bg-blue-600" >Deploy</Button>
                {(userDetail && Object?.entries(userDetail).length > 0) && <Image src = {userDetail?.picture} alt='user' width={40} height={40} className='rounded-full w-[30px] cursor-pointer' 
                onClick={toggleSidebar}
                />}
            </div>
                }
        </div>
    )
}

export default Header