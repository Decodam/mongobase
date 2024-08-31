# Mongobase

Mongobase is a starter template using Next js, Next Auth V5, prisma orm, mongo db and shadcn ui components. With pre built ui and reusable components it will make your workflow 10 times faster!

Check out this live demo, deployed with `Vercel` — [https://mongobase-demo.vercel.app/](https://mongobase-demo.vercel.app/)

---

## Project Setup

1. Initiate the project. You can either clone this repository and run `npm install` to start the project. Else you can run the following command on your terminal
    
    ```bash
    npx create-next-app -e https://github.com/Decodam/mongobase
    ```
    
2. Add enviornment variables at the `.env.local` and `.env` file.
    
    ```bash
    # Copy the same mongo_uri variable at the .env file for prisma
    MONGO_URI=<mongo_db_uri>
    AUTH_SECRET=<random_key>
    
    # Generate github oauth client from: https://github.com/settings/developers
    GITHUB_CLIENT_ID=<github_client_id>
    GITHUB_CLIENT_SECRET=<github_client_secret>
    
    # google
    GOOGLE_CLIENT_ID=<google_client_id>
    GOOGLE_CLIENT_SECRET=<google_client_secret>
    
    # you can add more providers
    
    # ------- Add this to .env for prisma
    DATABASE_URL=<mongodb_connection_url>
    ```
    
3. Add the necessary O Auth providers at `@/auth.js` file.
    
    ```
    import NextAuth from "next-auth"
    import GitHub from "next-auth/providers/github"
    
    export const { handlers, signIn, signOut, auth } = NextAuth({
      providers: [
        GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        ...
      ],
      ...
    })
    ```
    
4. Add the O Auth providers with necessary icons to the `@/components/auth/oauth.js`x file.
    
    ```
    import { IconBrandGithub } from "@tabler/icons-react";
    
    // you can also use svg components for displaying provider logos
    
    export const AuthProviders = [
      {
        provider: "github",
        icon: IconBrandGithub,
      },
    ];
    ```
    
5. Run `npm run dev` to start the development server

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
          {(user) => (<SomeComponent user={user} />)}
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

### User Profile

```jsx
import { SignedIn, SignedOut } from "@/components/auth/session";
import UserProfile from "@/components/auth/account";

export default function Profile(){
	return(
    <SignedIn>
	    {(user) => (<UserProfile user={user} />)}
	  </SignedIn>
  )
}
```

---

## Route Protection

The starter template uses next js middleware for route protection. We have admin routes, public routes, auth routes and protected routes. To change or add more routes you can edit them at `@/middleware.js` file.

```jsx
// Routes
const protectedRoutes = ["/profile"];
const publicRoutes = ["/"];
const authRoutes = ["/login", "/signup"];
const adminRoutes = ["/admin"];
```

By default, users have the role of users. if role is “admin” then only they can access admin route.

### API Route Protection

You can create custom API routes and protect them by passing the `req` parameter and checking if `req.auth` exists. For example, here is a demo route for `/api/demo` endpoint.

```jsx
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"

export const GET = auth(async function GET(req) {
	// unauthenticated users dont get access
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Query data along with associated details from Prisma
    const queryData = await fetchSomething();

    if (!queryData) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    return NextResponse.json({ data: queryData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
```

---

# Built in API Routes

The project comes with built in routes for user-details which is totally customisable.

## API Route Documentation: `/api/user-details`

### **GET Method —**

**Description**:
Fetches user data along with associated accounts for the authenticated user. The response includes the user's basic details and filters out sensitive information from accounts, only returning the `provider` and `type` fields.

**Authentication**:
Required (via `auth` middleware).

**Response**:

- **200 OK**: User data retrieved successfully.
- **401 Unauthorized**: User is not authenticated.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Error fetching user data.

**Example Response**:

```json
{
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "accounts": [
      {
        "provider": "google",
        "type": "oidc"
      }
    ]
  }
}

```

### **POST Method —**

**Description**:
Updates the authenticated user's name and/or profile image. At least one of the fields (`name` or `image`) must be provided.

**Authentication**:
Required (via `auth` middleware).

**Request Body**:

- `name`: New name for the user (optional).
- `image`: New profile image URL for the user (optional).

**Response**:

- **200 OK**: User data updated successfully.
- **401 Unauthorized**: User is not authenticated.
- **400 Bad Request**: Neither `name` nor `image` is provided.
- **500 Internal Server Error**: Error updating user data.

**Example Response**:

```json
{
  "message": "Your account has been updated successfully",
  "data": {
    "id": "user_id",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "image": "<https://example.com/image.jpg>"
  }
}

```

---

## Contributing

We welcome contributions to enhance the functionality and usability of this project. If you’d like to contribute, here’s how you can get involved:

1. **Fork the Repository**: Create your own fork of the repository to work on your changes.
2. **Create a Branch**: Develop your feature or fix on a new branch.
3. **Make Changes**: Implement your changes and ensure they are well-tested.
4. **Submit a Pull Request**: Once your changes are ready, submit a pull request describing your modifications and the problem they solve.

## Upcoming changes and updates

1. I am currently trying to get sessions authentication working with `auth.js` but it isn’t helping as of now because it doesn’t supports credential login.
2. I am trying to enable 2 factor authentication and password resent features as well. But again facing the same difficulties due to the limitation of this authentication library.

---

❤️ Thanks a lot for visiting. Built with love by [@Decodam](https://github.com/Decodam)

- **Linkedin —** [@arghya-mondal-work](https://www.linkedin.com/in/arghya-mondal-work/)
- **Instagram — [@**arghya__mondal](https://www.instagram.com/arghya__mondal/)