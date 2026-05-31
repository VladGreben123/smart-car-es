import { QUESTIONS, SCENARIOS } from "./questions";
import type { FlatQuestion } from "./layout";

/**
 * Раскладка v2: вопросы идут блоками по сценариям, но без заголовков
 * и рамок. Внутри блока — естественный порядок исходного сценария
 * (тип → детализация → дистанции/скорость).
 *
 * Между блоками вставляется логический «разрыв» — он используется
 * вьюхой для визуального промежутка (но НЕ для подписи, к какому
 * сценарию относится блок).
 */
export type GroupedItem =
  | { kind: "question"; data: FlatQuestion }
  | { kind: "gap" };

export const GROUPED_ITEMS: GroupedItem[] = SCENARIOS.flatMap((scenario, i) => {
  const block: GroupedItem[] = QUESTIONS[scenario].map((q) => ({
    kind: "question" as const,
    data: { scenario, question: q, uid: `${scenario}::${q.key}` },
  }));
  return i < SCENARIOS.length - 1
    ? [...block, { kind: "gap" as const }]
    : block;
});
