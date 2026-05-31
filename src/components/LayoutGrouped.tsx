import { Fragment } from "react";
import { QuestionItem } from "./QuestionItem";
import { GROUPED_ITEMS } from "../knowledge/groupedLayout";
import type { ScenarioName } from "../knowledge/questions";
import type { AnswersByScenario } from "../hooks/useExpertSession";
import styles from "./LayoutGrouped.module.css";

type Props = {
  chosen: ScenarioName | null;
  answers: AnswersByScenario;
  onAnswer: (scenario: ScenarioName, questionKey: string, label: string) => void;
};

/**
 * V2. Все вопросы остаются на экране, но сгруппированы блоками
 * по сценариям. Подписи групп не показываются — границы видны
 * только по вертикальному отступу между блоками.
 *
 * Когда выбран сценарий, его блок становится контрастным, а
 * остальные приглушаются, но раскладка не меняется.
 */
export function LayoutGrouped({ chosen, answers, onAnswer }: Props) {
  let questionIndex = 0;

  return (
    <section className={styles.area}>
      <div className={styles.legend}>Ответьте на вопросы</div>
      <div className={styles.flow}>
        {GROUPED_ITEMS.map((item, i) => {
          if (item.kind === "gap") {
            return <div key={`gap-${i}`} className={styles.gap} aria-hidden />;
          }
          const flat = item.data;
          const active = chosen === flat.scenario;
          const selected = answers[flat.scenario][flat.question.key];
          const idx = questionIndex++;
          return (
            <Fragment key={flat.uid}>
              <QuestionItem
                item={flat}
                index={idx}
                active={active}
                selected={selected}
                onChange={(label) =>
                  onAnswer(flat.scenario, flat.question.key, label)
                }
              />
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
