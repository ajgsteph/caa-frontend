"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Palette,
    FileBadge,
    ShieldCheck,
    CreditCard,
    BarChart3,
    ChevronRight,
    ChevronsUpDown,
    GalleryVerticalEnd,
    type LucideIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavSubItem {
    title: string;
    url: string;
}

interface NavMainItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: NavSubItem[];
}

interface SidebarData {
    // user: {
    //     name: string;
    //     email: string;
    //     avatar: string;
    // };
    navMain: NavMainItem[];
}

const data: SidebarData = {
    // user: {
    //     name: "Aïsha Diallo",
    //     email: "aisha@example.com",
    //     avatar: "/avatars/aisha.jpg",
    // },
    navMain: [
        { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
        {
            title: "Mes œuvres",
            url: "/dashboard/my-works",
            icon: Palette,
            // items: [
            //     { title: "Published", url: "/dashboard/my-works/published" },
            //     { title: "Drafts", url: "/dashboard/my-works/drafts" },
            // ],
        },
        {
            title: "Certificats",
            url: "/dashboard/certificates",
            icon: FileBadge,
            // items: [
            //     { title: "Tous les certificats", url: "/dashboard/certificates" },
            //     { title: "En attente", url: "/dashboard/certificates/pending" },
            //     { title: "Révoqués", url: "/dashboard/certificates/revoked" },
            // ],
        },
        { title: "Vérification d'identité", url: "/dashboard/identity-verification", icon: ShieldCheck },
        { title: "Paiements", url: "/dashboard/payments", icon: CreditCard },
        { title: "Statistiques", url: "/dashboard/statistics", icon: BarChart3 },
    ],
}

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <Link href="/dashboard" className="flex items-center gap-3 w-full h-full">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cert-terra text-white">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-sm">Certifa</span>
                                    <span className="text-xs text-muted-foreground">Artist Hub</span>
                                </div>
                                {/* <ChevronsUpDown className="ml-auto size-4" /> */}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => {
                            const isGroupActive = pathname === item.url || pathname.startsWith(`${item.url}/`)

                            return item.items && item.items.length > 0 ? (
                                <Collapsible key={item.title} defaultOpen={isGroupActive} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger className="w-full outline-none">
                                            <div className={`flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isGroupActive
                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                : "text-sidebar-foreground"
                                                }`}>
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => {
                                                    const isSubActive = pathname === subItem.url
                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <Link
                                                                href={subItem.url}
                                                                className={`flex items-center gap-2 w-full rounded-none p-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isSubActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground"
                                                                    }`}
                                                            >
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} className={"rounded-none " + (pathname === item.url ? "bg-cert-terra/90! text-white!" : "")}>
                                        <Link href={item.url} className="flex items-center gap-2 w-full h-full">
                                            {item.icon && <item.icon className="size-4" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                                <div className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={data.user.avatar} alt={data.user.name} />
                                        <AvatarFallback className="rounded-lg bg-cert-primary text-cert-ink font-semibold">
                                            {data.user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{data.user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{data.user.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </div>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={data.user.avatar} alt={data.user.name} />
                                        <AvatarFallback className="rounded-lg bg-cert-primary text-cert-ink font-semibold">
                                            {data.user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{data.user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{data.user.email}</span>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 size-4" />
                                    Mon Profil
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                    <LogOut className="mr-2 size-4" />
                                    Se déconnecter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter> */}
        </Sidebar>
    )
}