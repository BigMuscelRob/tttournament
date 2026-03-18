'use server'

import { getMatches, updateMatch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function submitMatchScore(matchId: string, sets: {scoreA: number, scoreB: number}[]) {
  const matches = await getMatches();
  const match = matches.find(m => m.id === matchId);
  
  if (!match) return { error: 'Match nicht gefunden' };

  let winsA = 0;
  let winsB = 0;
  
  sets.forEach(s => {
    if (s.scoreA > s.scoreB) winsA++;
    else if (s.scoreB > s.scoreA) winsB++;
  });

  const bestOf = 3; 
  const neededToWin = Math.ceil(bestOf / 2); // 2 sets to win

  let winnerId = null;
  let status: 'planned' | 'active' | 'completed' = match.status;

  if (sets.length > 0) status = 'active';

  if (winsA >= neededToWin) {
    winnerId = match.playerAId;
    status = 'completed';
  } else if (winsB >= neededToWin) {
    winnerId = match.playerBId;
    status = 'completed';
  } else if (sets.length >= bestOf) {
    // Edge case if 3 sets played but no one reached target (should not happen in BO3 unless draws)
    status = 'completed'; 
    winnerId = winsA > winsB ? match.playerAId : match.playerBId;
  }

  await updateMatch(matchId, {
    sets,
    winnerId,
    status
  });

  revalidatePath('/');
  revalidatePath('/groups');
  revalidatePath('/bracket');
  revalidatePath('/scoreboard');
  revalidatePath(`/matches/${matchId}`);
  
  return { success: true, winnerId, status };
}
