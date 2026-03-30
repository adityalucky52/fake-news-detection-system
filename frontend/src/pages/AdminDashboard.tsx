import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, XCircle, FileText, Search, Users, Activity, Download, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import api from '@/api/client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  prediction_count: number;
}

interface UserPrediction {
  id: string;
  label: 'REAL' | 'FAKE' | 'MISLEADING';
  confidence: number;
  text_preview: string;
  text?: string;
  explanation?: string;
  createdAt: string;
}

const pp = 10;

function fmtDate(d: string) {
  return {
    date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

// ─── Users List View ─────────────────────────────────────────────────────────
function UsersView({ onSelect }: { onSelect: (u: AdminUser) => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.data.users || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pp));
  const paginated = filtered.slice((page - 1) * pp, page * pp);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 mb-1">
            Users <Badge variant="secondary">{filtered.length}</Badge>
          </h1>
          <p className="text-muted-foreground text-sm">Click on a user to view their search history.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 w-48 md:w-64" />
        </div>
      </div>

      <Card>
        {loading ? (
          <CardContent className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />Loading...
          </CardContent>
        ) : error ? (
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-destructive text-sm font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">You may need to re-login to the admin portal.</p>
          </CardContent>
        ) : paginated.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Users className="h-12 w-12" />
            <p className="text-sm">No users found.</p>
          </CardContent>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>USER</TableHead>
                    <TableHead className="w-[120px]">ROLE</TableHead>
                    <TableHead className="w-[120px]">JOINED</TableHead>
                    <TableHead className="w-[120px] text-right">SEARCHES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(u => {
                    const { date } = fmtDate(u.createdAt);
                    return (
                      <TableRow key={u.id} className="cursor-pointer hover:bg-accent/60 transition-colors" onClick={() => onSelect(u)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {u.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-sm">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={u.role === 'admin' ? 'default' : 'outline'} className="capitalize">{u.role}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{u.prediction_count}</span>
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
              {paginated.map(u => (
                <div key={u.id} className="p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/50 active:bg-accent transition-colors" onClick={() => onSelect(u)}>
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{u.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{u.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={u.role === 'admin' ? 'default' : 'outline'} className="capitalize text-[10px]">{u.role}</Badge>
                    <span className="text-xs text-muted-foreground">{u.prediction_count} searches</span>
                  </div>
                </div>
              ))}
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t text-sm">
                <span className="text-muted-foreground">Showing {(page - 1) * pp + 1}–{Math.min(page * pp, filtered.length)} of {filtered.length}</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}

// ─── User's History View ──────────────────────────────────────────────────────
function UserHistoryView({ user, onBack }: { user: AdminUser; onBack: () => void }) {
  const [predictions, setPredictions] = useState<UserPrediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<UserPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get(`/admin/users/${user.id}/predictions`)
      .then(({ data }) => setPredictions(data.data.predictions || []))
      .finally(() => setLoading(false));
  }, [user.id]);

  const pages = Math.max(1, Math.ceil(predictions.length / pp));
  const paginated = predictions.slice((page - 1) * pp, page * pp);

  const exportCSV = () => {
    const csv = ['Date,Preview,Verdict,Confidence',
      ...predictions.map(p => `"${fmtDate(p.createdAt).date}","${p.text_preview.replace(/"/g, '""')}","${p.label}","${Math.round(p.confidence * 100)}%"`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${user.name}_history.csv`;
    a.click();
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full border"><ChevronLeft className="h-5 w-5" /></Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-extrabold flex items-center gap-2">{user.name} <Badge variant="secondary">{predictions.length} searches</Badge></h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
      </div>

      <Card>
        {loading ? (
          <CardContent className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />Loading...
          </CardContent>
        ) : paginated.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <FileText className="h-12 w-12" />
            <p className="text-sm">This user has no search history yet.</p>
          </CardContent>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">DATE</TableHead>
                    <TableHead>ARTICLE PREVIEW</TableHead>
                    <TableHead className="w-[120px]">VERDICT</TableHead>
                    <TableHead className="w-[160px]">CONFIDENCE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(p => {
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
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-muted flex items-center justify-center"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                            <div className="min-w-0">
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
                            <span className="text-sm font-semibold">{c}%</span>
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

            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t text-sm">
                <span className="text-muted-foreground">Showing {(page - 1) * pp + 1}–{Math.min(page * pp, predictions.length)} of {predictions.length}</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog open={!!selectedPrediction} onOpenChange={(open) => !open && setSelectedPrediction(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto w-[90vw]">
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

              {selectedPrediction.explanation && (
                <div className="space-y-2">
                  <h3 className="text-sm text-foreground font-semibold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Analysis Reasoning</h3>
                  <div className="p-4 rounded-lg bg-accent/30 text-sm whitespace-pre-wrap text-foreground/90 border">
                    {selectedPrediction.explanation}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm text-foreground font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Full Content</h3>
                <div className="p-4 rounded-lg bg-muted text-sm whitespace-pre-wrap break-all text-muted-foreground border">
                  {selectedPrediction.text || selectedPrediction.text_preview}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Root Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  return (
    <div>
      {selectedUser
        ? <UserHistoryView user={selectedUser} onBack={() => setSelectedUser(null)} />
        : <UsersView onSelect={setSelectedUser} />
      }
    </div>
  );
}
