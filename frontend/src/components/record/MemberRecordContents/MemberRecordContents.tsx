import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, css } from 'styled-components';

import Typography from '@Components/common/Typography/Typography';

import color from '@Styles/color';

import { useMemberInfo } from '@Contexts/MemberInfoProvider';

import MemberRecordListSkeleton from '../MemberRecordList/MemberRecordListSkeleton';
import MemberRecords from '../MemberRecords/MemberRecords';

const MemberRecordContents = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const memberInfo = useMemberInfo();

  if (memberInfo?.loginType === 'guest') {
    navigate('/404');
  }

  return (
    memberInfo && (
      <>
        <Title>
          <Typography
            variant="h2"
            $style={css`
              font-weight: 700;
            `}
          >
            {memberInfo.name}님의 스터디 기록
          </Typography>
          <ViewModeButtonContainer>
            <ViewModeButton $isSelected={viewMode === 'list'} onClick={() => setViewMode('list')}>
              목록
            </ViewModeButton>
            <ViewModeButton $isSelected={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}>
              달력
            </ViewModeButton>
          </ViewModeButtonContainer>
        </Title>
        {/*  Suspense fallback 이후에 viewMode에 따라 분리 작업 필요 */}
        <Suspense fallback={<MemberRecordListSkeleton />}>
          <MemberRecords memberId={memberInfo.memberId} viewMode={viewMode} />
        </Suspense>
      </>
    )
  );
};

export default MemberRecordContents;

const Title = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 3.2rem;
    }
  }
`;

const ViewModeButtonContainer = styled.div`
  display: flex;
  gap: 2px;

  :nth-child(1) {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  :nth-child(2) {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;

type ViewModeButtonProps = {
  $isSelected: boolean;
};

const ViewModeButton = styled.button<ViewModeButtonProps>`
  flex: 1;

  padding: 10px 25px;

  transition: all 0.2s ease;

  ${({ $isSelected }) => css`
    background-color: ${$isSelected ? color.blue[200] : color.neutral[100]};
    font-weight: ${$isSelected ? 500 : 300};
  `}
`;
