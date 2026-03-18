'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Match, Player } from '@/lib/api';
import { submitMatchScore } from '@/app/actions/matches';
import { Trophy } from 'lucide-react';

export default function MatchScoreClient({ match, playerA, playerB }: { match: Match, playerA: Player, playerB: Player }) {
  const [sets, setSets] = useState<{scoreA: number, scoreB: number}[]>(
    match.sets.length > 0 ? match.sets : [{scoreA: 0, scoreB: 0}]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScoreChange = (index: number, player: 'A' | 'B', value: string) => {
    const num = parseInt(value);
    const newSets = [...sets];
    if (player === 'A') newSets[index].scoreA = isNaN(num) ? 0 : num;
    else newSets[index].scoreB = isNaN(num) ? 0 : num;
    setSets(newSets);
  };

  const addSet = () => {
    if (sets.length >= 5) return;
    setSets([...sets, {scoreA: 0, scoreB: 0}]);
  };

  const removeSet = (index: number) => {
    if (sets.length <= 1) return;
    setSets(sets.filter((_, i) => i !== index));
  };

  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitMatchScore(match.id, sets);
      if (res.error) setError(res.error);
    } catch(err) {
      setError('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="flex justify-center items-center gap-2 mb-2">
          {match.status === 'completed' ? <Badge variant="success">Beendet</Badge> : <Badge variant="warning">Aktiv</Badge>}
        </div>
        <div className="grid grid-cols-3 items-center mt-4">
          <div className="text-right">
            <h2 className={`text-2xl font-bold ${match.winnerId === playerA.id ? 'text-primary' : ''}`}>
              {playerA.firstName} {playerA.lastName}
            </h2>
            {match.winnerId === playerA.id && <Trophy className="inline text-amber-500 mt-2" size={24}/>}
          </div>
          <div className="text-xl font-mono text-muted">VS</div>
          <div className="text-left">
            <h2 className={`text-2xl font-bold ${match.winnerId === playerB.id ? 'text-primary' : ''}`}>
              {playerB.firstName} {playerB.lastName}
            </h2>
            {match.winnerId === playerB.id && <Trophy className="inline text-amber-500 mt-2" size={24}/>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {error && <div className="p-3 mb-4 bg-red-100 text-red-800 rounded">{error}</div>}

        <div className="flex flex-col gap-4">
          {sets.map((set, index) => (
            <div key={index} className="flex items-center justify-center gap-4">
              <span className="text-sm font-bold text-muted w-16 text-right">Satz {index + 1}</span>
              <input
                type="number" min="0" max="99"
                value={set.scoreA === 0 && set.scoreB === 0 ? '' : set.scoreA}
                onChange={(e) => handleScoreChange(index, 'A', e.target.value)}
                style={{ width: '80px', textAlign: 'center', fontSize: '1.25rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-card)' }}
              />
              <span className="text-muted font-bold">:</span>
              <input
                type="number" min="0" max="99"
                value={set.scoreA === 0 && set.scoreB === 0 ? '' : set.scoreB}
                onChange={(e) => handleScoreChange(index, 'B', e.target.value)}
                style={{ width: '80px', textAlign: 'center', fontSize: '1.25rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-card)' }}
              />
              {sets.length > 1 && (
                <button onClick={() => removeSet(index)} style={{ color: 'var(--danger)', fontWeight: 'bold', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Satz entfernen">&times;</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 gap-4">
          {sets.length < 5 && match.status !== 'completed' && (
            <Button variant="ghost" onClick={addSet}>+ Neuer Satz</Button>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <Button size="lg" fullWidth onClick={onSave} disabled={loading}>
            {loading ? 'Speichere...' : 'Ergebnis speichern'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
