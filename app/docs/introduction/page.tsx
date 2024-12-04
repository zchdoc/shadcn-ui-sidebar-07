"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function IntroductionPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Introduction</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Get started with our documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This is the introduction page of our documentation. Here you will
              find all the information you need to get started with our
              platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Learn the basics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Follow our quick start guide to learn the basic concepts and
              features of our platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful links and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Find additional resources, tutorials, and tools to help you make
              the most of our platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
