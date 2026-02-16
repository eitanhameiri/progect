import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getCategories, getQuestionsByCategory } from '../../services/questionnaireService';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar';
import CategoryIntro from './CategoryIntro';
import QuestionCard from './QuestionCard';
import styles from './Onboarding.module.css';

type ViewState =
  | { type: 'category_intro'; categoryIndex: number }
  | { type: 'question'; categoryIndex: number; questionIndex: number };

export default function Onboarding() {
  const navigate = useNavigate();
  const { answers, setAnswer, completeProfile } = useUser();
  const [view, setView] = useState<ViewState>({
    type: 'category_intro',
    categoryIndex: 0,
  });

  const categories = useMemo(() => getCategories(), []);

  // Build flat list of all questions for progress tracking
  const allQuestions = useMemo(() => {
    return categories.flatMap((cat) => getQuestionsByCategory(cat.id));
  }, [categories]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;

  const currentCategory = categories[view.categoryIndex];
  const currentCategoryQuestions = useMemo(
    () => getQuestionsByCategory(currentCategory.id),
    [currentCategory.id]
  );

  const handleStartCategory = () => {
    setView({
      type: 'question',
      categoryIndex: view.categoryIndex,
      questionIndex: 0,
    });
  };

  const handleSkipCategory = () => {
    const nextCategoryIndex = view.categoryIndex + 1;
    if (nextCategoryIndex < categories.length) {
      setView({ type: 'category_intro', categoryIndex: nextCategoryIndex });
    } else {
      handleFinish();
    }
  };

  const handleNextQuestion = () => {
    if (view.type !== 'question') return;

    const nextQuestionIndex = view.questionIndex + 1;
    if (nextQuestionIndex < currentCategoryQuestions.length) {
      setView({
        type: 'question',
        categoryIndex: view.categoryIndex,
        questionIndex: nextQuestionIndex,
      });
    } else {
      // Move to next category
      const nextCategoryIndex = view.categoryIndex + 1;
      if (nextCategoryIndex < categories.length) {
        setView({ type: 'category_intro', categoryIndex: nextCategoryIndex });
      } else {
        handleFinish();
      }
    }
  };

  const handleBackQuestion = () => {
    if (view.type !== 'question') return;

    if (view.questionIndex > 0) {
      setView({
        type: 'question',
        categoryIndex: view.categoryIndex,
        questionIndex: view.questionIndex - 1,
      });
    } else {
      // Go back to category intro
      setView({ type: 'category_intro', categoryIndex: view.categoryIndex });
    }
  };

  const handleFinish = () => {
    completeProfile();
    navigate('/results');
  };

  const isLastQuestion =
    view.type === 'question' &&
    view.categoryIndex === categories.length - 1 &&
    view.questionIndex === currentCategoryQuestions.length - 1;

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        <ProgressBar
          current={answeredCount}
          total={totalQuestions}
          label="התקדמות"
        />
        <div className={styles.categoryLabel}>
          {currentCategory.icon} {currentCategory.title}
        </div>
      </div>

      <div className={styles.content}>
        {view.type === 'category_intro' && (
          <CategoryIntro
            category={currentCategory}
            onStart={handleStartCategory}
            onSkip={currentCategory.required ? undefined : handleSkipCategory}
          />
        )}

        {view.type === 'question' && (
          <QuestionCard
            key={currentCategoryQuestions[view.questionIndex].id}
            question={currentCategoryQuestions[view.questionIndex]}
            answer={answers[currentCategoryQuestions[view.questionIndex].id]}
            onAnswer={(answer) =>
              setAnswer(currentCategoryQuestions[view.questionIndex].id, answer)
            }
            onNext={handleNextQuestion}
            onBack={handleBackQuestion}
            isFirst={view.categoryIndex === 0 && view.questionIndex === 0}
            isLast={isLastQuestion}
          />
        )}
      </div>
    </div>
  );
}
