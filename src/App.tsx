import { useMemo, useState } from "react";
import { QuestionItem } from "./components/QuestionItem";
import { TraceTable } from "./components/TraceTable";
import { ANALYZERS, type AnalysisResult } from "./inference/analyzers";
import { FLAT_QUESTIONS } from "./knowledge/layout";
import {
  QUESTIONS,
  SCENARIOS,
  SCENARIO_DESCRIPTIONS,
  type ScenarioName,
} from "./knowledge/questions";
import styles from "./App.module.css";

type AnswersByScenario = Record<ScenarioName, Record<string, string>>;

const emptyAnswers = (): AnswersByScenario => ({
  "Пешеходный переход": {},
  "Перекрёсток": {},
  "Перестроение": {},
});

export function App() {
  const [chosen, setChosen] = useState<ScenarioName | null>(null);
  const [answers, setAnswers] = useState<AnswersByScenario>(emptyAnswers);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const isComplete = useMemo(() => {
    if (!chosen) return false;
    const scenarioAnswers = answers[chosen];
    return QUESTIONS[chosen].every((q) => Boolean(scenarioAnswers[q.key]));
  }, [chosen, answers]);

  const handleScenarioChange = (next: ScenarioName) => {
    setChosen(next);
    setResult(null);
    setAnswers(emptyAnswers);
  };

  const handleAnswerChange = (
    scenario: ScenarioName,
    questionKey: string,
    label: string,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [scenario]: { ...prev[scenario], [questionKey]: label },
    }));
  };

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

  const handleExplain = () => {
    if (!chosen) return;
    setResult(ANALYZERS[chosen](collectedFacts));
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Экспертная система «Умный автомобиль»</h1>

      <section className={styles.scenarios}>
        <div className={styles.scenariosLegend}>
          Выберите дорожную ситуацию
        </div>
        <div className={styles.scenariosRow}>
          {SCENARIOS.map((scenario) => (
            <label
              key={scenario}
              className={styles.scenarioRadio}
              title={SCENARIO_DESCRIPTIONS[scenario]}
            >
              <input
                type="radio"
                name="scenario"
                value={scenario}
                checked={chosen === scenario}
                onChange={() => handleScenarioChange(scenario)}
              />
              <span>{scenario}</span>
            </label>
          ))}
        </div>
      </section>

      <section className={styles.questionsArea}>
        <div className={styles.questionsLegend}>Ответьте на вопросы</div>
        <div className={styles.questionsFlow}>
          {FLAT_QUESTIONS.map((item, idx) => {
            const active = chosen === item.scenario;
            const selected = answers[item.scenario][item.question.key];
            return (
              <QuestionItem
                key={item.uid}
                item={item}
                index={idx}
                active={active}
                selected={selected}
                onChange={(label) =>
                  handleAnswerChange(item.scenario, item.question.key, label)
                }
              />
            );
          })}
        </div>
      </section>

      <button
        type="button"
        className={styles.explainButton}
        onClick={handleExplain}
        disabled={!isComplete}
      >
        Показать объяснение
      </button>

      <TraceTable scenario={chosen} facts={collectedFacts} result={result} />
    </div>
  );
}
