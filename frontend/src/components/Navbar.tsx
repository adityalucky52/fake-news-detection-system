import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>TruthLens</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors relative pb-5 ${
                location.pathname === link.to
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated ? (
            <Button asChild>
              <Link to="/app/analyze">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="flex md:hidden flex-col px-6 py-4 border-t gap-2">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`py-2.5 font-medium ${location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'}`}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-2 pt-3 border-t">
            {!isAuthenticated && (
              <>
                <Button variant="ghost" asChild onClick={() => setMobileOpen(false)}><Link to="/login">Login</Link></Button>
                <Button asChild onClick={() => setMobileOpen(false)}><Link to="/register">Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
