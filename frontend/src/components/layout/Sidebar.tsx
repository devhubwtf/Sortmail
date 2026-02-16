"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Inbox,
    CheckSquare,
    FileEdit,
    Clock,
    Calendar,
    Settings,
    Mail,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Inbox", href: "/inbox", icon: Inbox, badge: 47 },
    { label: "Tasks", href: "/tasks", icon: CheckSquare, badge: 8 },
    { label: "Drafts", href: "/drafts", icon: FileEdit },
    { label: "Follow-ups", href: "/followups", icon: Clock, badge: 12 },
    { label: "Calendar", href: "/calendar", icon: Calendar, badge: 2 },
];

const BOTTOM_ITEMS = [
    { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className="flex flex-col border-r border-border-light bg-white transition-all duration-normal"
            style={{ width: collapsed ? 60 : 232 }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-[56px] border-b border-border-light">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-white" />
                </div>
                {!collapsed && (
                    <span className="font-display text-xl text-ink tracking-tight">SortMail</span>
                )}
            </div>

            {/* Main Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={18} />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-paper-mid text-ink-light">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="py-3 px-3 border-t border-border-light space-y-1">
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
                        >
                            <Icon size={18} />
                            {!collapsed && <span className="flex-1">{item.label}</span>}
                        </Link>
                    );
                })}

                {/* Collapse Toggle */}
                {onToggle && (
                    <button
                        onClick={onToggle}
                        className="nav-item w-full justify-center"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                )}

                {/* Sync Status */}
                {!collapsed && (
                    <div className="flex items-center gap-2 px-3 py-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
                        <span className="text-xs text-muted font-mono">Synced just now</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
