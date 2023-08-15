import { rest } from 'msw';

export const createStudyHandlers = [
  rest.post('/api/v2/studies', (req, res, ctx) => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjkxNTY4NDI4LCJleHAiOjE2OTE1NzIwMjh9.BfGH7jBxO_iixmlpzxHKV7d9ekJPegLxrpY9ME066ro';

    const requestAuthToken = req.headers.get('Authorization')?.split(' ')[1];

    const newAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxMjM0NTY3fQ.NUiutjXo0mcIBU5fWxfjpBEvPxakFiBaUCg4THKAYpQ';

    if (requestAuthToken === newAccessToken)
      return res(
        ctx.status(201),
        ctx.set({ 'Content-Type': 'application/json', Location: '/api/v2/studies/1' }),
        ctx.json({
          participantCode: '123456',
        }),
        ctx.delay(1000),
      );

    if (accessToken !== requestAuthToken) return res(ctx.status(401), ctx.delay(1000));

    return res(
      ctx.status(201),
      ctx.set({ 'Content-Type': 'application/json', Location: '/api/v2/studies/1' }),
      ctx.json({
        participantCode: '123456',
      }),
      ctx.delay(1000),
    );
  }),
];
