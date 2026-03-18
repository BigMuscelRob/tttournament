import { getMatches, getPlayers } from '@/lib/api';
import { notFound } from 'next/navigation';
import MatchScoreClient from './MatchScoreClient';
import Link from 'next/link';

export default async function MatchPage({ params }: { params: { id: string } }) {
  const [matches, players] = await Promise.all([getMatches(), getPlayers()]);
  const match = matches.find(m => m.id === params.id);
  
  if (!match) return notFound();

  const playerA = players.find(p => p.id === match.playerAId);
  const playerB = players.find(p => p.id === match.playerBId);

  if (!playerA || !playerB) return notFound();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/groups" className="text-primary hover:underline font-semibold">&larr; Zurück zur Übersicht</Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-primary">Match-Ergebnis</h1>
      
      <MatchScoreClient match={match} playerA={playerA} playerB={playerB} />
    </div>
  );
}
