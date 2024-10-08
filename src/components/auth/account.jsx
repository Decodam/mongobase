"use client"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { loginWithOAuth, logout } from "@/actions/auth.actions";
import { IconLock, IconLogout, IconSettings, IconUser, IconX,  } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OAuthProviders } from "@/components/auth/oauth";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function getInitials(fullName) {
  if (typeof fullName !== 'string' || !fullName.trim()) {
    throw new Error("Invalid input. Please provide a non-empty string.");
  }

  const names = fullName.trim().split(/\s+/);

  // Check if there are at least two words
  if (names.length < 2) {
    throw new Error("Full name must contain at least a first and last name.");
  }

  const firstName = names[0];
  const lastName = names[names.length - 1];

  // Extract initials from the first and last name
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  return initials;
}


export default function UserProfile({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: user.name,
    profilePic: user.image,
  });

  const { toast } = useToast()
  const onClose = () => setIsModalOpen(false)
  const toggleProfileEditMode = () => {setProfileEditMode(!profileEditMode)};


  async function fetchUserData() {
    setLoading(true);
    try {
      const response = await fetch('/api/user-details');
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data); // Access the user data
        setEditFormData({
          fullName: data?.data?.name || "",
          profilePic: data?.data?.image || "",
        })
      } else {
        console.error('Error fetching user data:', response.status);
        toast({
          title: 'Error',
          description: 'Failed to fetch user data.',
          variant: 'destructive', // Adjust variant based on your toast library
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching user data.',
        variant: 'destructive', // Adjust variant based on your toast library
      });
    } finally {
      setLoading(false);
    }
  }

  async function removeAccount(provider) {
    setLoading(true);
    try {
      const response = await fetch('/api/user-details/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }), // Send provider in the request body
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete account');
      }
  
      const data = await response.json();
      console.log('Account deleted successfully:', data.message);
      toast({
        title: 'Successfully disconnected!',
        description: `Account removed from ${provider}.`,
      });
      fetchUserData();
  
    } catch (error) {
      console.error('Error deleting account:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account.',
        variant: 'destructive', // Adjust variant based on your toast library
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateUserDetails(name, image) {
    setLoading(true)
    try {
      const response = await fetch('/api/user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update user details');
      }
  
      const data = await response.json();
      toast({
        title: 'Account succesfully updated!',
        description: data.message,
      });
      fetchUserData();
      
      // Optionally, you can update the UI or show a success message here
    } catch (error) {
      toast({
        title: 'Error updating user details',
        description: error.message,
        variant: 'destructive',
      });
      // Handle error, e.g., show a notification
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar>
            <AvatarImage src={(!userData ? user.image : userData?.image) || "/default-user.jpg"} />
            <AvatarFallback>{(!userData ? getInitials(user.name) : getInitials(userData?.name)) || 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4 min-w-48 mt-2">
          <DropdownMenuLabel>{(!userData ? user.name : userData?.name)}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div>
            <DropdownMenuItem onClick={() => setIsModalOpen(true)} className="cursor-pointer h-10 p-2 flex gap-2 items-center">
              <IconSettings size={18} /><span>Settings</span>
            </DropdownMenuItem>
            <form action={logout}>
              <button type="submit" className="p-2 w-full h-10 flex gap-2 items-center text-left bg-background hover:bg-destructive/10 font-medium rounded transition text-destructive text-sm">
                <IconLogout size={18} /><span>Logout</span>
              </button>
            </form>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>


      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
          isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-background sm:max-h-[80svh] h-full max-w-screen-md sm:rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg w-full sm:mx-4">
          <div className="sm:w-52 sm:bg-muted/40 max-sm:border-b sm:border-r border-border p-6">
            <div className="banner mb-4 flex justify-between items-center">
              <h1 className="font-semibold">Account Settings</h1>
              <button onClick={onClose} className="sm:hidden">
                <IconX size={20} />
              </button>
            </div>
            <div className="btn-grp sm:space-y-2 max-sm:flex p-1 rounded-lg max-sm:bg-muted w-full">
              <Button onClick={() => {setTab(0)}} variant={tab === 0 ? "outline" : "ghost"} className="w-full space-x-2 sm:justify-start" size="sm">
                <span><IconUser size={16} /></span>
                <span>Account</span>
              </Button>
              <Button onClick={() => {setTab(1)}} variant={tab === 1 ? "outline" : "ghost"} className="w-full space-x-2 sm:justify-start" size="sm">
                <span><IconLock size={16} /></span>
                <span>Security</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-scroll p-6">
            {tab === 0 ? (
              <>
                <div className="profile-details flex items-center py-6">
                  <div className="flex-1 flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage src={(!userData ? user.image : userData?.image) || "/default-user.jpg"} />
                      <AvatarFallback>{(!userData ? getInitials(user.name) : getInitials(userData?.name)) || 'U'}</AvatarFallback>
                    </Avatar>

                    <div className="">
                      <h1 className="text-xl font-semibold">{(!userData ? (user.name) : (userData?.name))}</h1>
                      <p className="text-sm text-muted-foreground">{(!userData ? (user.email) : (userData?.email))}</p>
                    </div>
                  </div>
                  <div>
                    {!profileEditMode && <Button onClick={toggleProfileEditMode} disabled={loading} variant="outline" size="sm">Edit Profile</Button>}
                  </div>
                </div>

                <Separator />

                {profileEditMode ? (
                  <form onSubmit={() => {
                    if(userData?.name !== editFormData.fullName || userData?.image !== editFormData.profilePic) {
                      updateUserDetails(editFormData.fullName, editFormData.profilePic); return;
                    } else {
                      toast({
                        title: 'Account succesfully updated!',
                        description: "Your account has been updated successfully",
                      });
                      return;
                    }
                  }}>
                    {/* Edit Profile Form */}
                    <div className="edit-account space-y-2 py-6">
                      <div className="space-y-1">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                          id="full-name"
                          type="text"
                          placeholder="John Doe"
                          value={editFormData.fullName}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, fullName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="profile-pic">Profile Picture URL</Label>
                        <Input
                          id="profile-pic"
                          type="text"
                          placeholder="https://example.com/profile-pic.jpg"
                          value={editFormData.profilePic}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, profilePic: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end items-center py-6 gap-4">
                      <Button disabled={loading} type="button"  onClick={() => {
                        toggleProfileEditMode(); 
                        setEditFormData({
                          fullName: userData?.name || "",
                          profilePic: userData?.image || "",
                        })
                      }} variant="secondary">
                        Cancel
                      </Button>
                      <Button disabled={loading} type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Connected Users */}
                    {OAuthProviders && (
                      <div className="connected-accounts py-6">
                        <div className="flex mb-6">
                          <h2 className="text-lg font-semibold">Connected Accounts</h2>
                        </div>
                        <div className="space-y-4">
                          {/* Google Account */}
                          {OAuthProviders.map(({ provider, icon: Icon, key }) => (
                            <div key={key} className="flex items-center">
                              <div className="flex flex-1 item-center space-x-4">
                                <div><Icon /></div>
                                <div className="font-medium">Connect to {provider}</div>
                              </div>
          
                              <Button
                                disabled={loading}
                                variant="outline"
                                size="sm"
                                className={
                                  userData?.accounts?.some(account => account.provider === provider)
                                    ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                                    : ""
                                }
                                onClick={() => {
                                  if(userData?.accounts?.some(account => account.provider === provider)) {
                                    removeAccount(provider)
                                  } else {
                                    loginWithOAuth(provider)
                                  }
                                }}
                              >
                                {userData?.accounts?.some(account => account.provider === provider) ? "Remove" : "Connect"}
                              </Button>
                            </div>
                          ))}
          
          
                        </div>
          
                      </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-end items-center py-6 gap-4">
                      <Button onClick={onClose} variant="secondary">
                        Close
                      </Button>
                      <Button onClick={() => {logout()}} variant="destructive">
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="connected-accounts py-6">
                  <div className="space-y-4">
                    <div className="flex">
                      <h2 className="text-lg font-semibold">Security Panel</h2>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-1 item-center space-x-4">
                        <div className="font-medium">Change Email Address</div>
                      </div>

                      <Button
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        Reset
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex">
                      <h2 className="text-lg font-semibold">Password Configuration</h2>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-1 item-center space-x-4">
                        <div className="font-medium">Enable Password</div>
                      </div>

                      <Button
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-1 item-center space-x-4">
                        <div className="font-medium">Change Password</div>
                      </div>

                      <Button
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}



