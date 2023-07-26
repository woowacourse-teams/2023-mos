export type Step = 'planning' | 'studying' | 'retrospect';

export type StudyFetchingData = {
  studyName: string;
  totalCycle: number;
  currentCycle: number;
  timePerCycle: number;
  step: Step;
};

export type StudyData = {
  studyId: string;
  memberId: string;
} & StudyFetchingData;

export type Plan = 'toDo' | 'completionCondition' | 'expectedProbability' | 'expectedDifficulty' | 'whatCanYouDo';

export type PlanList = Record<Plan, string>;

export type Retrospect = 'doneAsExpected' | 'experiencedDifficulty' | 'lesson';

export type RetrospectList = Record<Retrospect, string>;
