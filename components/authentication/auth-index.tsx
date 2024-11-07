"use client"

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {UserAuthForm} from "./components/user-auth-form";
import {UserLoginForm} from "./components/user-login-form";
import {ThemeToggle} from "@/components/theme-toggle";
import {DescriptionText} from "./components/description-text";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function AuthenticationPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      {/* Top bar */}
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8 z-50">
        <ThemeToggle/>
        <Button
          variant="outline"
          onClick={() => setShowLogin(!showLogin)}
          className="relative px-4 py-2 w-24"
        >
          {showLogin ? "Register" : "Login"}
        </Button>
      </div>
      {/* Left side */}
      <div className={cn(
        "relative flex min-h-screen flex-col p-10 lg:min-h-screen",
        showLogin
          ? "bg-background text-foreground"
          : "bg-muted/50 text-muted-foreground"
      )}>
        {/* 斜边装饰 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/20 dark:to-indigo-900/20"/>
          <div className="absolute right-0 inset-y-0 w-[120%] bg-muted/50 transform translate-x-[10%] skew-x-12"
               style={{display: showLogin ? 'none' : 'block'}}
          />
          <div className="absolute right-0 inset-y-0 w-[120%] bg-background transform translate-x-[10%] skew-x-12"
               style={{display: showLogin ? 'block' : 'none'}}
          />
        </div>
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
        </div>
        <div className="relative z-20 flex flex-col flex-1 mt-20">
          {showLogin ? (
            <Card>
              <CardHeader>reg</CardHeader>
              <CardContent>
                <UserLoginForm className="flex-1"/>
              </CardContent>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <DescriptionText mode="register"/>
            </div>
          )}
        </div>
      </div>
      {/* Right side */}
      <div className={cn(
        "relative flex min-h-screen flex-col p-10 lg:min-h-screen",
        showLogin
          ? "bg-muted/50 text-muted-foreground"
          : "bg-background text-foreground"
      )}>
        {/* 斜边装饰 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/20 dark:to-indigo-900/20"/>
          <div className="absolute left-0 inset-y-0 w-[120%] bg-muted/50 transform -translate-x-[90%] -skew-x-12"
               style={{display: showLogin ? 'block' : 'none'}}
          />
          <div className="absolute left-0 inset-y-0 w-[120%] bg-background transform -translate-x-[90%] -skew-x-12"
               style={{display: showLogin ? 'none' : 'block'}}
          />
        </div>
        <div className="relative z-20 flex flex-col flex-1 mt-20">
          {showLogin ? (
            <div className="flex-1 flex items-center justify-center">
              <DescriptionText mode="login"/>
            </div>
          ) : (
            <Card>
              <CardHeader>reg</CardHeader>
              <CardContent>
                <UserAuthForm className="flex-1"/>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
    ;
}
