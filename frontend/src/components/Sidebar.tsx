import { NavLink } from 'react-router-dom';
import { Sparkles, History, Info, LayoutDashboard, LogOut, ShieldCheck, Sun, Moon, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useState } from 'react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { collapsed } = useSidebarStore();
  const isAdmin = user?.role === 'admin';
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);

  const toolLinks = [
    { to: '/app/analyze', icon: Sparkles, label: 'Analyze article', color: 'text-blue-500' },
    { to: '/app/history', icon: History, label: 'History', color: 'text-violet-500' },
    { to: '/app/about', icon: Info, label: 'About', color: 'text-emerald-500' },
  ];

  const adminLinks = [
    { to: '/app/admin', icon: LayoutDashboard, label: 'Dashboard', color: 'text-sky-500' },
  ];

  const linkClass = (isActive: boolean) =>
    `flex items-center rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
      collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5'
    } ${
      isActive
        ? 'bg-sidebar-accent text-primary font-semibold'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`;

  // Mobile link class — never collapsed
  const mobileLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
      isActive
        ? 'bg-sidebar-accent text-primary font-semibold'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`;

  const SidebarLink = ({ to, icon: Icon, label, color, end }: { to: string; icon: any; label: string; color?: string; end?: boolean }) => {
    const link = (
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) => linkClass(isActive)}
      >
        {({ isActive }) => (
          <>
            <Icon className={`h-6 w-6 shrink-0 ${isActive ? '' : color}`} />
            {!collapsed && <span>{label}</span>}
          </>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      );
    }
    return link;
  };

  // Shared nav content (used in both desktop sidebar & mobile drawer)
  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex-1 overflow-y-auto ${collapsed && !mobile ? 'px-0' : 'px-2'}`}>
      <div className={collapsed && !mobile ? 'flex flex-col items-center gap-2' : 'space-y-1 mb-4'}>
        {!collapsed && !mobile && <span className="block px-3 pt-2 pb-1 text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest">TOOLS</span>}
        {mobile && <span className="block px-3 pt-2 pb-1 text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest">TOOLS</span>}
        {toolLinks.map((link) =>
          mobile ? (
            <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => mobileLinkClass(isActive)}>
              {({ isActive }) => (<><link.icon className={`h-5 w-5 shrink-0 ${isActive ? '' : link.color}`} /><span>{link.label}</span></>)}
            </NavLink>
          ) : (
            <SidebarLink key={link.to} {...link} />
          )
        )}
      </div>

      {isAdmin && (
        <div className={collapsed && !mobile ? 'flex flex-col items-center gap-2 mt-4' : 'space-y-1 mb-4'}>
          {!collapsed && !mobile && <Separator className="mb-3" />}
          {collapsed && !mobile && <Separator className="w-8 mb-1" />}
          {mobile && <Separator className="mb-3" />}
          {(!collapsed || mobile) && <span className="block px-3 pt-2 pb-1 text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-widest">ADMIN</span>}
          {adminLinks.map((link) =>
            mobile ? (
              <NavLink key={link.to} to={link.to} end onClick={() => setMobileOpen(false)}
                className={({ isActive }) => mobileLinkClass(isActive)}>
                {({ isActive }) => (<><link.icon className={`h-5 w-5 shrink-0 ${isActive ? '' : link.color}`} /><span>{link.label}</span></>)}
              </NavLink>
            ) : (
              <SidebarLink key={link.to} {...link} end={link.to === '/app/admin'} />
            )
          )}
        </div>
      )}
    </nav>
  );

  return (
    <TooltipProvider delayDuration={0}>
      {/* ── Mobile top bar ─────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base">TruthLens</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* ── Mobile drawer overlay ───────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          {/* drawer */}
          <div className="relative w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base">TruthLens</span>
                  <span className="text-[0.7rem] text-muted-foreground">v2.1.0 Beta</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <NavContent mobile />

            {/* Theme + User footer */}
            <div className="pb-2 px-2">
              <button
                onClick={toggleTheme}
                className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
            <Separator />
            <div className="p-4 flex items-center gap-2.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-sm truncate">{user?.name || 'User'}</span>
                <span className="text-[0.7rem] text-primary capitalize">{user?.role || 'user'}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className={`hidden md:flex ${collapsed ? 'w-[72px]' : 'w-60'} min-h-screen bg-sidebar border-r border-sidebar-border flex-col transition-all duration-300 overflow-hidden fixed left-0 top-0 z-40`}>
        {/* Header */}
        <div className={`flex items-center px-4 pt-5 pb-4 ${collapsed ? 'flex-col gap-3' : 'justify-between'}`}>
          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2.5 flex-1 ml-2.5">
              <div className="flex flex-col">
                <span className="font-bold text-base">TruthLens</span>
                <span className="text-[0.7rem] text-muted-foreground">v2.1.0 Beta</span>
              </div>
            </div>
          )}
        </div>

        <NavContent />

        {/* Theme Toggle */}
        <div className={`pb-2 ${collapsed ? 'flex justify-center' : 'px-2'}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className={`flex items-center rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground ${
                  collapsed ? 'justify-center w-10 h-10' : 'w-full gap-3 px-3 py-2.5'
                }`}
              >
                {isDark
                  ? <Sun className="h-6 w-6 shrink-0 text-yellow-400" />
                  : <Moon className="h-6 w-6 shrink-0 text-indigo-400" />
                }
                {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{isDark ? 'Light Mode' : 'Dark Mode'}</TooltipContent>}
          </Tooltip>
        </div>

        {/* Footer */}
        <Separator />
        <div className={`p-4 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm truncate">{user?.name || 'User'}</span>
                  <span className="text-[0.7rem] text-primary capitalize">{user?.role || 'user'}</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive" onClick={logout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
