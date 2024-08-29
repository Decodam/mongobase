"use client"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/components/auth/avatar-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconBrandGithub, IconBrandGoogle, IconLogout, IconPlus, IconTrash, IconUser } from "@tabler/icons-react";
import { loginWithOAuth, logout } from "@/actions/auth.actions";



export default function UserProfile({user}) {
  return (
    <div className="container max-w-screen-lg flex gap-6 py-10">
      <div className="grid gap-6 max-w-52 flex-1">
        <h1>Profile</h1>
      </div>
      <div className="flex-1 grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center pb-6">
              <div className="flex-1 flex items-center gap-3">
                <Avatar className="size-20">
                  <AvatarImage src={user.image || "/default-user.jpg"} />
                  <AvatarFallback>{user.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.name || "Hello There"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email || "user@example.com"}</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>

            <Separator className="px-6" />
            
            <div className="space-y-4 py-6">
              <h4 className="font-semibold">Connected accounts</h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <IconBrandGoogle />
                    <span className="text-sm">Google</span>
                  </div>
                  <span className="text-sm text-muted-foreground">example@gmail.com</span>
                </div>

                <div>
                  <Button onClick={() => {loginWithOAuth("google", "/profile")}} variant="outline" size="sm">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <IconBrandGithub />
                    <span className="text-sm">Github</span>
                  </div>
                  <span className="text-sm text-muted-foreground">example@gmail.com</span>
                </div>

                <div>
                  <Button variant="outline" className="text-destructive hover:text-destructive" size="sm">
                    <IconTrash className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>


            <Separator className="px-6" />
          </CardContent>

          <CardFooter className="justify-end space-x-4">
            <Button variant="secondary" >
              <IconUser className="mr-2 h-4 w-4" />
              Admin
            </Button>
            <Button onClick={() => {logout()}} variant="destructive" >
              <IconLogout className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}