import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, BarChart3, Search, FileText, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LandingFeature, LandingStep, LandingStat, FAQItem } from '@/types/landing';

const features: LandingFeature[] = [
  { icon: Shield, title: 'Agentic Fact-Checking', desc: 'Our system deploys intelligent Langchain agents that perform multi-step reasoning to verify article credibility.' },
  { icon: Zap, title: 'LPU-Powered Inference', desc: 'Leveraging Groq\'s LPU architecture for near-instant responses from the powerful Llama 3.3 (70B) model.' },
  { icon: BarChart3, title: 'Transparent Reasoning', desc: 'Don\'t just get a label. Our AI provides a detailed logical explanation for every verdict it reaches.' },
];

const steps: LandingStep[] = [
  { icon: FileText, title: 'Input', desc: 'Enter any article article text or a direct URL to start the deep-scan process.' },
  { icon: Search, title: 'Agentic Scan', desc: 'Our AI agents perform cross-referencing and semantic analysis using the latest LLM reasoning protocols.' },
  { icon: CheckCircle, title: 'Verdict', desc: 'Get a comprehensive report with a confidence score, verdict, and a step-by-step logical explanation.' },
];

const stats: LandingStat[] = [
  { value: '70B+', label: 'Parameters' },
  { value: 'Langchain', label: 'Agent Framework' },
  { value: 'Groq', label: 'LPU Inference' },
];

const techStack = ['React', 'TypeScript', 'FastAPI', 'Python', 'Langchain', 'Groq', 'Llama 3.3'];

const faqs: FAQItem[] = [
  { q: 'How does TruthLens detect fake article?', a: 'TruthLens uses state-of-the-art Large Language Models (Llama 3.3 70B via Groq) orchestrated by Langchain agents to perform deep semantic analysis and fact-checking of the provided content.' },
  { q: 'Do you store the text I analyze?', a: 'Yes, analyzed texts are stored in your personal history so you can review past analyses. All data is encrypted and only accessible to your account.' },
  { q: 'Is this service free to use?', a: 'Yes! TruthLens is completely free and open-source. Register for an account and start analyzing articles immediately with no limits.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-36 text-center overflow-hidden">
        <div className="hero-glow" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Badge variant="outline" className="mb-6 gap-2 px-4 py-2 animate-fade-in-up">
            <Shield className="h-3.5 w-3.5" /> Agentic AI Fact-Checking
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Detect <span className="gradient-text">Fake article</span><br />In Seconds
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '.1s' }}>
            Verify any article article or URL using our advanced AI agents powered by Llama 3.3 and Langchain.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '.2s' }}>
            <Button size="lg" asChild>
              <Link to="/register"><Search className="h-4 w-4 mr-2" /> Start Analyzing</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Learn More <ChevronRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Why Choose TruthLens?</h2>
          <p className="text-muted-foreground mb-12">Powered by cutting-edge machine learning for reliable results</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="text-left transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">The Analysis Pipeline</h2>
          <p className="text-muted-foreground mb-12">From raw input to final verdict in milliseconds.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <Card key={i} className="relative text-center">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-5 text-muted-foreground"><ChevronRight className="h-5 w-5" /></div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Built With Modern Tech</h2>
          <p className="text-muted-foreground mb-12">Best open-source tools for speed, accuracy, and reliability.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((t, i) => (
              <Badge key={i} variant="outline" className="px-6 py-3 text-sm font-medium transition-all hover:-translate-y-1">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3 text-left">
            {faqs.map((f, i) => (
              <Card key={i} className="overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-transparent border-none text-left text-foreground font-medium cursor-pointer">
                  <span>{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in-up"><p>{f.a}</p></div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-card">
        <h2 className="text-3xl font-bold mb-4">Ready to Fight Misinformation?</h2>
        <p className="text-muted-foreground mb-8">Join thousands of users who trust TruthLens to verify article.</p>
        <Button size="lg" asChild>
          <Link to="/register">Get Started Free <ChevronRight className="h-4 w-4 ml-2" /></Link>
        </Button>
      </section>
    </div>
  );
}
