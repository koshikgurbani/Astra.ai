import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext';

function Header() {
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    return (
        <div className='p-4 flex justify-between items-center'>
            <Image src={'/astra-logo.png'} alt='Logo' width={90} height={120} />
            {!userDetail?.name && <div className='flex gap-5'>
                <Button variant="ghost">Sign In</Button>
                <Button className="text-white" style={{
                    backgroundColor: Colors.BLUE,
                }}>Get Started</Button>
            </div>}
        </div>
    )
}

export default Header