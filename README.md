Mongobase is a starter template using Next js, Next Auth V5, prisma orm, mongo db and shadcn ui components. With pre built ui and reusable components it will make your workflow 10 times faster!

---

## Project Setup

1. Clone the repository from `@Decodam/mongobase`  using git clone command
    
    ```bash
    git clone https://github.com/Decodam/mongobase.git
    ```
    
2. Run `npm install` for installing the necessary packages.
3. Add enviornment variables at the `.env.local` and `.env` file.
    
    ```bash
    # Copy the same mongo_uri variable at the .env file for prisma
    MONGO_URI=<mongo_db_uri>
    AUTH_SECRET=<random_key>
    
    # Generate github oauth client from: https://github.com/settings/developers
    GITHUB_CLIENT_ID=<github_client_id>
    GITHUB_CLIENT_SECRET=<github_client_secret>
    ```
    
4. Add the necessary O Auth providers at `@/auth.js` file.
    
    ```js
    import NextAuth from "next-auth"
    import GitHub from "next-auth/providers/github"
    
    export const { handlers, signIn, signOut, auth } = NextAuth({
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
      ],
      pages: {
        signIn: "/login",
      },
    })
    ```
    
5. Add the O Auth providers with necessary icons to the `@/components/auth/providers.js` file.
    
    ```js
    import { IconBrandGithub } from "@tabler/icons-react";
    
    export const AuthProviders = [
      {
        provider: "github",
        icon: IconBrandGithub,
      },
    ];
    ```
    
6. Run `npm run dev` to start the development server

---


## Session Management

The starter template comes with some built in components for better work flow.

### SignedIn and SignedOut Components

sessions are managed by `SignedIn` , `SignedOut`

```jsx
import { SignedIn, SignedOut } from "@/components/auth/session";

export default function Navbar(){
	return(
		<nav className="container h-16 flex justify-between items-center">
      <Link href="/">
        <Image src={"/icon.svg"} width={40} height={40} alt="logo" />
      </Link>

      <div className="flex items-center gap-4">
	      {/* SignedIn also returns the authenticated user which can be used like this */}
        <SignedIn>
          {(user) => (<ProfileDropdown user={user} />)}
        </SignedIn>
        
        <SignedOut>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Signup</Link>
            </Button>
          </div>
        </SignedOut>
      </div>
    </nav>
 )
}
```

### Protected Routes

As of now Next Auth V5 is still in beta. Hence there are some issues with middleware. According to vercel’s best practices, middleware should be avoided for route protection. Firstly because its not possible to return the user to the other components, thus we will have to make at-least two request to get the sessions. Hence we use the `<Protected />` component to protect our routes 

```jsx
import { Protected } from "@/components/auth/session";

export default async function Profile({}) {
	// next url is passed in then we will redirect to this url after login
  return (
    <Protected nextUrl={"profile"}> 
      {(user) => (
        <>Profile -  {user.name}</>
      )}
    </Protected>
  );
}
```

### RedirectOnAuthenticated
The Authenticated component is used to redirect authenticated users away from specific pages, ensuring that only unauthenticated users can access the content. If a user is already authenticated, they will be redirected to a specified URL or the default home page (/). This component helps manage routes that should only be accessible by unauthenticated users.

```jsx
import { Authenticated } from "@/components/auth/Authenticated";

export default async function SomePage() {
  return (
    <Authenticated redirectUrl="/profile">
      <div>
        <h1>Welcome to the page for unauthenticated users!</h1>
        {/* Other content for unauthenticated users */}
      </div>
    </Authenticated>
  );
}
```

---



## Authentication Components

The starter template comes with some built in components for better work flow.

### O Auth Button

**Description:** The O Auth button can be used to login with any O Auth provider

```jsx
import { loginWithOAuth } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export default function OAuthSignInButton({ provider, icon: Icon, redirect, className }) {
  return (
    <form
      action={() => {loginWithOAuth(provider, redirect)}}
    >
      <Button className={["w-full", className]} variant="outline" type="submit">
        {Icon && <Icon className="mr-1" size={20} />}
        <span className="capitalize">Continue with {provider}</span>
      </Button>
    </form>
  );
}
```

**Usage:** The O Auth button can be used individually but is by default get rendered in to the login and signup form component.

```jsx
'use client' 
//use client is not necessary but is neede for getting the such params in this case

import OAuthSignInButton from "@/components/auth/oauth";
import { useSearchParams } from 'next/navigation';

export default function component(){
	const searchParams = useSearchParams()
	const next = searchParams.get('next')
	
	// provider = github / google / facebook / ...
	// icon = IconBrandGithub / ...
	// redirect = null ? `/` : `/url`
	<OAuthSignInButton provider={provider} icon={icon} redirect={next ? `/${next}` : null}/>
}
```

### Login & Signup Form

The login form and signup forms are pre-built forms provided by mongobase. They can have prop of `borderless` to remove the border and shadow. You can add your own styling as well using the classes provided by tailwind css.

```jsx
// Login Page
import LoginForm from "@/components/auth/login.form";
// import SignupForm from "@/components/auth/signup.form";

export default function LoginPage() {
  return(
    <div className="min-h-svh py-8 md:py-16 px-4 flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
```

---

## Contributing

We welcome contributions to enhance the functionality and usability of this project. If you’d like to contribute, here’s how you can get involved:

1. **Fork the Repository**: Create your own fork of the repository to work on your changes.
2. **Create a Branch**: Develop your feature or fix on a new branch.
3. **Make Changes**: Implement your changes and ensure they are well-tested.
4. **Submit a Pull Request**: Once your changes are ready, submit a pull request describing your modifications and the problem they solve.
