import http from '@Utils/http';

import type {
  ResponseAuthToken,
  ResponseCreateStudy,
  ResponseMemberInfo,
  ResponseMemberRecordContents,
  ResponseMemberStudyMetadata,
  ResponsePlanList,
  ResponseProgresses,
  ResponseStudies,
  ResponseStudyMetadata,
} from '@Types/api';
import type { OAuthProvider } from '@Types/auth';
import type { PlanList, RetrospectList, StudyTimePerCycleOptions, TotalCycleOptions } from '@Types/study';

const BASE_URL = '/api/v2';

// 옛날거
export const requestSubmitPlanningForm = (studyId: string, memberId: string, plans: PlanList) =>
  http.post(`/api/studies/${studyId}/members/${memberId}/content/plans`, {
    body: JSON.stringify(plans),
  });

export const requestSubmitRetrospectForm = (studyId: string, memberId: string, retrospects: RetrospectList) =>
  http.post(`/api/studies/${studyId}/members/${memberId}/content/retrospects`, { body: JSON.stringify(retrospects) });

export const requestGetMemberStudyMetadata = (studyId: string, memberId: string) =>
  http.get<ResponseMemberStudyMetadata>(`/api/studies/${studyId}/members/${memberId}/metadata`);

export const requestGetStudyingContent = (studyId: string, memberId: string, cycle: number) =>
  http.get<ResponsePlanList>(`/api/studies/${studyId}/members/${memberId}/content/plans?cycle=${cycle}`);

export const requestSubmitStudyingForm = (studyId: string, memberId: string) =>
  http.post(`/api/studies/${studyId}/members/${memberId}/next-step`);

export const requestGetStudyData = (studyId: string, accessToken: string) =>
  http.get<Omit<ResponseStudyMetadata, 'progresses'>>(`/api/studies/${studyId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestGetStudyMembers = (studyId: string, accessToken: string) =>
  http.get<Pick<ResponseStudyMetadata, 'progresses'>>(`/api/studies/${studyId}/progresses`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestGetMemberRecordContents = (studyId: string, progressId: string, accessToken: string) =>
  http.get<ResponseMemberRecordContents>(`/api/studies/${studyId}/contents?progressId=${progressId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

// 새로 적용되는 api
export const requestGuestLogin = async () => {
  const response = await http.post('/api/auth/guest');

  return (await response.json()) as ResponseAuthToken;
};

export const requestOAuthLogin = async (provider: OAuthProvider, code: string) => {
  const response = await http.post('/api/auth/login', {
    body: JSON.stringify({ oauthProvider: provider, code }),
  });

  return (await response.json()) as ResponseAuthToken;
};

export const requestMemberInfo = (accessToken: string, memberId: string) =>
  http.get<ResponseMemberInfo>(`/api/members/${memberId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestAccessTokenRefresh = async () => {
  const response = await http.post(`/api/auth/refresh`);

  return (await response.json()) as ResponseAuthToken;
};

export const requestCreateStudy = async (
  studyName: string,
  totalCycle: TotalCycleOptions,
  timePerCycle: StudyTimePerCycleOptions,
  accessToken: string,
) => {
  const response = await http.post(`/api/studies`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ name: studyName, totalCycle, timePerCycle }),
  });

  const locationHeader = response.headers.get('Location');
  const studyId = locationHeader?.split('/').pop() as string;

  const result = (await response.json()) as ResponseCreateStudy;

  return { studyId, result };
};

export const requestAuthenticateParticipationCode = (participantCode: string, accessToken: string) =>
  http.get<ResponseStudies>(`/api/studies?participantCode=${participantCode}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestCheckProgresses = async (studyId: string, memberId: string, accessToken: string) =>
  http.get<ResponseProgresses>(`/api/studies/${studyId}/progresses?memberId=${memberId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestRegisterProgress = (nickname: string, studyId: string, memberId: string, accessToken: string) =>
  http.post(`/api/studies/${studyId}/progresses`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ memberId, nickname }),
  });
