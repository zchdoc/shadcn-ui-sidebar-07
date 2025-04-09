// components/authentication/components/description-text.tsx
interface DescriptionTextProps {
  mode: 'login' | 'register'
}

export function DescriptionText({ mode }: DescriptionTextProps) {
  if (mode === 'login') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome Back 👋
        </h1>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Log in to your account to access your attendance records and manage
            your schedule.
          </p>
          {/*<ul className="list-disc list-inside space-y-2 text-muted-foreground">*/}
          {/*  <li>View your attendance history</li>*/}
          {/*  <li>Clock in and out seamlessly</li>*/}
          {/*  <li>Track your work hours</li>*/}
          {/*  <li>Access team schedules</li>*/}
          {/*</ul>*/}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Create an Account ✨
      </h1>
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Join our attendance system to streamline your work schedule
          management.
        </p>
        {/*<ul className="list-disc list-inside space-y-2 text-muted-foreground">*/}
        {/*  <li>Easy time tracking</li>*/}
        {/*  <li>Real-time attendance updates</li>*/}
        {/*  <li>Team collaboration features</li>*/}
        {/*  <li>Detailed reporting tools</li>*/}
        {/*</ul>*/}
      </div>
    </div>
  )
}
