
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  LayoutDashboard,
  BrainCircuit,
  Video,
  BookCopy,
  FileUp,
  HelpCircle,
  Newspaper
} from 'lucide-react';
import Link from 'next/link';
import { StudyMaterialProvider } from '@/contexts/study-material-context';

function DashboardNav() {
  return (
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Logo className="size-7 text-primary" />
              <h1 className="font-headline text-2xl font-semibold tracking-tighter">
                Study Smarter
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/upload" asChild>
                  <Link href="/dashboard/upload">
                    <FileUp />
                    Upload Material
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/summary" asChild>
                  <Link href="/dashboard/summary">
                    <Newspaper />
                    Summary
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/flashcards" asChild>
                  <Link href="/dashboard/flashcards">
                    <BrainCircuit />
                    Flashcards
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/quiz" asChild>
                  <Link href="/dashboard/quiz">
                    <HelpCircle />
                    Quiz
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/videos" asChild>
                  <Link href="/dashboard/videos">
                    <Video />
                    Videos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/materials" asChild>
                  <Link href="/dashboard/materials">
                    <BookCopy />
                    My Materials
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
            
          </SidebarFooter>
        </Sidebar>
  )
}

function MainContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DashboardNav />
            <SidebarInset className="bg-secondary/30">
                <header className="flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-sm md:justify-end">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-4 ml-auto">
                    <p className="font-semibold text-lg font-headline hidden md:block">
                      Welcome!
                    </p>
                </div>
                </header>
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </SidebarInset>
        </>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <StudyMaterialProvider>
        <SidebarProvider>
          <MainContent>{children}</MainContent>
        </SidebarProvider>
      </StudyMaterialProvider>
  );
}
