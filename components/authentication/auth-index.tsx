import {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {UserAuthForm} from "./components/user-auth-form";
import {UserLoginForm} from "./components/user-login-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <button
        onClick={() => setShowLogin(!showLogin)}
        className={cn(
          buttonVariants({variant: "ghost"}),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {showLogin ? "Register" : "Login"}
      </button>
      {/* Left side - Login Form */}
      <div className={cn(
        "relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex",
        showLogin ? "bg-background text-foreground" : "bg-muted text-muted-foreground"
      )}>
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
        <div className="relative z-20 mt-auto">
          <UserLoginForm className={cn(showLogin ? "block" : "hidden")}/>
        </div>
      </div>
      {/* Right side - Register Form */}
      <div className={cn(
        !showLogin ? "block lg:p-8" : "hidden lg:block",
        showLogin ? "bg-muted text-muted-foreground" : "bg-background text-foreground"
      )}>
        {/*<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">*/}
        <div className="relative z-20 mt-auto">
          <UserAuthForm className={cn(showLogin ? "hidden" : "block")}/>
        </div>
      </div>
    </div>
  );
}