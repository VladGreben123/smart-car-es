import { QUESTIONS, SCENARIOS, type ScenarioName } from "./questions";
import type { FlatQuestion } from "./layout";

/**
 * Раскладка v2: вопросы идут блоками по сценариям, но без заголовков
 * и рамок. Каждый блок — это группа вопросов одного сценария, которая
 * целиком уезжает в следующую колонку, если не помещается в текущей
 * (`break-inside: avoid` во вьюхе).
 */
export type GroupedBlock = {
  scenario: ScenarioName;
  items: FlatQuestion[];
};

export const GROUPED_BLOCKS: GroupedBlock[] = SCENARIOS.map((scenario) => ({
  scenario,
  items: QUESTIONS[scenario].map((q) => ({
    scenario,
    question: q,
    uid: `${scenario}::${q.key}`,
  })),
}));
