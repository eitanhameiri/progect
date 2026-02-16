import type { Answer, ProfileScores, ProfileType, UserProfile } from '../types';
import { getQuestions, getCategories } from './questionnaireService';

function getAnswerScore(answer: Answer): number {
  const questions = getQuestions();
  const question = questions.find((q) => q.id === answer.questionId);
  if (!question) return 0;

  if (question.type === 'scale' && answer.scaleValue !== undefined) {
    // Normalize scale to 0-5
    const min = question.minScale ?? 1;
    const max = question.maxScale ?? 10;
    return ((answer.scaleValue - min) / (max - min)) * 5;
  }

  if (question.type === 'single' && answer.selectedOptions?.length) {
    const selected = question.options?.find((o) => o.id === answer.selectedOptions![0]);
    return selected?.value ?? 0;
  }

  if (question.type === 'multiple' && answer.selectedOptions?.length) {
    const total = answer.selectedOptions.reduce((sum, optId) => {
      const opt = question.options?.find((o) => o.id === optId);
      return sum + (opt?.value ?? 0);
    }, 0);
    return total;
  }

  return 0;
}

function calculateCategoryScore(
  answers: Record<string, Answer>,
  category: string
): number {
  const questions = getQuestions();
  const categoryQuestions = questions.filter(
    (q) => q.category === category && q.weight > 0
  );
  if (categoryQuestions.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const q of categoryQuestions) {
    const answer = answers[q.id];
    if (!answer) continue;

    const score = getAnswerScore(answer);
    totalWeightedScore += score * q.weight;
    totalWeight += q.weight;
  }

  if (totalWeight === 0) return 0;

  // Normalize to 0-100
  const rawScore = totalWeightedScore / totalWeight;
  return Math.round((rawScore / 5) * 100);
}

function determineGoalHorizon(
  answers: Record<string, Answer>
): 'short' | 'medium' | 'long' {
  const horizonAnswer = answers['goals_horizon'];
  if (!horizonAnswer?.selectedOptions?.length) return 'medium';

  const selected = horizonAnswer.selectedOptions[0];
  if (selected === 'g2_1') return 'short';
  if (selected === 'g2_2' || selected === 'g2_3') return 'medium';
  return 'long';
}

function determineBehaviorPattern(
  answers: Record<string, Answer>
): 'active' | 'passive' | 'balanced' {
  const freqAnswer = answers['behavior_check_frequency'];
  if (!freqAnswer?.selectedOptions?.length) return 'balanced';

  const selected = freqAnswer.selectedOptions[0];
  if (selected === 'b1_1' || selected === 'b1_2') return 'passive';
  if (selected === 'b1_4' || selected === 'b1_5') return 'active';
  return 'balanced';
}

function determineProfileType(riskTolerance: number): ProfileType {
  if (riskTolerance < 35) return 'conservative';
  if (riskTolerance < 65) return 'moderate';
  return 'aggressive';
}

export function calculateProfile(
  answers: Record<string, Answer>
): UserProfile {
  const questions = getQuestions();
  const categories = getCategories();
  const optionalCategories = categories.filter((c) => !c.required).map((c) => c.id);

  const riskTolerance = calculateCategoryScore(answers, 'risk');
  const experience = calculateCategoryScore(answers, 'experience');
  const knowledge = calculateCategoryScore(answers, 'experience'); // shared category

  const scores: ProfileScores = {
    riskTolerance,
    experience,
    knowledge,
    goalHorizon: determineGoalHorizon(answers),
    behaviorPattern: determineBehaviorPattern(answers),
  };

  // Separate personal info from investment answers
  const personalInfo: Record<string, Answer> = {};
  const investmentAnswers: Record<string, Answer> = {};

  for (const [key, answer] of Object.entries(answers)) {
    const question = questions.find((q) => q.id === key);
    if (question && optionalCategories.includes(question.category)) {
      personalInfo[key] = answer;
    } else {
      investmentAnswers[key] = answer;
    }
  }

  return {
    profileType: determineProfileType(riskTolerance),
    scores,
    answers: investmentAnswers,
    personalInfo,
    completedAt: new Date().toISOString(),
  };
}
