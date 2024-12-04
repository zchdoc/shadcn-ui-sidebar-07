"use client"

import Image from "next/image"
// import { redirect } from 'next/navigation';
import { useRouter } from "next/navigation" // 改用 useRouter
import { Button } from "@/components/ui/button"
import * as React from "react"
import { useAuth } from "@/components/auth-provider"
import { useCallback } from "react"
import { SecureStorage } from "@/lib/secure-storage"
import { validateToken } from "@/lib/auth"

export default function Home() {
  const { isAuthenticated, username } = useAuth()
  const router = useRouter() // 初始化 router
  const [loading, setLoading] = React.useState(false)

  // 获取当前环境
  const currentEnv = process.env.NEXT_PUBLIC_ENV
  console.log("Current environment:", currentEnv) // 将会显示 'development' 或 'production'

  const redirectToAbout = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
    router.replace("/about")
  }

  const redirectToDashboard = useCallback(() => {
    // 添加延时和状态检查
    const token = SecureStorage.getItem("auth_token")
    if (validateToken(token)) {
      setTimeout(() => {
        router.replace("/dashboard")
      }, 100)
    } else {
      router.replace("/login")
    }
  }, [router])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 flex flex-col gap-4 items-center">
        <h1 className="text-6xl font-bold">Welcome to Next.js!</h1>
        {isAuthenticated ? <p>Welcome, {username}!</p> : <p>Please log in</p>}
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row content-center">
          <Button
            className="bg-foreground text-background rounded-full border border-solid border-transparent transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={redirectToAbout}
          >
            Go to About
          </Button>
          <Button
            className="bg-foreground text-background rounded-full border border-solid border-transparent transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={redirectToDashboard}
            disabled={loading}
          >
            Go to Dashboard
          </Button>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              style={{ width: "auto", height: "auto" }}
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
