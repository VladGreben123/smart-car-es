import { FACTS } from "../knowledge/facts";

export type Step = {
  step: number;
  memory: string;
  rule: string;
  output: string;
};

/** Накопитель шагов трассировки и строк рабочей памяти. */
export class Trace {
  private readonly steps_: Step[] = [];
  private readonly memory_: string[] = [];

  remember(factId: string): void {
    if (factId && !this.memory_.includes(factId)) {
      this.memory_.push(factId);
    }
  }

  add(rule: string, output: string): void {
    this.steps_.push({
      step: this.steps_.length + 1,
      memory: this.memory_.join(", ") || "—",
      rule,
      output,
    });
  }

  has(...factIds: string[]): boolean {
    return factIds.every((f) => this.memory_.includes(f));
  }

  get steps(): Step[] {
    return this.steps_;
  }
}

/** Зафиксировать факт-вход и оставить запись в трассировке. */
export function fixate(trace: Trace, factId: string, source = "вход"): void {
  if (!factId) return;
  const description = FACTS[factId] ?? "";
  trace.remember(factId);
  trace.add(source, `${factId} — ${description}`);
}
