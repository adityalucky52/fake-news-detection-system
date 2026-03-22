import { FileText, Search, CheckCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const pipeline = [
  { icon: FileText, title: 'Ingest', desc: 'Input any text or URL. Our system prepares the content for deep agentic analysis.' },
  { icon: Search, title: 'Reason', desc: 'Langchain agents perform multi-step logic and semantic checks using Llama 3.3 70B.' },
  { icon: CheckCircle, title: 'Explain', desc: 'Receive a grounded verdict with a detailed step-by-step reasoning report.' },
];

const stats = [
  { value: '70B', label: 'Model Parameters' },
  { value: 'Agentic', label: 'Architecture' },
  { value: 'Real-time', label: 'Analysis Speed' },
];

const tech = ['React', 'TypeScript', 'FastAPI', 'Python', 'Langchain', 'Groq', 'Llama 3.3'];

const faqs = [
  { q: 'How does TruthLens detect fake news?', a: 'TruthLens uses state-of-the-art Large Language Models (Llama 3.3 70B via Groq) orchestrated by Langchain agents to perform deep semantic analysis and fact-checking.' },
  { q: 'Do you store the text I analyze?', a: 'Yes, analyzed texts are stored in your personal history. All data is encrypted and only accessible to your account.' },
  { q: 'Is this service free to use?', a: 'Yes! FakeDetect is completely free and open-source. Register and start analyzing immediately.' },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div>
      <section className="relative py-12 md:py-16 text-center">
        <div className="hero-glow" />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10 px-4">How <span className="gradient-text">FakeDetect</span> Works</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto relative z-10 px-6">Behind the curtain of AI detection — advanced NLP meets transparent logic.</p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">The Analysis Pipeline</h2>
          <p className="text-muted-foreground mb-10">From raw input to final verdict in milliseconds.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {pipeline.map((s, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-7">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4"><s.icon className="h-6 w-6" /></div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14 px-6 bg-card">
        <div className="max-w-[800px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">
          {stats.map((s, i) => (<div key={i}><div className="text-3xl font-extrabold gradient-text mb-1">{s.value}</div><div className="text-sm text-muted-foreground">{s.label}</div></div>))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Built With Modern Tech</h2>
          <p className="text-muted-foreground mb-10">Best open-source tools for speed, accuracy, and reliability.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {tech.map((t, i) => (<Badge key={i} variant="outline" className="px-6 py-3 text-sm font-medium transition-all hover:-translate-y-1">{t}</Badge>))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((f, i) => (
              <Card key={i} className="overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 bg-transparent border-none text-left text-foreground font-medium cursor-pointer">
                  <span>{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in-up"><p>{f.a}</p></div>}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
