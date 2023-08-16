import { css, styled } from 'styled-components';

import QuestionAnswer from '@Components/common/QuestionAnswer/QuestionAnswer';
import Tabs from '@Components/common/Tabs/Tabs';
import TabsSkeleton from '@Components/common/Tabs/TabsSkeleton';
import Typography from '@Components/common/Typography/Typography';

import useMemberRecord from '@Hooks/record/useMemberRecord';

import color from '@Styles/color';

import { PLAN_KEYWORDS, RETROSPECT_KEYWORDS } from '@Constants/study';

import GoalIcon from '@Assets/icons/GoalIcon';
import PencilIcon from '@Assets/icons/PencilIcon';

import { getKeys } from '@Utils/getKeys';

import type { Plan, Retrospect } from '@Types/study';

type Props = {
  studyId: string;
  progressId: string;
  nickname: string;
  isCompleted: boolean;
  currentCycle: number;
};

const MemberRecord = ({ studyId, nickname, progressId, isCompleted, currentCycle }: Props) => {
  const { memberRecordContents, isLoading } = useMemberRecord(studyId, progressId, {
    errorHandler: (error) => alert(error.message),
  });

  if (isLoading) {
    return <TabsSkeleton />;
  }

  const isDoneCycle = (cycle: number) => {
    if (isCompleted) return true;

    return currentCycle > cycle;
  };

  return (
    <MemberRecordLayout>
      <Tabs>
        {memberRecordContents?.map((content) => (
          <Tabs.Item key={content.cycle} label={`${content.cycle}번째 사이클`}>
            {isDoneCycle(content.cycle) ? (
              <TabItemContainer>
                <TabItemSection>
                  <Typography variant="h5">
                    <GoalIcon color={color.blue[500]} />
                    {nickname}가 작성한 목표
                  </Typography>
                  {getKeys<Plan>(PLAN_KEYWORDS).map((key) => (
                    <QuestionAnswer
                      key={key}
                      question={PLAN_KEYWORDS[key]}
                      answer={content.plan[key]}
                      iconColor={color.blue[500]}
                    />
                  ))}
                </TabItemSection>
                <TabItemSection>
                  <Typography variant="h5">
                    <PencilIcon color={color.teal[500]} />
                    {nickname}가 작성한 회고
                  </Typography>
                  {getKeys<Retrospect>(RETROSPECT_KEYWORDS).map((key) => (
                    <QuestionAnswer
                      key={key}
                      question={RETROSPECT_KEYWORDS[key]}
                      answer={content.retrospect[key]}
                      iconColor={color.teal[500]}
                    />
                  ))}
                </TabItemSection>
              </TabItemContainer>
            ) : (
              <Typography
                variant="p2"
                key={content.cycle}
                $style={css`
                  margin-top: 40px;
                `}
              >
                아직 사이클을 완료하지 않았어요. 사이클을 완료하면 기록을 볼 수 있어요.
              </Typography>
            )}
          </Tabs.Item>
        ))}
      </Tabs>
    </MemberRecordLayout>
  );
};

export default MemberRecord;

const MemberRecordLayout = styled.div`
  padding: 40px 30px;

  h5 {
    display: flex;
    align-items: center;
  }

  svg {
    margin-right: 10px;
  }

  p {
    word-break: break-all;
  }
`;

const TabItemContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 90px;
  align-items: flex-start;

  margin-top: 20px;
`;

const TabItemSection = styled.div`
  display: grid;
  row-gap: 45px;
  align-items: flex-start;
`;
