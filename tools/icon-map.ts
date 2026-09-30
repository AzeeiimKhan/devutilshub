import {
  BadgeCheck,
  Binary,
  Braces,
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
  key: KeyRound,
  wrench: Wrench,
};
