"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserAuthForm } from "./components/user-auth-form";
import { UserLoginForm } from "./components/user-login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthenticationPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
        <ThemeToggle />
        <Button 
          variant="outline"
          onClick={() => setShowLogin(!showLogin)}
          className="relative px-4 py-2"
        >
          {showLogin ? "Register" : "Login"}
        </Button>
      </div>
      
      {/* Left side - Login Form */}
      <div className={cn(
        "relative flex min-h-screen flex-col p-10 lg:min-h-screen",
        showLogin ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
      )}>
        <div className="absolute inset-0 hidden bg-zinc-900 lg:block dark:bg-zinc-100 dark:bg-opacity-[0.03] bg-opacity-[0.03]" />
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
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Attendance System
        </div>
        <div className="relative z-20 mt-auto">
          <UserLoginForm className={cn(showLogin ? "block" : "hidden")} />
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className={cn(
        "",
        showLogin ? "bg-muted text-muted-foreground" : "bg-background text-foreground"
      )}>
        <div className="absolute inset-0 hidden bg-zinc-50 lg:block dark:bg-zinc-900 dark:bg-opacity-[0.03] bg-opacity-[0.03]" />
        <div className="relative z-20 mt-auto">
          <UserAuthForm className={cn(showLogin ? "hidden" : "block")} />
        </div>
      </div>
    </div>
  );
}