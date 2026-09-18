'use client';

import React from 'react';
import { WinnerAnnouncement } from '@aep/types';
import { WinnerSpotlight } from './WinnerSpotlight';

interface Props {
  winner: WinnerAnnouncement;
  onClose: () => void;
}

export function WinnerAnnouncementModal({ winner, onClose }: Props) {
  const { player, questionTitle, correctAnswer, pointsEarned } = winner;

  return (
    <WinnerSpotlight
      winner={{
        displayName: player.displayName,
        username: player.username,
        avatarUrl: player.avatarUrl || '',
        points: pointsEarned
      }}
      title={`إجابة صحيحة: ${correctAnswer}`}
      gameTitle="AL-SHAIB ENTERTAINMENT"
      subtitle={questionTitle ? `السؤال: ${questionTitle}` : 'FIRST CORRECT ANSWER IN CHAT'}
      onClose={onClose}
      autoCloseSeconds={10}
      variant="ROUND_WINNER"
    />
  );
}
