import type { LucideIcon } from 'lucide-react';

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface LandingStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface LandingStat {
  value: string;
  label: string;
}

export interface FAQItem {
  q: string;
  a: string;
}
