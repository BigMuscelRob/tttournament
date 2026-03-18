'use server'

import { addPlayer, deleteAllPlayers, deleteAllGroups, deleteAllMatches } from '@/lib/api';
import { revalidatePath } from 'next/cache';

const demoFirstNames = ['Lukas', 'Leon', 'Finn', 'Paul', 'Jonas', 'Elias', 'Felix', 'Julian', 'Maximilian', 'Tim', 'Mia', 'Emma', 'Hannah', 'Sophia', 'Anna', 'Emilia', 'Lina', 'Marie', 'Lena', 'Mila'];
const demoLastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder'];
const levels = ['beginner', 'intermediate', 'advanced'] as const;

function randomElement<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function seedDemoPlayers() {
  await deleteAllPlayers();
  await deleteAllGroups();
  await deleteAllMatches();

  const count = 16;
  for (let i = 0; i < count; i++) {
    const fn = randomElement(demoFirstNames);
    const ln = randomElement(demoLastNames);
    const skill = randomElement(levels);

    await addPlayer({
      id: crypto.randomUUID(),
      firstName: fn,
      lastName: ln,
      nickname: Math.random() > 0.5 ? `${fn.substring(0, 3)}x` : null,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@stud.uni.de`,
      matriculation: Math.floor(1000000 + Math.random() * 9000000).toString(),
      skillLevel: skill as any,
      bringsBat: Math.random() > 0.5 ? 1 : 0
    });
  }

  revalidatePath('/');
  revalidatePath('/players');
  revalidatePath('/admin');
  return { success: true, message: `${count} Demo-Spieler generiert!` };
}
