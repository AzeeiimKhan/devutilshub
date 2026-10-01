import {
  BadgeCheck,
  Binary,
  Braces,
  Clock3,
  Fingerprint,
  GitCompareArrows,
  KeyRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ToolIconName } from "@/types/tool";

export const toolIconMap: Record<ToolIconName, LucideIcon> = {
  binary: Binary,
  braces: Braces,
  "check-braces": BadgeCheck,
  clock: Clock3,
  compare: GitCompareArrows,
  fingerprint: Fingerprint,
  key: KeyRound,
  wrench: Wrench,
};
