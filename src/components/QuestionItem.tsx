import type { FlatQuestion } from "../knowledge/layout";
import styles from "./QuestionItem.module.css";

type Props = {
  item: FlatQuestion;
  index: number;
  active: boolean;
  selected: string | undefined;
  onChange: (label: string) => void;
};

export function QuestionItem({ item, index, active, selected, onChange }: Props) {
  const { question, uid } = item;
  const className = `${styles.item} ${active ? styles.active : styles.inactive}`;

  return (
    <fieldset className={className} disabled={!active}>
      <p className={styles.text}>
        {index + 1}. {question.text}
      </p>
      {question.options.map((opt) => {
        const id = `${uid}::${opt.label}`;
        return (
          <label key={opt.label} htmlFor={id} className={styles.option}>
            <input
              id={id}
              type="radio"
              name={uid}
              value={opt.label}
              checked={selected === opt.label}
              onChange={() => onChange(opt.label)}
              disabled={!active}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
