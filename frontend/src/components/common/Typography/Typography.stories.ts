import type { Meta, StoryObj } from '@storybook/react';
import Typography from './Typography';

type Story = StoryObj<typeof Typography>;

/**
 * `Typography` 컴포넌트는 특정 이벤트 실행, 라우팅을 위한 컴포넌트입니다.
 */
const meta: Meta<typeof Typography> = {
  title: 'INPUTS/Typography',
  component: Typography,
};

export default meta;

/**
 * `DefaultButton`는 메인 색상을 가지는 `Typography` 스토리입니다.
 */
export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading1',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading2',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading3',
  },
};
export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'Heading4',
  },
};
export const Heading5: Story = {
  args: {
    variant: 'h5',
    children: 'Heading5',
  },
};

export const Heading6: Story = {
  args: {
    variant: 'h6',
    children: 'Heading6',
  },
};

export const Body1: Story = {
  args: {
    variant: 'p1',
    children: 'Body1',
  },
};

export const Body2: Story = {
  args: {
    variant: 'p2',
    children: 'Body2',
  },
};
