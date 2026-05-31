import { useState } from "react";
import { LayoutGrouped } from "./components/LayoutGrouped";
import { LayoutMixed } from "./components/LayoutMixed";
import { ScenarioPicker } from "./components/ScenarioPicker";
import { TraceTable } from "./components/TraceTable";
import { useExpertSession } from "./hooks/useExpertSession";
import styles from "./App.module.css";

type Mode = "mixed" | "grouped";

const MODE_LABELS: Record<Mode, string> = {
  mixed: "Семантический порядок",
  grouped: "По сценариям",
};

export function App() {
  const [mode, setMode] = useState<Mode>("grouped");
  const session = useExpertSession();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Экспертная система «Умный автомобиль»</h1>
        <div className={styles.modeSwitch} role="tablist" aria-label="Раскладка">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              className={`${styles.modeButton} ${mode === m ? styles.modeButtonActive : ""}`}
              onClick={() => setMode(m)}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </header>

      <ScenarioPicker chosen={session.chosen} onChange={session.selectScenario} />

      {mode === "grouped" ? (
        <LayoutGrouped
          chosen={session.chosen}
          answers={session.answers}
          onAnswer={session.setAnswer}
        />
      ) : (
        <LayoutMixed
          chosen={session.chosen}
          answers={session.answers}
          onAnswer={session.setAnswer}
        />
      )}

      <button
        type="button"
        className={styles.explainButton}
        onClick={session.runExplain}
        disabled={!session.isComplete}
      >
        Показать объяснение
      </button>

      <TraceTable
        scenario={session.chosen}
        facts={session.collectedFacts}
        result={session.result}
      />
    </div>
  );
}
