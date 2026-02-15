import { useState } from 'react';
import type { Question, Answer } from '../../types';
import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import ScaleSlider from '../../components/ui/ScaleSlider/ScaleSlider';
import Button from '../../components/ui/Button/Button';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
}: QuestionCardProps) {
  const [openText, setOpenText] = useState(answer?.openText ?? '');

  const handleSingleSelect = (optionId: string) => {
    onAnswer({
      questionId: question.id,
      selectedOptions: [optionId],
    });
  };

  const handleMultipleSelect = (optionId: string) => {
    const current = answer?.selectedOptions ?? [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    onAnswer({
      questionId: question.id,
      selectedOptions: updated,
    });
  };

  const handleScaleChange = (value: number) => {
    onAnswer({
      questionId: question.id,
      scaleValue: value,
    });
  };

  const handleOpenText = (text: string) => {
    setOpenText(text);
    onAnswer({
      questionId: question.id,
      openText: text,
    });
  };

  const isAnswered = (): boolean => {
    if (!answer) return false;
    if (question.type === 'single' || question.type === 'multiple') {
      return (answer.selectedOptions?.length ?? 0) > 0;
    }
    if (question.type === 'scale') {
      return answer.scaleValue !== undefined;
    }
    if (question.type === 'open') {
      return (answer.openText?.trim().length ?? 0) > 0;
    }
    return false;
  };

  const canProceed = !question.required || isAnswered();

  return (
    <div className={styles.container}>
      <h3 className={styles.questionText}>{question.text}</h3>

      {question.type === 'single' && (
        <div className={styles.options}>
          {question.options?.map((option) => (
            <Card
              key={option.id}
              selected={answer?.selectedOptions?.includes(option.id) ?? false}
              onClick={() => handleSingleSelect(option.id)}
              hoverable
            >
              <div className={styles.optionContent}>
                <div
                  className={`${styles.radio} ${answer?.selectedOptions?.includes(option.id) ? styles.radioSelected : ''}`}
                />
                <span>{option.text}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {question.type === 'multiple' && (
        <>
          <p className={styles.hint}>ניתן לבחור כמה תשובות</p>
          <div className={styles.options}>
            {question.options?.map((option) => (
              <Card
                key={option.id}
                selected={answer?.selectedOptions?.includes(option.id) ?? false}
                onClick={() => handleMultipleSelect(option.id)}
                hoverable
              >
                <div className={styles.optionContent}>
                  <div
                    className={`${styles.checkbox} ${answer?.selectedOptions?.includes(option.id) ? styles.checkboxSelected : ''}`}
                  >
                    {answer?.selectedOptions?.includes(option.id) && '✓'}
                  </div>
                  <span>{option.text}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {question.type === 'scale' && (
        <div className={styles.scaleContainer}>
          <ScaleSlider
            value={answer?.scaleValue ?? Math.round(((question.minScale ?? 1) + (question.maxScale ?? 10)) / 2)}
            onChange={handleScaleChange}
            min={question.minScale ?? 1}
            max={question.maxScale ?? 10}
            labels={question.scaleLabels}
          />
        </div>
      )}

      {question.type === 'open' && (
        <div className={styles.openContainer}>
          <Input
            value={openText}
            onChange={handleOpenText}
            placeholder={question.placeholder}
            multiline
            rows={5}
          />
        </div>
      )}

      <div className={styles.navigation}>
        {!isFirst && (
          <Button variant="outline" onClick={onBack}>
            חזרה
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={!canProceed}
        >
          {isLast ? 'סיום השאלון' : 'הבא'}
        </Button>
      </div>

      {!question.required && (
        <p className={styles.skipNote}>
          שאלה אופציונלית - אפשר לדלג
        </p>
      )}
    </div>
  );
}
