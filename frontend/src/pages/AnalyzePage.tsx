import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Search, RotateCcw, Loader, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import api from '@/api/client';
import type { PredictionResult as Result, RecentScan as Scan } from '../types/prediction';

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [recents, setRecents] = useState<Scan[]>([]);
  const [error, setError] = useState('');

  const MIN_TEXT = 50;
  const isTextValid = text.length >= MIN_TEXT;
  const isUrlValid = url.trim().startsWith('http');
  const canAnalyze = activeTab === 'text' ? isTextValid : isUrlValid;

  const analyze = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!canAnalyze || analyzing) return;
    setAnalyzing(true); setError(''); setResult(null);
    try {
      const payload = activeTab === 'text' ? { text } : { url };
      const { data } = await api.post('/predict', payload);
      setResult(data.data);
      try {
        const { data: h } = await api.get('/history');
        setRecents((h.data.predictions || []).slice(0, 3));
      } catch { }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const clear = () => { setText(''); setUrl(''); setResult(null); setError(''); };
  const onKey = (e: React.KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canAnalyze) analyze(); };

  const timeAgo = (d: string) => {
    const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const conf = result ? Math.round(result.confidence * 100) : 0;
  const isFake = result?.label === 'FAKE' || result?.label === 'MISLEADING';

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Analyze Content</h1>
      <p className="text-muted-foreground text-sm mb-6 md:mb-8">Detect misinformation in news articles using our advanced AI agent.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="flex-1 space-y-6">
          <div className="flex p-1 bg-muted rounded-xl w-full sm:w-fit">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 sm:flex-initial px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 sm:flex-initial px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'url' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Article URL
            </button>
          </div>

          <form onSubmit={analyze}>
            <Card className="overflow-hidden border-2 focus-within:border-primary/50 transition-colors">
              <CardContent className="p-0">
                {activeTab === 'text' ? (
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Paste the full article text here (minimum 50 characters)..."
                    rows={8}
                    className="border-0 shadow-none resize-none focus-visible:ring-0 text-base p-4 md:p-6 bg-transparent min-h-[200px]"
                  />
                ) : (
                  <div className="p-6">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-dashed text-primary mb-4 font-medium text-sm">
                      <Clock className="h-4 w-4" /> Browsing and scraping may take a few seconds...
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.example.com/news-article"
                      className="w-full bg-transparent border-b-2 border-muted focus:border-primary outline-none py-3 text-lg transition-all"
                      autoFocus
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm">
                {activeTab === 'text' && (
                  <span className={`flex items-center gap-1.5 ${isTextValid ? 'text-[var(--color-success)]' : 'text-muted-foreground'}`}>
                    {isTextValid ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {text.length} / {MIN_TEXT} chars
                  </span>
                )}
                {activeTab === 'url' && (
                  <span className={`flex items-center gap-1.5 ${isUrlValid ? 'text-[var(--color-success)]' : 'text-muted-foreground'}`}>
                    {isUrlValid ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    Valid URL required
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-xs hidden sm:inline">Press Ctrl+Enter to analyze</span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button type="submit" disabled={!canAnalyze || analyzing} size="lg" className="h-12 px-8">
                {analyzing ? (
                  <><Loader className="h-5 w-5 animate-spin mr-2" /> Processing...</>
                ) : (
                  <><Search className="h-5 w-5 mr-2" /> Start AI Analysis</>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={clear} size="lg">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </form>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-bold">Analysis Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="w-full lg:w-[400px]">
          {result ? (
            <Card className={`sticky top-24 overflow-hidden shadow-xl border-2 animate-in zoom-in-95 duration-300 ${isFake ? 'border-[var(--color-danger-border)]' : 'border-[var(--color-success-border)]'}`}>
              <div className={`h-2 ${isFake ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'}`} />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant={isFake ? 'destructive' : 'default'} className={`px-4 py-1 text-[10px] md:text-xs font-bold ${!isFake ? 'bg-[var(--color-success)] hover:bg-[var(--color-success)]' : ''}`}>
                    {result.label}
                  </Badge>
                  <span className="text-muted-foreground text-[10px] md:text-xs uppercase font-bold tracking-widest italic">AI REPORT</span>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isFake ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                    {isFake ? <XCircle className="h-8 w-8" /> : <CheckCircle className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black leading-tight italic">VERDICT: {result.label}</h3>
                    <p className="text-sm text-muted-foreground">Confidence: {conf}%</p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex items-center justify-between text-sm font-bold mb-2">
                      <span>Trust Score</span>
                      <span className={isFake ? 'text-destructive' : 'text-success'}>{conf}%</span>
                    </div>
                    <Progress value={conf} className={`h-3 rounded-full ${isFake ? '[&>div]:bg-destructive' : '[&>div]:bg-success'}`} />
                  </div>

                  {result.explanation && (
                    <div className="bg-muted/50 p-4 rounded-xl border border-muted-foreground/10">
                      <h4 className="text-xs font-black uppercase text-muted-foreground mb-2 tracking-widest">Reasoning</h4>
                      <p className="text-sm leading-relaxed italic">"{result.explanation}"</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {(isFake ? ['Biased Tone', 'Clickbait Header'] : ['Factual Reporting', 'Reputable Source']).map((t) => (
                    <div key={t} className="px-3 py-2 rounded-lg bg-muted text-[10px] font-bold uppercase tracking-tighter text-center">
                      {t}
                    </div>
                  ))}
                </div>

                <Button className="w-full h-12 rounded-xl font-bold" variant="outline" onClick={() => setResult(null)}>
                  Analyze New Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p className="font-medium">Analysis results will appear here</p>
              <p className="text-xs max-w-[200px] mt-2 italic">Select a method and provide content to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent History Overlay */}
      {recents.length > 0 && !result && (
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter">Recent Checks</h2>
            <Link to="/app/history" className="text-xs md:text-sm font-bold hover:text-primary underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recents.map((s) => (
              <Card key={s.id} className="hover:shadow-lg transition-shadow border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.label === 'REAL' ? 'bg-success text-white' : 'bg-destructive text-white'}`}>
                      {s.label === 'REAL' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold tracking-tighter italic">
                      {Math.round(s.confidence * 100)}% CONF
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 italic">"{s.text_preview}..."</p>
                  <div className="flex items-center text-[10px] text-muted-foreground font-bold uppercase">
                    <Clock className="h-3 w-3 mr-1" /> {timeAgo(s.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
