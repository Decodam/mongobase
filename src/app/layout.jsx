import "@/styles/globals.css"
import { Inter as FontSans } from "next/font/google"

import { ThemeProvider } from "@/utils/themeProvider"
import { cn } from "@/lib/shadcn"
import { Toaster } from "@/components/ui/toaster"


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata= {
  title: "Mongobase",
  description: "Mongo db Next Auth Starter Template"
}


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
