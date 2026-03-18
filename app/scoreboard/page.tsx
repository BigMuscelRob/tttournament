import { getMatches, getPlayers } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import RefreshClient from './RefreshClient';

export const dynamic = 'force-dynamic';

export default async function ScoreboardPage() {
  const [matches, players] = await Promise.all([getMatches(), getPlayers()]);

  const activeMatches = matches.filter(m => m.status === 'active');
  const recentCompleted = matches.filter(m => m.status === 'completed').slice(-6);
  const nextMatches = matches.filter(m => m.status === 'planned').slice(0, 6);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', margin: '-2rem -1rem !important', padding: '2rem', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }} className="animate-fade-in">
      <style>{`
        .sidebar, .bottom-nav { display: none !important; }
        .main-content { padding: 0 !important; background: #0f172a !important; }
        .app-container { min-height: 0; display: block; }
      `}</style>
      
      <RefreshClient />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#34d399', letterSpacing: '-1px', margin: 0 }}>LIVE SCOREBOARD</h1>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#94a3b8' }}>Uni-TTC Turnier</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Active Matches */}
        <div style={{ gridColumn: 'span 2 / span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#cbd5e1', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
            Laufende Spiele
          </h2>
          
          {activeMatches.length === 0 ? (
             <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed #334155', borderRadius: '0.75rem', color: '#64748b', fontSize: '1.25rem' }}>
               Aktuell keine Spiele
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem' }}>
              {activeMatches.map(m => {
                const pA = players.find(p => p.id === m.playerAId);
                const pB = players.find(p => p.id === m.playerBId);
                return (
                  <Card key={m.id} style={{ backgroundColor: '#1e293b', border: '2px solid rgba(52, 211, 153, 0.3)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' }}>
                    <CardContent style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', fontWeight: 700 }}>
                        {m.stage === 'group' ? 'Gruppenphase' : 'KO-Phase'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '40%', textAlign: 'right', fontWeight: 700, fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 0.5rem' }}>{pA?.firstName} {pA?.lastName}</div>
                        <div style={{ width: '20%', textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#34d399', backgroundColor: '#0f172a', borderRadius: '0.5rem', padding: '0.25rem 0' }}>
                          {m.sets.filter(s => s.scoreA > s.scoreB).length} : {m.sets.filter(s => s.scoreB > s.scoreA).length}
                        </div>
                        <div style={{ width: '40%', textAlign: 'left', fontWeight: 700, fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 0.5rem' }}>{pB?.firstName} {pB?.lastName}</div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming & Recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '1.5rem' }}>Nächste Spiele</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {nextMatches.length === 0 && <div style={{ color: '#64748b' }}>Keine weiteren Spiele geplant</div>}
              {nextMatches.map(m => {
                const pA = players.find(p => p.id === m.playerAId);
                const pB = players.find(p => p.id === m.playerBId);
                return (
                  <div key={m.id} style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.125rem' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '40%', textAlign: 'right', fontWeight: 600 }}>{pA?.firstName} {pA?.lastName}</div>
                    <div style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.875rem', padding: '0 1rem' }}>vs</div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '40%', textAlign: 'left', fontWeight: 600 }}>{pB?.firstName} {pB?.lastName}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '1.5rem' }}>Letzte Ergebnisse</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentCompleted.length === 0 && <div style={{ color: '#64748b' }}>Noch keine Ergebnisse</div>}
              {recentCompleted.map(m => {
                const pA = players.find(p => p.id === m.playerAId);
                const pB = players.find(p => p.id === m.playerBId);
                const winA = m.winnerId === pA?.id;
                const winB = m.winnerId === pB?.id;
                
                return (
                  <div key={m.id} style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '40%', textAlign: 'right', color: winA ? '#34d399' : 'inherit', fontWeight: winA ? 'bold' : 'normal' }}>
                      {pA?.firstName} {pA?.lastName}
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#fff', padding: '0.25rem 0.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', fontSize: '0.875rem', margin: '0 1rem' }}>
                      {m.sets.filter(s => s.scoreA > s.scoreB).length} : {m.sets.filter(s => s.scoreB > s.scoreA).length}
                    </div>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '40%', textAlign: 'left', color: winB ? '#34d399' : 'inherit', fontWeight: winB ? 'bold' : 'normal' }}>
                      {pB?.firstName} {pB?.lastName}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
