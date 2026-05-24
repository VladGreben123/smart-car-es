import type { AnalysisResult } from "../inference/analyzers";
import type { ScenarioName } from "../knowledge/questions";
import styles from "./TraceTable.module.css";

type Props = {
  scenario: ScenarioName | null;
  facts: string[];
  result: AnalysisResult | null;
};

export function TraceTable({ scenario, facts, result }: Props) {
  if (result === null) {
    return (
      <div className={styles.placeholder}>
        Здесь появится трассировка механизма вывода после нажатия кнопки
        «Показать объяснение».
      </div>
    );
  }

  if (typeof result === "string") {
    return (
      <div className={styles.message}>
        <h2>МЕХАНИЗМ ВЫВОДА — {scenario}</h2>
        <p>{result}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>МЕХАНИЗМ ВЫВОДА — {scenario}</h2>
      <p className={styles.facts}>
        Зафиксированные факты: <strong>{facts.length ? facts.join(", ") : "—"}</strong>
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Шаг</th>
            <th>Рабочая память</th>
            <th>Правило</th>
            <th>Вывод / действие</th>
          </tr>
        </thead>
        <tbody>
          {result.map((step) => (
            <tr key={step.step}>
              <td>{step.step}</td>
              <td>{step.memory}</td>
              <td className={styles.rule}>{step.rule}</td>
              <td>{step.output}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
