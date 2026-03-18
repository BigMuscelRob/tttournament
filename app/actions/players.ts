'use server'

import { addPlayer } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function registerPlayer(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const nickname = (formData.get('nickname') as string) || null;
  const email = (formData.get('email') as string) || null;
  const matriculation = (formData.get('matriculation') as string) || null;
  const skillLevel = formData.get('skillLevel') as 'beginner' | 'intermediate' | 'advanced';
  const bringsBat = formData.get('bringsBat') === 'on' ? 1 : 0;

  if (!firstName || !lastName || !skillLevel) {
    return { error: 'Bitte fülle alle Pflichtfelder aus.' };
  }

  const id = crypto.randomUUID();

  await addPlayer({
    id,
    firstName,
    lastName,
    nickname,
    email,
    matriculation,
    skillLevel,
    bringsBat
  });

  revalidatePath('/');
  revalidatePath('/players');
  revalidatePath('/admin');
  
  redirect('/players?registered=true');
}
