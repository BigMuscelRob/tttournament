import { getMatches, getPlayers } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default async function BracketPage() {
  const [matches, players] = await Promise.all([getMatches(), getPlayers()]);

  const koMatches = matches.filter(m => m.stage !== 'group');

  if (koMatches.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center mt-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-primary">Turnierbaum</h1>
        <Card>
          <CardContent className="p-8">
            <p className="text-muted mb-4">Die KO-Phase hat noch nicht begonnen.</p>
            <p className="text-sm">Der Admin kann die KO-Phase starten, sobald die Gruppenspiele beendet sind.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStage = (stageName: string, title: string) => {
    const stageMatches = koMatches.filter(m => m.stage === stageName);
    if (stageMatches.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-primary">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stageMatches.map(m => {
            const pA = players.find(p => p.id === m.playerAId);
            const pB = players.find(p => p.id === m.playerBId);
            
            return (
              <Card key={m.id} style={{ borderColor: m.status === 'active' ? 'var(--primary)' : 'var(--border-color)', borderWidth: m.status === 'active' ? '2px' : '1px' }}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-muted">
                      {m.status === 'completed' ? 'Beendet' : m.status === 'active' ? 'Aktiv' : 'Geplant'}
                    </span>
                    <Link href={`/matches/${m.id}`} className="text-primary text-sm hover:underline">Match-Details &rarr;</Link>
                  </div>
                  
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid', borderColor: m.winnerId === pA?.id ? '#10b981' : 'var(--border-color)', backgroundColor: m.winnerId === pA?.id ? '#ecfdf5' : 'transparent', fontWeight: m.winnerId === pA?.id ? 'bold' : 'normal', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pA?.firstName} {pA?.lastName}</span>
                    {m.winnerId === pA?.id && <span>👑</span>}
                  </div>
                  
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid', borderColor: m.winnerId === pB?.id ? '#10b981' : 'var(--border-color)', backgroundColor: m.winnerId === pB?.id ? '#ecfdf5' : 'transparent', fontWeight: m.winnerId === pB?.id ? 'bold' : 'normal', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pB?.firstName} {pB?.lastName}</span>
                    {m.winnerId === pB?.id && <span>👑</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Turnierbaum</h1>
      
      {renderStage('quarter', 'Viertelfinale')}
      {renderStage('semi', 'Halbfinale')}
      {renderStage('final', 'Finale')}
    </div>
  );
}
