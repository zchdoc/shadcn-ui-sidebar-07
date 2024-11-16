"use client"

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserAuthForm } from "./components/user-auth-form";
import { UserLoginForm } from "./components/user-login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "./components/logo";

export default function AuthenticationPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [contentWidth, setContentWidth] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // 动画类型选择：可以更改这个值来切换不同的动画效果
  // 可选值: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip'
  const [animationType, setAnimationType] = useState<string>('fade');
  const loginCardRef = useRef<HTMLDivElement>(null);
  const registerCardRef = useRef<HTMLDivElement>(null);

  // 根据动画类型获取对应的动画类名
  const getAnimationClasses = () => {
    const baseClasses = "bg-background flex flex-col";
    const transitionClasses = {
      // 1. 淡入淡出效果
      fade: {
        base: "transition-opacity duration-1200",
        active: isTransitioning ? "opacity-0" : "opacity-100"
      },
      // 2. 滑动效果 (从右滑入，从左滑出)
      slide: {
        base: "transition-all duration-300",
        active: isTransitioning
          ? "transform translate-x-full opacity-0"
          : "transform translate-x-0 opacity-100"
      },
      // 3. 缩放效果
      scale: {
        base: "transition-all duration-300",
        active: isTransitioning
          ? "transform scale-75 opacity-0"
          : "transform scale-100 opacity-100"
      },
      // 4. 旋转效果
      rotate: {
        base: "transition-all duration-300",
        active: isTransitioning
          ? "transform rotate-180 opacity-0"
          : "transform rotate-0 opacity-100"
      },
      // 5. 翻转效果
      flip: {
        base: "transition-all duration-500 transform-gpu",
        active: isTransitioning
          ? "transform rotateY-180 opacity-0"
          : "transform rotateY-0 opacity-100"
      }
    };

    const selectedAnimation = transitionClasses[animationType as keyof typeof transitionClasses];
    return cn(baseClasses, selectedAnimation.base, selectedAnimation.active);
  };

  const handleFormSwitch = () => {
    setIsTransitioning(true);
    // 根据不同动画类型调整时间
    const timing = animationType === 'flip' ? 250 : 150;
    setTimeout(() => {
      setShowLogin(!showLogin);
      setTimeout(() => {
        setIsTransitioning(false);
      }, timing);
    }, timing);
  };

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
          <Logo />
          Attendance System
          <ThemeToggle />
          <Button
            variant="link"
            onClick={handleFormSwitch}
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
            className={getAnimationClasses()}
            style={{
              minHeight: contentHeight ? `${contentHeight}px` : 'auto',
              width: contentWidth ? `${contentWidth}px` : 'auto',
              minWidth: '400px',
              // 为3D效果添加视角
              perspective: animationType === 'flip' ? '1000px' : undefined,
              transformStyle: animationType === 'flip' ? 'preserve-3d' : undefined
            }}
          >
            <CardHeader className={cn(
              "transition-all duration-300",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}>
              {showLogin ? 'Login' : 'Reg'}
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
              {showLogin ? (<UserLoginForm />) : (<UserAuthForm />)}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
