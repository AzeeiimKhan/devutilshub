import {
  BadgeCheck,
  Binary,
  Braces,
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
  compare: GitCompareArrows,
  fingerprint: Fingerprint,
  key: KeyRound,
  wrench: Wrench,
};
