import { useMemo, useState } from "react";
import { ScenarioColumn } from "./components/ScenarioColumn";
import { TraceTable } from "./components/TraceTable";
import { ANALYZERS, type AnalysisResult } from "./inference/analyzers";
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
    setAnswers((prev) => {
      const cleared = emptyAnswers();
      cleared[next] = prev[next];
      return cleared;
    });
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

  const handleExplain = () => {
    if (!chosen) return;
    const facts: string[] = [];
    for (const question of QUESTIONS[chosen]) {
      const selected = answers[chosen][question.key];
      if (!selected) continue;
      const option = question.options.find((o) => o.label === selected);
      if (option?.fact) facts.push(option.fact);
    }
    setResult(ANALYZERS[chosen](facts));
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

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Экспертная система «Умный автомобиль»</h1>

      <section className={styles.scenariosFrame}>
        <div className={styles.scenariosFrameLegend}>
          Выберите дорожную ситуацию и ответьте на вопросы
        </div>

        <div className={styles.grid}>
          {SCENARIOS.map((scenario) => {
            const active = chosen === scenario;
            return (
              <div key={scenario} className={styles.cell}>
                <label
                  className={styles.scenarioRadio}
                  title={SCENARIO_DESCRIPTIONS[scenario]}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={scenario}
                    checked={active}
                    onChange={() => handleScenarioChange(scenario)}
                  />
                  <span>{scenario}</span>
                </label>

                <ScenarioColumn
                  scenario={scenario}
                  questions={QUESTIONS[scenario]}
                  answers={answers[scenario]}
                  active={active}
                  onAnswerChange={(qKey, label) =>
                    handleAnswerChange(scenario, qKey, label)
                  }
                />
              </div>
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

      <TraceTable
        scenario={chosen}
        facts={collectedFacts}
        result={result}
      />
    </div>
  );
}
