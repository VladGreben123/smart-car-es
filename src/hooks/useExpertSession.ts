import { useMemo, useState, useCallback } from "react";
import { ANALYZERS, type AnalysisResult } from "../inference/analyzers";
import { QUESTIONS, type ScenarioName } from "../knowledge/questions";

export type AnswersByScenario = Record<ScenarioName, Record<string, string>>;

const emptyAnswers = (): AnswersByScenario => ({
  "Пешеходный переход": {},
  "Перекрёсток": {},
  "Перестроение": {},
});

/**
 * Общая логика опроса: хранит выбранный сценарий и ответы,
 * предоставляет факты, флаг готовности и метод запуска анализа.
 * Используется во всех вариантах раскладки UI.
 */
export function useExpertSession() {
  const [chosen, setChosen] = useState<ScenarioName | null>(null);
  const [answers, setAnswers] = useState<AnswersByScenario>(emptyAnswers);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const selectScenario = useCallback((next: ScenarioName) => {
    setChosen(next);
    setResult(null);
    setAnswers(emptyAnswers);
  }, []);

  const setAnswer = useCallback(
    (scenario: ScenarioName, questionKey: string, label: string) => {
      setAnswers((prev) => ({
        ...prev,
        [scenario]: { ...prev[scenario], [questionKey]: label },
      }));
    },
    [],
  );

  const collectedFacts = useMemo(() => {
    if (!chosen) return [];
    const facts: string[] = [];
    for (const question of QUESTIONS[chosen]) {
      const selected = answers[chosen][question.key];
      if (!selected) continue;
      const option = question.options.find((o) => o.label === selected);
      if (option?.fact) facts.push(option.fact);
    }
    return facts;
  }, [chosen, answers]);

  const isComplete = useMemo(() => {
    if (!chosen) return false;
    return QUESTIONS[chosen].every((q) => Boolean(answers[chosen][q.key]));
  }, [chosen, answers]);

  const runExplain = useCallback(() => {
    if (!chosen) return;
    setResult(ANALYZERS[chosen](collectedFacts));
  }, [chosen, collectedFacts]);

  return {
    chosen,
    answers,
    result,
    isComplete,
    collectedFacts,
    selectScenario,
    setAnswer,
    runExplain,
  };
}
