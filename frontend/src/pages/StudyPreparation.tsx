import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import MemberRegister from '@Components/preparation/MemberRegister/MemberRegister';
import MemberRestart from '@Components/preparation/MemberRestart/MemberRestart';
import ParticipationCodeCopier from '@Components/preparation/ParticipationCodeCopier/ParticipationCodeCopier';

import { getCookie } from '@Utils/cookie';

import { requestCheckIsMember } from '@Apis/index';

import StudyPreparationLayout from './layout/StudyPreparationLayout';

type LocationState = {
  state: { participantCode: string; studyName: string; isHost: boolean };
};

const StudyPreparation = () => {
  const { studyId } = useParams();

  const [nickname, setNickname] = useState<string | null>(null);
  const isExistMember = Boolean(nickname);

  const memberId = getCookie('memberId');

  const restart = () => setNickname(null);

  const {
    state: { participantCode, studyName, isHost },
  } = useLocation() as LocationState;

  const authenticateMember = useCallback(async () => {
    if (!studyId || !memberId) throw Error('잘못된 접근입니다.');

    const { nickname } = await requestCheckIsMember(studyId, memberId);

    setNickname(nickname);
  }, [memberId, studyId]);

  useEffect(() => {
    if (isHost) return;
    try {
      authenticateMember();
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      alert(error.message);
    }
  }, [authenticateMember, isHost]);

  if (!studyId) return <div>잘못된 접근입니다.</div>;

  return (
    <StudyPreparationLayout headerText={`${studyName} 스터디`}>
      <Layout>
        {isHost && <ParticipationCodeCopier participantCode={participantCode} />}
        {isExistMember ? (
          <MemberRestart studyName={studyName} nickname={nickname} studyId={studyId} restart={restart} />
        ) : (
          <MemberRegister studyId={studyId} studyName={studyName} />
        )}
      </Layout>
    </StudyPreparationLayout>
  );
};

export default StudyPreparation;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 70px;
`;
