"use client"

import { MessagesContext } from '@/context/MessagesContext';
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import Colors from '@/data/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import Image from 'next/image';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Lookup from '@/data/Lookup';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import ReactMarkdown from 'react-markdown';
import { useSidebar } from '../ui/sidebar';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
}

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);

    const {toggleSidebar} = useSidebar();

    const UpdateTokens = useMutation(api.users.UpdateToken);

    console.log("messages in the beginning of chat view ", messages)
    useEffect(() => {
        console.log('Messages in chat view before fetching', messages)
        id && GetWorkspaceData();
    }, [id])

    /* Used to Get Workspace data using Workspace ID */
    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });

        console.log("getworkspace result in chat view", result);
        if (result?.messages) {
            console.log("result in chat view", result)
            setMessages(result.messages);
        }
    }


    console.log('Messages in chat view after fetching', messages)

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;

            if (role == 'user') {
                GetAiResponse();
            }
        }
    }, [messages])

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        })
        console.log("ai prompt in chat view", PROMPT);
        console.log("api response result in chat view", result.data.result);

        const aiResp = {
            role: 'ai',
            content: result.data.result
        }

        setMessages(prev => [...prev, aiResp])

        await UpdateMessages({
            workspaceId: id,
            messages: [...messages, aiResp]
        })

        //Update Tokens in Database
        const tokensUsed = Number(countToken(JSON.stringify(aiResp)));
        const tokensRemaining = Number(userDetail?.token) - tokensUsed;

        setUserDetail(prev => ({
            ...prev,
            token: tokensRemaining
        }))

        await UpdateTokens({
            userId:userDetail?._id,
            token:tokensRemaining
        })
        console.log("tokens consumed in getAiResponse", tokensUsed);

        setLoading(false);
    }


    const onGenerate = async (input) => {
        if(userDetail?.token<10){
            toast("You don't have enough tokens left.")
            return;
        }
        const message = {
            role: 'user',
            content: input
        }
        setMessages(prev => [...prev, message]);
        setUserInput('');
    }

    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide pl-5'>
                {messages?.map((msg, index) => (
                    <div key={index}
                        className='p-3 rounded-lg mb-2 flex gap-2 items-center leading-7'
                        style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
                    >
                        {msg?.role == 'user' &&
                            <Image src={userDetail?.picture} alt='userImage'
                                width={35} height={35} className='rounded-full' />}
                        {/* <h2>{msg.content}</h2> */}
                        <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>
                    </div>
                ))}
                {loading && <div className='p-3 rounded-lg mb-2 flex gap-2 items-center'
                    style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
                >
                    <Loader2Icon className='animate-spin' />
                    <h2>Generating response...</h2>
                </div>}
            </div>


            {/* INPUT SECTION */}
            <div className='flex gap-2 items-end'>
            {Object.entries(userDetail).length > 0 && <Image src={userDetail?.picture} 
            className='rounded-full cursor-pointer'
            onClick={toggleSidebar}
            alt='user' width={30} height={30}/>}
            <div className='p-5 border rounded-xl max-w-xl w-full mt-3'
                style={{
                    backgroundColor: Colors.BACKGROUND
                }}>
                <div className='flex gap-2'>
                    <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
                        value={userInput}
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
        </div>
    );
}

export default ChatView