import type { Job, Stage } from "../../src/lib/types";

const roleBenchmarks: Record<Job["role_family"], { min: number; max: number }> = {
  fde: { min: 170000, max: 260000 },
  deployed_engineer: { min: 160000, max: 245000 },
  solutions_engineer: { min: 145000, max: 220000 },
  ai_engineer: { min: 170000, max: 260000 },
  other: { min: 135000, max: 200000 }
};

const stageAdjustment: Partial<Record<Stage, number>> = {
  seed: -30000,
  series_a: -25000,
  series_b: -15000,
  series_c: -5000,
  bootstrapped: -15000
};

export function benchmarkBaseComp(role: Job["role_family"], stage: Stage) {
  const benchmark = roleBenchmarks[role] ?? roleBenchmarks.other;
  const adjustment = stageAdjustment[stage] ?? 0;
  return {
    min: Math.max(90000, benchmark.min + adjustment),
    max: Math.max(130000, benchmark.max + adjustment)
  };
}
