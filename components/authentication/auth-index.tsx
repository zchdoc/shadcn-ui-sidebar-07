"use client"

import React, {useState, useRef, useEffect} from "react";
import {cn} from "@/lib/utils";
import {UserAuthForm} from "./components/user-auth-form";
import {UserLoginForm} from "./components/user-login-form";
import {ThemeToggle} from "@/components/theme-toggle";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export default function AuthenticationPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [contentWidth, setContentWidth] = useState<number>(0);
  const loginCardRef = useRef<HTMLDivElement>(null);
  const registerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const loginHeight = loginCardRef.current?.offsetHeight || 0;
      const registerHeight = registerCardRef.current?.offsetHeight || 0;
      const loginWidth = loginCardRef.current?.offsetWidth || 0;
      const registerWidth = registerCardRef.current?.offsetWidth || 0;
      
      const maxHeight = Math.max(loginHeight, registerHeight);
      const maxWidth = Math.max(loginWidth, registerWidth);
      
      setContentHeight(maxHeight);
      setContentWidth(maxWidth);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [showLogin]);

  return (
    <div>
      {/* Top bar */}
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8 z-50">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
          </svg>
          Attendance System
          <ThemeToggle/>
          <Button
            variant="link"
            onClick={() => setShowLogin(!showLogin)}
            className="relative px-4 py-2 w-24"
          >
            Go to {showLogin ? "Register" : "Login"}
          </Button>
        </div>
      </div>
      <div className={cn("relative flex min-h-screen flex-col p-8 lg:min-h-screen")}>
        <div className="relative z-20 flex flex-col flex-1 mt-20 items-center">
          <Card
            ref={showLogin ? loginCardRef : registerCardRef}
            className="bg-background flex flex-col"
            style={{
              minHeight: contentHeight ? `${contentHeight}px` : 'auto',
              width: contentWidth ? `${contentWidth}px` : 'auto',
              minWidth: '400px'
            }}
          > 
            <CardHeader>{showLogin ? 'Login' : 'Reg'}</CardHeader>
            <CardContent className="flex flex-col justify-center">
              {showLogin ? (<UserLoginForm/>) : (<UserAuthForm/>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
