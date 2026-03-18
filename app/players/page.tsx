import { getPlayers } from '@/lib/api';
import PlayerListClient from './PlayerListClient';
import { Suspense } from 'react';

export default async function PlayersPage() {
  const players = await getPlayers();
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Teilnehmerliste</h1>
      </div>
      <Suspense fallback={<div className="text-slate-500">Lade Teilnehmer...</div>}>
        <PlayerListClient initialPlayers={players} />
      </Suspense>
    </div>
  );
}
