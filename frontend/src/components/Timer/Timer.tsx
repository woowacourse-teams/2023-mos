import { styled } from 'styled-components';

import Typography from '../common/Typography/Typography';
import useTimer from '../../hooks/useTimer';
import color from '../../styles/color';
import Button from '../common/Button/Button';

type Props = {
  minutes: number;
};

const Timer = ({ minutes }: Props) => {
  const { start, stop, getFormattedTime, isTicking } = useTimer(minutes);

  const formattedTime = getFormattedTime();

  return (
    <Layout>
      <Typography variant="p1" fontSize="3.6rem" color={color.white}>
        제한 시간
      </Typography>
      <Typography variant="h1" fontSize="12.8rem" color={color.white}>
        {formattedTime}
      </Typography>
      {isTicking ? (
        <Button variant="outlined" size="small" onClick={stop}>
          <Typography variant="h5" color={color.blue[500]}>
            정지
          </Typography>
        </Button>
      ) : (
        <Button variant="outlined" size="small" onClick={start}>
          <Typography variant="h5" color={color.blue[500]}>
            시작
          </Typography>
        </Button>
      )}
    </Layout>
  );
};

export default Timer;

const Layout = styled.div`
  width: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;

  // 임시로 넣은 background -> 지울 예정
  background-color: ${color.blue[500]};
`;
