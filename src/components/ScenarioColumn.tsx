import type { Question, ScenarioName } from "../knowledge/questions";
import styles from "./ScenarioColumn.module.css";

type Props = {
  scenario: ScenarioName;
  questions: Question[];
  answers: Record<string, string>;
  active: boolean;
  onAnswerChange: (questionKey: string, label: string) => void;
};

export function ScenarioColumn({
  scenario,
  questions,
  answers,
  active,
  onAnswerChange,
}: Props) {
  const className = `${styles.column} ${active ? styles.active : styles.inactive}`;

  return (
    <fieldset className={className} disabled={!active}>
      <legend className={styles.legend}>{scenario}</legend>

      {questions.map((q, idx) => (
        <div key={q.key} className={styles.questionBlock}>
          <p className={styles.questionText}>
            {idx + 1}. {q.text}
          </p>

          {q.options.map((opt) => {
            const id = `${scenario}-${q.key}-${opt.label}`;
            return (
              <label key={opt.label} htmlFor={id} className={styles.optionLabel}>
                <input
                  id={id}
                  type="radio"
                  name={`${scenario}-${q.key}`}
                  value={opt.label}
                  checked={answers[q.key] === opt.label}
                  onChange={() => onAnswerChange(q.key, opt.label)}
                  disabled={!active}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      ))}
    </fieldset>
  );
}
