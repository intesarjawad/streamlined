'use client';

import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const isAdmin = session.user.isAdmin === true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-white/5">
          <span className="text-sm font-medium text-white/90 hidden sm:block">
            {session?.user?.name}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        alignOffset={-8}
        className="w-[200px] bg-black/95 border-white/10 p-1"
      >
        {isAdmin && (
          <DropdownMenuItem 
            onClick={() => router.push('/admin/playlists')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-neon-blue hover:bg-neon-blue/10 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-neon-blue hover:bg-neon-blue/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 