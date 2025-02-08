"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/components/custom/Header'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSideBar from '@/components/custom/AppSideBar'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

function Provider({ children }) {
    console.log("inside provider");
    const [messages, setMessages] = useState([])
    const [userDetail, setUserDetail] = useState({});
    const convex = useConvex();

    useEffect(() => {
        IsAuthenticated();
    })

    const IsAuthenticated = async () => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user'));

            //Fetch from Database
            const result = await convex.query(api.users.GetUser, {
                email: user?.email
            })

            setUserDetail(result);
            console.log("get user result in provider", result);
        }

    }

    return (
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
                <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                    <MessagesContext.Provider value={{ messages, setMessages }}>
                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <Header />
                            <SidebarProvider defaultOpen={false}>
                                <AppSideBar />
                                {children}
                            </SidebarProvider>
                        </NextThemesProvider>
                    </MessagesContext.Provider>
                </UserDetailContext.Provider>
                </PayPalScriptProvider>
            </GoogleOAuthProvider>
        </div>
    )
}

export default Provider