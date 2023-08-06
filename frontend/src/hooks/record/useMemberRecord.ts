/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

import { requestGetMemberRecordContents } from '@Apis/index';

import type { MemberRecordContent } from '@Types/study';

const useMemberRecord = (studyId: string, memberId: string, options?: { errorHandler: (error: Error) => void }) => {
  const [memberRecordContents, setMemberRecordContents] = useState<MemberRecordContent[] | null>(null);

  const isLoading = !memberRecordContents;

  const fetchData = useCallback(async () => {
    try {
      const { content } = await requestGetMemberRecordContents(studyId, memberId);

      setMemberRecordContents(content);
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      options?.errorHandler(error);
    }
  }, [memberId, studyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { memberRecordContents, isLoading };
};

export default useMemberRecord;
