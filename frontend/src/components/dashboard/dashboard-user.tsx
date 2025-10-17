
'use client'

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardUserProps {
    showGreeting?: boolean;
}

export function DashboardUser({ showGreeting = false }: DashboardUserProps) {
    const { user, logOut } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await logOut();
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
            router.push('/dashboard');
        } catch (error) {
            toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
        }
    }
    
    if (!user) return null;

    const getDisplayName = () => {
        if (user.displayName) return user.displayName;
        if (user.email) return user.email.split('@')[0];
        return "User";
    }

    if (showGreeting) {
        return <>Welcome, {getDisplayName()}!</>
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full h-auto p-2 justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-10 w-10 mr-2 group-data-[collapsible=icon]:mr-0">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-left group-data-[collapsible=icon]:hidden">
                        <div className="font-medium truncate">{getDisplayName()}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                           {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="w-full flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
