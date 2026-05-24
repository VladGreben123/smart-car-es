import { FACTS } from "../knowledge/facts";
import type { ScenarioName } from "../knowledge/questions";
import { Trace, fixate, type Step } from "./trace";

export type AnalysisResult = Step[] | string;

/** Анализатор сценария «Пешеходный переход». */
export function analyzePedestrian(facts: string[]): AnalysisResult {
  if (!facts.includes("Ф2")) {
    return "Пешеходный переход не зафиксирован. Действие не требуется.";
  }

  const trace = new Trace();
  for (const f of facts) fixate(trace, f);

  if (trace.has("Ф2", "Ф14")) {
    trace.add("П1", `Ф64 — ${FACTS["Ф64"]} (п. 14.1)`);
    trace.remember("Ф64");
  }

  if (trace.has("Ф19")) {
    trace.add("П12", `Ф75 — ${FACTS["Ф75"]} (п. 10.2)`);
    trace.remember("Ф75");
  }

  if (trace.has("Ф14", "Ф21", "Ф19")) {
    trace.add("вывод", `Ф53 — ${FACTS["Ф53"]}`);
    trace.remember("Ф53");
  }

  if (trace.has("Ф53")) {
    trace.add("П8", `ИТОГОВОЕ РЕШЕНИЕ: Ф71 — ${FACTS["Ф71"]} (п. 10.1)`);
    return trace.steps;
  }

  if (!trace.has("Ф64") && !trace.has("Ф75")) {
    trace.add("—", "Опасных факторов не выявлено, движение можно продолжить");
  }

  return trace.steps;
}

/** Анализатор сценария «Перекрёсток». */
export function analyzeCrossroad(facts: string[]): AnalysisResult {
  if (!facts.includes("Ф1")) {
    return "Перекрёсток не зафиксирован. Действие не требуется.";
  }

  const trace = new Trace();
  for (const f of facts) fixate(trace, f);

  if (trace.has("Ф6", "Ф8")) {
    if (trace.has("Ф16")) {
      trace.add("П4", `ИТОГОВОЕ РЕШЕНИЕ: Ф67 — ${FACTS["Ф67"]} (п. 13.9)`);
      return trace.steps;
    }
    trace.add("П4", "Условие Ф6 ∧ Ф8 выполнено, но ТС на главной нет (Ф17)");
    trace.add("—", "Уступать некому, движение можно продолжить");
    return trace.steps;
  }

  trace.add("—", "Условия правил приоритета не выполнены");
  return trace.steps;
}

/** Анализатор сценария «Перестроение». */
export function analyzeManeuver(facts: string[]): AnalysisResult {
  if (!facts.includes("Ф3")) {
    return "Манёвр не зафиксирован. Действие не требуется.";
  }

  const trace = new Trace();
  for (const f of facts) fixate(trace, f);

  if (trace.has("Ф33", "Ф38")) {
    trace.add("П7", `Ф70 — ${FACTS["Ф70"]} (п. 8.4)`);
    trace.remember("Ф70");
  }

  if (trace.has("Ф3", "Ф22")) {
    trace.add("П14", `Ф77 — ${FACTS["Ф77"]} (вычисляемое)`);
    trace.remember("Ф77");
  }

  if (!trace.has("Ф70") && !trace.has("Ф77")) {
    trace.add("—", "Условия правил перестроения не выполнены");
    return trace.steps;
  }

  if (trace.has("Ф77")) {
    trace.add("ИТОГ", `ИТОГОВОЕ РЕШЕНИЕ: ${FACTS["Ф77"]} — перестроение отложить`);
  } else {
    trace.add("ИТОГ", `ИТОГОВОЕ РЕШЕНИЕ: ${FACTS["Ф70"]}`);
  }

  return trace.steps;
}

export const ANALYZERS: Record<ScenarioName, (facts: string[]) => AnalysisResult> = {
  "Пешеходный переход": analyzePedestrian,
  "Перекрёсток": analyzeCrossroad,
  "Перестроение": analyzeManeuver,
};
