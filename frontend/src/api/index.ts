import prevHttp from '@Utils/http';

import type {
  ResponseMemberProgress,
  ResponseAuthToken,
  ResponseCreateStudy,
  ResponseMemberInfo,
  ResponseMemberRecordContents,
  ResponseOneStudyInfo,
  ResponseMemberContents,
  ResponseProgresses,
  ResponseStudies,
  ResponseStudyData,
  ResponseStudyDataList,
  ResponseStudyMembers,
} from '@Types/api';
import type { OAuthProvider } from '@Types/auth';
import type { PlanList, RetrospectList, StudyTimePerCycleOptions, TotalCycleOptions } from '@Types/study';

import http from './httpInstance';

const BASE_URL = '';

// 옛날거

export const requestRegisterMember = async (nickname: string, studyId: string) => {
  const response = await prevHttp.post(`${BASE_URL}/api/studies/${studyId}/members`, {
    body: JSON.stringify({ nickname }),
  });

  const locationHeader = response.headers.get('Location');
  const memberId = locationHeader?.split('/').pop() as string;

  return { memberId };
};

export const requestSubmitPlanningForm = (studyId: string, memberId: string, plans: PlanList) =>
  prevHttp.post(`/api/studies/${studyId}/members/${memberId}/content/plans`, {
    body: JSON.stringify(plans),
  });

export const requestGetStudyData = (studyId: string) => http.get<ResponseStudyData>(`/api/studies/${studyId}`);

export const requestGetMemberStudyListData = (memberId: string) =>
  http.get<ResponseStudyDataList>(`/api/studies?memberId=${memberId}`);

export const requestGetStudyMembers = (studyId: string) =>
  http.get<ResponseStudyMembers>(`${BASE_URL}/api/studies/${studyId}/progresses`);

export const requestGetMemberRecordContents = (studyId: string, progressId: string) =>
  http.get<ResponseMemberRecordContents>(`${BASE_URL}/api/studies/${studyId}/contents?progressId=${progressId}`);

// 새로 적용되는 api
export const requestPostGuestLogin = () => http.post<ResponseAuthToken>(`${BASE_URL}/api/auth/guest`);

export const requestPostOAuthLogin = (provider: OAuthProvider, code: string) =>
  http.post<ResponseAuthToken>(`${BASE_URL}/api/auth/login`, {
    body: JSON.stringify({ oauthProvider: provider, code }),
  });

export const requestGetMemberInfo = () => http.get<ResponseMemberInfo>('/api/me');

export const requestAccessTokenRefresh = async () => {
  const response = await prevHttp.post(`${BASE_URL}/api/auth/refresh`);

  return (await response.json()) as ResponseAuthToken;
};

export const requestGetOneStudyData = (accessToken: string, studyId: string) =>
  prevHttp.get<ResponseOneStudyInfo>(`${BASE_URL}/api/studies/${studyId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestGetMemberProgress = (accessToken: string, studyId: string, memberId: string) =>
  prevHttp.get<ResponseMemberProgress>(`${BASE_URL}/api/studies/${studyId}/progresses?memberId=${memberId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestGetMemberContents = (accessToken: string, studyId: string, progressId: string, cycle: number) =>
  prevHttp.get<ResponseMemberContents>(
    `${BASE_URL}/api/studies/${studyId}/contents?progressId=${progressId}&cycle=${cycle}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

export const requestWritePlan = (accessToken: string, studyId: string, progressId: string, plan: PlanList) =>
  prevHttp.post(`${BASE_URL}/api/studies/${studyId}/contents/write-plan`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ progressId, plan: plan }),
  });

export const requestWriteRetrospect = (
  accessToken: string,
  studyId: string,
  progressId: string,
  retrospect: RetrospectList,
) =>
  prevHttp.post(`${BASE_URL}/api/studies/${studyId}/contents/write-retrospect`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ progressId, retrospect: retrospect }),
  });

export const requestNextStep = (accessToken: string, studyId: string, progressId: string) =>
  prevHttp.post(`${BASE_URL}/api/studies/${studyId}/progresses/${progressId}/next-step`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestPostCreateStudy = async (
  studyName: string,
  totalCycle: TotalCycleOptions,
  timePerCycle: StudyTimePerCycleOptions,
) => {
  const response = await http.post<ResponseCreateStudy>(`/api/studies`, {
    body: JSON.stringify({ name: studyName, totalCycle, timePerCycle }),
  });

  const locationHeader = response.headers.get('Location');
  const studyId = locationHeader?.split('/').pop() as string;

  return { studyId, response };
};

export const requestGetAuthenticateParticipationCode = (participantCode: string) =>
  http.get<ResponseStudies>(`/api/studies?participantCode=${participantCode}`);

export const requestGetCheckProgresses = async (studyId: string, memberId: string) =>
  http.get<ResponseProgresses>(`/api/studies/${studyId}/progresses?memberId=${memberId}`);

export const requestPostRegisterProgress = (nickname: string, studyId: string, memberId: string) =>
  http.post(`/api/studies/${studyId}/progresses`, {
    body: JSON.stringify({ memberId, nickname }),
  });

export const requestDeleteProgress = (studyId: string, progressId: number) =>
  http.delete(`/api/studies/${studyId}/progresses/${progressId}`);
