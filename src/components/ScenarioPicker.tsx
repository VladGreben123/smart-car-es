import {
  SCENARIOS,
  SCENARIO_DESCRIPTIONS,
  type ScenarioName,
} from "../knowledge/questions";
import styles from "./ScenarioPicker.module.css";

type Props = {
  chosen: ScenarioName | null;
  onChange: (next: ScenarioName) => void;
};

export function ScenarioPicker({ chosen, onChange }: Props) {
  return (
    <section className={styles.frame}>
      <div className={styles.legend}>Выберите дорожную ситуацию</div>
      <div className={styles.row}>
        {SCENARIOS.map((scenario) => (
          <label
            key={scenario}
            className={styles.radio}
            title={SCENARIO_DESCRIPTIONS[scenario]}
          >
            <input
              type="radio"
              name="scenario"
              value={scenario}
              checked={chosen === scenario}
              onChange={() => onChange(scenario)}
            />
            <span>{scenario}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
