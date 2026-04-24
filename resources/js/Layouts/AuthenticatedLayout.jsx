import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles, LayoutDashboard, FileText, Plus, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { href: route('dashboard'), label: 'Dashboard', icon: LayoutDashboard, active: route().current('dashboard') },
        { href: route('sales-pages.index'), label: 'Sales Pages', icon: FileText, active: route().current('sales-pages.*') },
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-3">

                        {/* Brand */}
                        <Link href={route('dashboard')} className="flex shrink-0 items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div className="leading-tight">
                                <div className="text-xs font-bold text-white sm:text-sm">AI Sales Page</div>
                                <div className="text-xs font-semibold text-violet-400">Generator</div>
                            </div>
                        </Link>

                        {/* Desktop Nav - center */}
                        <div className="hidden flex-1 items-center justify-center gap-1 sm:flex">
                            {navLinks.map(({ href, label, icon: Icon, active }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-all ${
                                        active
                                            ? 'bg-violet-600/20 text-violet-300'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Right: Buat Baru + User */}
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href={route('sales-pages.create')}
                                className="flex items-center gap-2 rounded-sm bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden md:inline">Buat Baru</span>
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden max-w-[100px] truncate lg:inline">{user.name}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 z-20 mt-1 w-52 rounded-sm border border-slate-700 bg-slate-900 py-1 shadow-xl shadow-black/40">
                                            <div className="border-b border-slate-800 px-4 py-3">
                                                <p className="text-sm font-medium text-white">{user.name}</p>
                                                <p className="truncate text-xs text-slate-500">{user.email}</p>
                                            </div>
                                            <Link
                                                href={route('profile.edit')}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                            >
                                                <User className="h-4 w-4" /> Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                            >
                                                <LogOut className="h-4 w-4" /> Log Out
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile: icon buttons */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <Link
                                href={route('sales-pages.create')}
                                className="flex items-center justify-center rounded-sm bg-violet-600 p-2 text-white transition hover:bg-violet-500"
                            >
                                <Plus className="h-4 w-4" />
                            </Link>
                            <button
                                className="rounded-sm p-2 text-slate-400 hover:bg-slate-800"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="border-t border-slate-800 bg-slate-950 sm:hidden">
                        <div className="space-y-1 px-4 py-3">
                            {navLinks.map(({ href, label, icon: Icon, active }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm font-medium transition ${
                                        active ? 'bg-violet-600/20 text-violet-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" /> {label}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-slate-800 px-4 py-3">
                            <div className="flex items-center gap-3 px-1">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="mt-2 space-y-1">
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                >
                                    <User className="h-4 w-4" /> Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                >
                                    <LogOut className="h-4 w-4" /> Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Header */}
            {header && (
                <div className="border-b border-slate-800 bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}
