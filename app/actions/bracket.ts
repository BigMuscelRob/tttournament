'use server'

import { getGroups, getMatches, saveMatches, Match } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function generateBracketAction() {
  const [groups, allMatches] = await Promise.all([getGroups(), getMatches()]);

  if (groups.length === 0) return { error: 'Keine Gruppen vorhanden.' };

  const activeGroupMatches = allMatches.filter(m => m.stage === 'group' && m.status !== 'completed');
  if (activeGroupMatches.length > 0) {
    return { error: 'Noch nicht alle Gruppenspiele sind beendet.' };
  }

  const existingKO = allMatches.filter(m => m.stage !== 'group');
  if (existingKO.length > 0) {
    return { error: 'KO-Phase wurde bereits generiert.' };
  }

  const qualifiers: string[] = []; 

  for (const group of groups) {
    const groupMatches = allMatches.filter(m => m.groupId === group.id);
    const players = group.playerIds;
    
    const stats = players.map(pId => {
      let wins = 0;
      let setDiff = 0;
      groupMatches.forEach(m => {
        if (m.winnerId === pId) wins++;
        if (m.status === 'completed') {
          const isA = m.playerAId === pId;
          let sWon = 0, sLost = 0;
          m.sets.forEach(s => {
            if (isA) {
              if (s.scoreA > s.scoreB) sWon++; else sLost++;
            } else {
              if (s.scoreB > s.scoreA) sWon++; else sLost++;
            }
          });
          setDiff += (sWon - sLost);
        }
      });
      return { id: pId, points: wins, setDiff };
    });

    stats.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.setDiff - a.setDiff;
    });

    if (stats[0]) qualifiers.push(stats[0].id);
    if (stats[1]) qualifiers.push(stats[1].id);
  }

  let power = 2;
  while (power < qualifiers.length) power *= 2;
  
  if (qualifiers.length !== power) {
    let target = power / 2;
    if (target < 2) target = 2;
    qualifiers.splice(target);
  }

  if (qualifiers.length < 2) {
    return { error: 'Nicht genug Spieler für ein KO-System qualifiziert.' };
  }

  const matchesPayload: Omit<Match, 'id' | 'createdAt'>[] = [];
  const startStage = qualifiers.length === 8 ? 'quarter' : (qualifiers.length === 4 ? 'semi' : 'final');

  for (let i = 0; i < qualifiers.length / 2; i++) {
    matchesPayload.push({
      groupId: null,
      stage: startStage as any,
      playerAId: qualifiers[i],
      playerBId: qualifiers[qualifiers.length - 1 - i],
      sets: [],
      winnerId: null,
      status: 'planned'
    });
  }

  const finalMatches = matchesPayload.map(m => ({...m, id: crypto.randomUUID()}));
  
  await saveMatches([...allMatches, ...finalMatches]);
  
  revalidatePath('/');
  revalidatePath('/bracket');
  revalidatePath('/admin');
  
  return { success: true, message: 'KO-Phase erfolgreich generiert!' };
}
