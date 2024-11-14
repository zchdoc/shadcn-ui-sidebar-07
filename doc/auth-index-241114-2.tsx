// "use client"
//
// import React, {useState, useRef, useEffect} from "react";
// import {cn} from "@/lib/utils";
// import {UserAuthForm} from "./components/user-auth-form";
// import {UserLoginForm} from "./components/user-login-form";
// import {ThemeToggle} from "@/components/theme-toggle";
// import {DescriptionText} from "./components/description-text";
// import {Card, CardContent, CardHeader} from "@/components/ui/card";
// import {Button} from "@/components/ui/button";
//
// export default function AuthenticationPage() {
//   const [showLogin, setShowLogin] = useState(true);
//   const [contentHeight, setContentHeight] = useState<number>(0);
//   const loginCardRef = useRef<HTMLDivElement>(null);
//   const registerCardRef = useRef<HTMLDivElement>(null);
//
//   useEffect(() => {
//     const updateHeight = () => {
//       const loginHeight = loginCardRef.current?.offsetHeight || 0;
//       const registerHeight = registerCardRef.current?.offsetHeight || 0;
//       const maxHeight = Math.max(loginHeight, registerHeight);
//       setContentHeight(maxHeight);
//     };
//
//     updateHeight();
//     window.addEventListener('resize', updateHeight);
//     return () => window.removeEventListener('resize', updateHeight);
//   }, [showLogin]);
//
//   return (
//     <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
//       {/* Top bar */}
//       <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8 z-50">
//         <div className="relative z-20 flex items-center text-lg font-medium">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="mr-2 h-6 w-6"
//           >
//             <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
//           </svg>
//           Attendance System
//           <ThemeToggle/>
//           <Button
//             variant="outline"
//             onClick={() => setShowLogin(!showLogin)}
//             className="relative px-4 py-2 w-24"
//           >
//             Go to {showLogin ? "Register" : "Login"}
//           </Button>
//         </div>
//       </div>
//       {/* Left side */}
//       <div className={cn(
//         "relative flex min-h-screen flex-col p-10 lg:min-h-screen"
//       )}>
//         {/* Left 斜边装饰 */}
//         <div className="absolute inset-0">
//           <div className={cn(
//             "absolute inset-0 bg-gradient-to-br transition-colors duration-300",
//             showLogin
//               ? "from-blue-100/20 to-indigo-100/20 dark:from-blue-900/20 dark:to-indigo-900/20"
//               : "from-indigo-100/20 to-blue-100/20 dark:from-indigo-900/20 dark:to-blue-900/20"
//           )}/>
//           <div className="absolute left-0 inset-y-0 w-[120%] bg-muted/50 transform -translate-x-[10%] -skew-x-12"
//                style={{display: showLogin ? 'block' : 'none'}}
//           />
//           <div className="absolute left-0 inset-y-0 w-[120%] bg-background transform -translate-x-[10%] -skew-x-12"
//                style={{display: showLogin ? 'none' : 'block'}}
//           />
//         </div>
//         <div className="relative z-20 flex flex-col flex-1 mt-20">
//           {showLogin ? (
//             <Card
//               ref={loginCardRef}
//               className="bg-background flex flex-col"
//               style={{minHeight: contentHeight ? `${contentHeight}px` : 'auto'}}
//             >
//               <CardHeader>login</CardHeader>
//               <CardContent className="flex flex-col justify-center">
//                 <UserLoginForm/>
//               </CardContent>
//             </Card>
//           ) : (
//             <div
//               className="flex items-center justify-center py-8 bg-transparent"
//               style={{minHeight: contentHeight ? `${contentHeight}px` : 'auto'}}
//             >
//               <DescriptionText mode="register"/>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Right side */}
//       <div className={cn(
//         "relative flex min-h-screen flex-col p-10 lg:min-h-screen"
//       )}>
//         {/* Right 斜边装饰 */}
//         <div className="absolute inset-0">
//           <div className={cn(
//             "absolute inset-0 bg-gradient-to-br transition-colors duration-300",
//             showLogin
//               ? "from-indigo-100/20 to-blue-100/20 dark:from-indigo-900/20 dark:to-blue-900/20"
//               : "from-blue-100/20 to-indigo-100/20 dark:from-blue-900/20 dark:to-indigo-900/20"
//           )}/>
//           <div className="absolute left-0 inset-y-0 w-[120%] bg-muted/50 transform -translate-x-[90%] -skew-x-12"
//                style={{display: showLogin ? 'block' : 'none'}}
//           />
//           <div className="absolute left-0 inset-y-0 w-[120%] bg-background transform -translate-x-[90%] -skew-x-12"
//                style={{display: showLogin ? 'none' : 'block'}}
//           />
//         </div>
//         <div className="relative z-20 flex flex-col flex-1 mt-20">
//           {showLogin ? (
//             <div
//               className="flex items-center justify-center py-8 bg-transparent"
//               style={{minHeight: contentHeight ? `${contentHeight}px` : 'auto'}}
//             >
//               <DescriptionText mode="login"/>
//             </div>
//           ) : (
//             <Card
//               ref={registerCardRef}
//               className="bg-background flex flex-col"
//               style={{minHeight: contentHeight ? `${contentHeight}px` : 'auto'}}
//             >
//               <CardHeader>reg</CardHeader>
//               <CardContent className="flex flex-col justify-center">
//                 <UserAuthForm/>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
