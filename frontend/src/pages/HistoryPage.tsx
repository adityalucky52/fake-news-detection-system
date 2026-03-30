import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Plus, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/api/client';
import type { RecentScan as Prediction } from '@/types/prediction';

export default function HistoryPage() {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const pp = 6;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/history');
      setItems(data.data.predictions || []);
    } catch {}
    finally { setLoading(false); }
  };

  const filtered = items
    .filter((p) => filter === 'ALL' || p.label === filter)
    .filter((p) => !search || p.text_preview.toLowerCase().includes(search.toLowerCase()));

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pp));
  const paginated = filtered.slice((page - 1) * pp, page * pp);

  const fmtDate = (d: string) => ({
    date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  });

  const exportCSV = () => {
    const csv = ['Date,Preview,Verdict,Confidence',
      ...items.map((p) => `"${fmtDate(p.createdAt).date}","${p.text_preview.replace(/"/g, '""')}","${p.label}","${Math.round(p.confidence * 100)}%"`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'history.csv';
    a.click();
  };

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
      <span className="text-muted-foreground text-xs">
        {(page - 1) * pp + 1}–{Math.min(page * pp, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        {Array.from({ length: Math.min(3, pages) }, (_, i) => i + 1).map((p) => (
          <Button key={p} variant={page === p ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>{p}</Button>
        ))}
        {pages > 3 && <span className="text-muted-foreground px-1">...</span>}
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between mb-4 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 mb-1">
            Prediction History
            <Badge variant="secondary" className="text-sm">{total}</Badge>
          </h1>
          <p className="text-muted-foreground text-sm">Review and manage your past content analysis results.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button size="icon" asChild><Link to="/app/analyze"><Plus className="h-4 w-4" /></Link></Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <Tabs value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
          <TabsList className="h-9">
            <TabsTrigger value="ALL" className="text-xs px-3">All</TabsTrigger>
            <TabsTrigger value="REAL" className="text-xs px-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] mr-1.5" />Real
            </TabsTrigger>
            <TabsTrigger value="FAKE" className="text-xs px-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-danger)] mr-1.5" />Fake
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 w-40 md:w-48 h-9" />
        </div>
      </div>

      <Card>
        {loading ? (
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />Loading...
          </CardContent>
        ) : paginated.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <FileText className="h-12 w-12" />
            <h3 className="text-lg font-semibold text-foreground">No predictions found</h3>
            <p className="text-sm">Start analyzing articles to build your history.</p>
            <Button asChild className="mt-2"><Link to="/app/analyze">Analyze Now</Link></Button>
          </CardContent>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">DATE</TableHead>
                    <TableHead>ARTICLE PREVIEW</TableHead>
                    <TableHead className="w-[130px]">VERDICT</TableHead>
                    <TableHead className="w-[180px]">CONFIDENCE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((p) => {
                    const { date, time } = fmtDate(p.createdAt);
                    const c = Math.round(p.confidence * 100);
                    const fake = p.label === 'FAKE';
                    return (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedPrediction(p)}>
                        <TableCell>
                          <div className="text-sm font-medium">{date}</div>
                          <div className="text-xs text-muted-foreground">{time}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><FileText className="h-4 w-4" /></div>
                            <div>
                              <div className="text-sm font-medium line-clamp-2 max-w-[500px] break-all">{p.text_preview}</div>
                              <div className="text-xs text-muted-foreground">{p.text_preview.startsWith('http') ? 'URL Scan' : 'Text Snippet'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={fake ? 'destructive' : 'default'} className={`gap-1 ${fake ? '' : 'bg-[var(--color-success)] hover:bg-[var(--color-success)]'}`}>
                            {fake ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />} {p.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress value={c} className={`w-20 h-1.5 ${fake ? '[&>div]:bg-[var(--color-danger)]' : '[&>div]:bg-[var(--color-success)]'}`} />
                            <span className="text-sm font-semibold w-10">{c}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {paginated.map((p) => {
                const { date, time } = fmtDate(p.createdAt);
                const c = Math.round(p.confidence * 100);
                const fake = p.label === 'FAKE';
                return (
                  <div key={p.id} className="p-4 space-y-3 cursor-pointer hover:bg-accent/50 active:bg-accent transition-colors" onClick={() => setSelectedPrediction(p)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs text-muted-foreground">{date} · {time}</div>
                      <Badge variant={fake ? 'destructive' : 'default'} className={`gap-1 shrink-0 ${fake ? '' : 'bg-[var(--color-success)] hover:bg-[var(--color-success)]'}`}>
                        {fake ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />} {p.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">{p.text_preview}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={c} className={`flex-1 h-1.5 ${fake ? '[&>div]:bg-[var(--color-danger)]' : '[&>div]:bg-[var(--color-success)]'}`} />
                      <span className="text-xs font-semibold">{c}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination />
          </>
        )}
      </Card>

      <Dialog open={!!selectedPrediction} onOpenChange={(open) => !open && setSelectedPrediction(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prediction Details</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <div className="space-y-6 mt-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Date</span>
                  <span className="text-sm">{fmtDate(selectedPrediction.createdAt).date} at {fmtDate(selectedPrediction.createdAt).time}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Verdict</span>
                  <Badge variant={selectedPrediction.label === 'FAKE' ? 'destructive' : 'default'} className={`mt-1 ${selectedPrediction.label !== 'FAKE' ? 'bg-[var(--color-success)] hover:bg-[var(--color-success)]' : ''}`}>
                    {selectedPrediction.label}
                  </Badge>
                </div>
                <div className="flex flex-col flex-1 min-w-[120px]">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Confidence</span>
                  <div className="flex items-center gap-3 mt-1">
                    <Progress value={Math.round(selectedPrediction.confidence * 100)} className={`flex-1 h-2 ${selectedPrediction.label === 'FAKE' ? '[&>div]:bg-[var(--color-danger)]' : '[&>div]:bg-[var(--color-success)]'}`} />
                    <span className="text-sm font-bold">{Math.round(selectedPrediction.confidence * 100)}%</span>
                  </div>
                </div>
              </div>

              {(selectedPrediction as any).explanation && (
                <div className="space-y-2">
                  <h3 className="text-sm text-foreground font-semibold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Analysis Reasoning</h3>
                  <div className="p-4 rounded-lg bg-accent/30 text-sm whitespace-pre-wrap text-foreground/90 border">
                    {(selectedPrediction as any).explanation}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm text-foreground font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Full Content</h3>
                <div className="p-4 rounded-lg bg-muted text-sm whitespace-pre-wrap break-all text-muted-foreground border">
                  {(selectedPrediction as any).text || selectedPrediction.text_preview}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
