import {
  ShieldCheck,
  Calculator,
  Quote as QuoteIcon,
  Check,
  TriangleAlert,
  Info,
  ArrowRight,
  Copy,
  Plus,
  Minus,
  Clock,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "shield"
  | "calc"
  | "quote"
  | "check"
  | "alert"
  | "info"
  | "arrow"
  | "copy"
  | "plus"
  | "minus"
  | "clock"
  | "bolt";

const MAP: Record<IconName, LucideIcon> = {
  shield: ShieldCheck,
  calc: Calculator,
  quote: QuoteIcon,
  check: Check,
  alert: TriangleAlert,
  info: Info,
  arrow: ArrowRight,
  copy: Copy,
  plus: Plus,
  minus: Minus,
  clock: Clock,
  bolt: Zap,
};

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
}

/** Thin wrapper so markup reads like the approved prototype's <Icon name="..." />,
 *  backed by lucide-react. lucide's stroke style matches the prototype's hand-drawn set. */
export function Icon({ name, size = 20, stroke = 1.6, className }: IconProps) {
  const Cmp = MAP[name];
  return <Cmp size={size} strokeWidth={stroke} className={className} aria-hidden="true" />;
}
