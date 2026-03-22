import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="hero-glow" />
      <div className="text-center relative z-10 animate-fade-in-up">
        <h1 className="flex items-center justify-center gap-2 text-8xl md:text-9xl font-extrabold mb-6">
          <span className="gradient-text">4</span>
          <span className="text-muted-foreground">0</span>
          <span className="text-cyan-400">4</span>
        </h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/"><Home className="h-4 w-4 mr-2" /> Go Home</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/app/analyze"><Search className="h-4 w-4 mr-2" /> Go to Analyze</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
