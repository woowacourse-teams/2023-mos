import { useRef } from 'react';
import { styled } from 'styled-components';

import useCalendar from '@Hooks/common/useCalendar';

import color from '@Styles/color';

import CalendarDayOfWeeks from '../CalendarDayOfWeeks/CalendarDayOfWeeks';
import MemberRecordCalendarControlBar from '../MemberRecordCalendarControlBar/MemberRecordCalendarControlBar';
import MemberRecordCalendarDays from '../MemberRecordCalendarDays/MemberRecordCalendarDays';

type Props = {
  memberId: string;
};

const MemberRecordCalendar = ({ memberId }: Props) => {
  const calendarRef = useRef<HTMLUListElement>(null);

  const { year, month, navigationYear, monthStorage, handleMonthShift, handleNavigationMonth, handleNavigationYear } =
    useCalendar();

  return (
    <Layout>
      <MemberRecordCalendarControlBar
        year={year}
        month={month}
        navigationYear={navigationYear}
        handleMonthShift={handleMonthShift}
        handleNavigationYear={handleNavigationYear}
        handleNavigationMonth={handleNavigationMonth}
      />
      <Calendar>
        <CalendarDayOfWeeks />
        <CalendarWrapper $numberOfWeeks={monthStorage.length / 7} ref={calendarRef}>
          <MemberRecordCalendarDays monthStorage={monthStorage} memberId={memberId} calendarRef={calendarRef} />
        </CalendarWrapper>
      </Calendar>
    </Layout>
  );
};

export default MemberRecordCalendar;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  user-select: none;
`;

const Calendar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

type DaysProps = {
  $numberOfWeeks: number;
};

const CalendarWrapper = styled.ul<DaysProps>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: ${({ $numberOfWeeks }) => `repeat(${$numberOfWeeks}, minmax(135px, auto))`};
  gap: 1px;
  border: 1px solid ${color.neutral[200]};

  background-color: ${color.neutral[200]};

  @media screen and (max-width: 510px) {
    font-size: 1.4rem;
    grid-template-rows: ${({ $numberOfWeeks }) => `repeat(${$numberOfWeeks}, minmax(80px, auto))`};
  }
`;
