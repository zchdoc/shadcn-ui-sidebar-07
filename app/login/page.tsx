"use client"

import AuthenticationPage from "@/components/authentication/auth-index"
import { ThemeProvider } from "@/components/theme-provider"

export default function LoginPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthenticationPage />
    </ThemeProvider>
  )
}
