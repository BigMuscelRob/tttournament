'use server'

import { getPlayers, saveGroups, saveMatches, deleteAllGroups, deleteAllMatches, Group } from '@/lib/api';
import { revalidatePath } from 'next/cache';

function shuffle<T>(array: T[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export async function generateGroupsAction(groupSize: number = 4) {
  const players = await getPlayers();
  if (players.length < 4) return { error: 'Zu wenige Spieler für eine Gruppenphase.' };

  await deleteAllGroups();
  await deleteAllMatches();

  const advanced = shuffle(players.filter(p => p.skillLevel === 'advanced'));
  const intermediate = shuffle(players.filter(p => p.skillLevel === 'intermediate'));
  const beginner = shuffle(players.filter(p => p.skillLevel === 'beginner'));

  const sortedPlayers = [...advanced, ...intermediate, ...beginner];
  const groupCount = Math.ceil(players.length / groupSize);
  
  const groups: Group[] = Array.from({ length: groupCount }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Gruppe ${String.fromCharCode(65 + i)}`,
    playerIds: [] as string[],
    createdAt: new Date().toISOString()
  }));

  let direction = 1;
  let gIndex = 0;
  for (const p of sortedPlayers) {
    groups[gIndex].playerIds.push(p.id);
    gIndex += direction;
    if (gIndex >= groupCount) {
      gIndex = groupCount - 1;
      direction = -1;
    } else if (gIndex < 0) {
      gIndex = 0;
      direction = 1;
    }
  }

  await saveGroups(groups);
  
  const matches = [];
  for (const group of groups) {
    const pIds = group.playerIds;
    for (let i = 0; i < pIds.length; i++) {
      for (let j = i + 1; j < pIds.length; j++) {
        matches.push({
          id: crypto.randomUUID(),
          groupId: group.id,
          stage: 'group' as const,
          playerAId: pIds[i],
          playerBId: pIds[j],
          sets: [],
          winnerId: null,
          status: 'planned' as const
        });
      }
    }
  }
  
  await saveMatches(matches);
  revalidatePath('/');
  revalidatePath('/groups');
  revalidatePath('/admin');
  return { success: true, message: `${groups.length} Gruppen erfolgreich generiert.` };
}

export async function resetTournamentAction() {
  await deleteAllGroups();
  await deleteAllMatches();
  revalidatePath('/');
  revalidatePath('/groups');
  revalidatePath('/bracket');
  revalidatePath('/admin');
  return { success: true, message: 'Turnierdaten erfolgreich zurückgesetzt.' };
}
