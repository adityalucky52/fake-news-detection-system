import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--color-amber)" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="var(--color-amber)" />
          </svg>
          <span>FakeDetect</span>
        </Link>
        <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} FakeDetect AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/about" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
