"use client"

import { MessagesContext } from '@/context/MessagesContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import Colors from '@/data/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import Image from 'next/image';
import { ArrowRight, Link } from 'lucide-react';
import Lookup from '@/data/Lookup';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const { messages, setMessages } = useContext(MessagesContext);
    const[userInput,setUserInput] =useState();
    console.log("messages in the beginning of chat view ", messages)
    useEffect(() => {
            console.log('Messages in chat view before fetching',messages)
            id && GetWorkspaceData();
        },[id])
        
        /* Used to Get Workspace data using Workspace ID */
        const GetWorkspaceData = async () => {
            const result = await convex.query(api.workspace.GetWorkspace, {
                workspaceId: id
            });
            
            console.log("getworkspace result in chat view",result);
            if (result?.messages) {
                console.log("result in chat view",result)
                setMessages(result.messages);
            } 
        }
        
    console.log('Messages in chat view after fetching',messages)
    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-hidden'>
                {messages?.map((msg,index) => (
                     <div key={index}
                     className='p-3 rounded-lg mb-2 flex gap-2 items-start'
                     style={{backgroundColor: Colors.BACKGROUND}}
                     >
                        {msg?.role=='user'&&
                        <Image src={userDetail?.picture} alt='userImage'
                        width={35} height={35} className='rounded-full'/>}
                        <h2>{msg.content}</h2>
                    </div>
                ))}
            </div>
            {/* INPUT SECTION */}
            <div className='p-5 border rounded-xl max-w-xl w-full mt-3'
                style={{
                    backgroundColor: Colors.BACKGROUND
                }}>
                <div className='flex gap-2'>
                    <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
                        onChange={(event) => setUserInput(event.target.value)}
                        className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' />
                    {userInput && <ArrowRight
                        onClick={() => onGenerate(userInput)}
                        className='bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer' />}
                </div>
                <div>
                    <Link className='h-5 w-5' />
                </div>
            </div>
        </div>
    );
}

export default ChatView