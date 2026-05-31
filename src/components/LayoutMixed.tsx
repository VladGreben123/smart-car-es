import { QuestionItem } from "./QuestionItem";
import { FLAT_QUESTIONS } from "../knowledge/layout";
import type { ScenarioName } from "../knowledge/questions";
import type { AnswersByScenario } from "../hooks/useExpertSession";
import styles from "./LayoutMixed.module.css";

type Props = {
  chosen: ScenarioName | null;
  answers: AnswersByScenario;
  onAnswer: (scenario: ScenarioName, questionKey: string, label: string) => void;
};

/**
 * V1. Общая зона с семантическим порядком (тип → знак → участники →
 * дистанции/скорость). Вопросы разных сценариев перемешаны.
 */
export function LayoutMixed({ chosen, answers, onAnswer }: Props) {
  return (
    <section className={styles.area}>
      <div className={styles.legend}>Ответьте на вопросы</div>
      <div className={styles.flow}>
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
                onAnswer(item.scenario, item.question.key, label)
              }
            />
          );
        })}
      </div>
    </section>
  );
}
