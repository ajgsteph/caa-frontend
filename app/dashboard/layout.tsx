import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/custom-ui/app-sidebar"
import { CustomSidebarTrigger } from "@/components/custom-ui/custom-sidebar-trigger"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          {/* Navbar */}
          <header className="border-b border-gray-200 bg-white w-full">
            <div className="mx-auto flex w-full items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <CustomSidebarTrigger />
                {/* <span className="font-bold text-amber-600">CAA</span> */}
                <span className="text-base text-gray-600 font-bold">
                  Bienvenue, {session.user?.artistName}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full rounded-none outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                    <div className="flex w-full items-center gap-2 p-2 rounded-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarFallback className="rounded-full bg-caa-primary text-caa-ink font-semibold">
                          {session.user?.firstName.substring(0, 1).toUpperCase() + session.user?.lastName.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-none"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{session.user?.firstName} {session.user?.lastName}</span>
                          <span className="truncate text-xs text-muted-foreground">{session.user?.email}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard/profile">
                      <DropdownMenuItem className="cursor-pointer rounded-none">
                        <User className="mr-2 size-4" />
                        Mon Profil
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <form action={logoutAction}>
                      <button type="submit" className="w-full">
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-none">
                          <LogOut className="mr-2 size-4" />
                          Se déconnecter
                        </DropdownMenuItem>
                      </button>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full bg-gray-100 px-6 py-4 grow h-full">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}