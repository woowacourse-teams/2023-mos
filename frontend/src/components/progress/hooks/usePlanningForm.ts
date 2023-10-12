import useMutation from '@Hooks/api/useMutation';
import useQuestionTextarea from '@Hooks/common/useQuestionTextarea';

import { useParticipantInfo, useStudyInfo, useStudyProgressAction } from '@Contexts/StudyProgressProvider';

import { requestWritePlan } from '@Apis/index';

const usePlanningForm = () => {
  const { studyId } = useStudyInfo();
  const { participantId } = useParticipantInfo();
  const { moveToNextStep } = useStudyProgressAction();

  const { mutate: submitForm, isLoading: isSubmitLoading } = useMutation(async () => {
    await requestWritePlan(studyId, participantId, {
      toDo: questionTextareaProps.toDo.value,
      completionCondition: questionTextareaProps.completionCondition.value,
      expectedProbability: questionTextareaProps.expectedProbability.value,
      expectedDifficulty: questionTextareaProps.expectedDifficulty.value,
      whatCanYouDo: questionTextareaProps.whatCanYouDo.value,
    });
    await moveToNextStep();
  });

  const questionTextareaProps = {
    toDo: useQuestionTextarea({
      minLength: 10,
      maxLength: 500,
      required: true,
    }),
    completionCondition: useQuestionTextarea({
      minLength: 10,
      maxLength: 500,
      required: true,
    }),
    expectedProbability: useQuestionTextarea({
      maxLength: 500,
    }),
    expectedDifficulty: useQuestionTextarea({
      maxLength: 500,
    }),
    whatCanYouDo: useQuestionTextarea({
      maxLength: 500,
    }),
  } as const;

  const isInvalidForm = !!(
    questionTextareaProps.toDo.errorMessage ||
    questionTextareaProps.completionCondition.errorMessage ||
    questionTextareaProps.expectedDifficulty.errorMessage ||
    questionTextareaProps.expectedProbability.errorMessage ||
    questionTextareaProps.whatCanYouDo.errorMessage
  );

  return { questionTextareaProps, isSubmitLoading, isInvalidForm, submitForm };
};

export default usePlanningForm;
