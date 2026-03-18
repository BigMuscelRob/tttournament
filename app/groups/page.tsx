import { getGroups, getPlayers, getMatches } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default async function GroupsPage() {
  const [groups, allPlayers, allMatches] = await Promise.all([getGroups(), getPlayers(), getMatches()]);

  if (groups.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center mt-12 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Gruppenphase</h1>
        <Card>
          <CardContent className="p-8">
            <p className="text-muted mb-4">Es wurden noch keine Gruppen generiert.</p>
            <Link href="/admin" className="text-primary hover:underline font-medium">Zum Admin-Bereich</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Gruppenphase</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        {groups.map(group => {
          const groupMatches = allMatches.filter(m => m.groupId === group.id);
          const players = allPlayers.filter(p => group.playerIds.includes(p.id));

          // Calculate stats
          const stats = players.map(p => {
            const mPlayed = groupMatches.filter(m => m.status === 'completed' && (m.playerAId === p.id || m.playerBId === p.id));
            let wins = 0;
            let losses = 0;
            let setsWon = 0;
            let setsLost = 0;

            mPlayed.forEach(m => {
              const isA = m.playerAId === p.id;
              if (m.winnerId === p.id) wins++;
              else losses++;

              m.sets.forEach(s => {
                if (isA) {
                  if (s.scoreA > s.scoreB) setsWon++; else setsLost++;
                } else {
                  if (s.scoreB > s.scoreA) setsWon++; else setsLost++;
                }
              });
            });

            return {
              player: p,
              matches: mPlayed.length,
              wins,
              losses,
              setsWon,
              setsLost,
              setDiff: setsWon - setsLost,
              points: wins // 1 point per win
            };
          });

          stats.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.setDiff !== a.setDiff) return b.setDiff - a.setDiff;
            return b.setsWon - a.setsWon;
          });

          return (
            <Card key={group.id}>
              <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
                <CardTitle>{group.name}</CardTitle>
                <div className="text-sm text-muted">{groupMatches.length} Spiele</div>
              </CardHeader>
              <CardContent style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', fontWeight: 600 }}>#</th>
                        <th style={{ padding: '0.75rem', fontWeight: 600 }}>Spieler</th>
                        <th style={{ padding: '0.75rem', fontWeight: 600, textAlign: 'center' }}>Sp</th>
                        <th style={{ padding: '0.75rem', fontWeight: 600, textAlign: 'center' }}>S:N</th>
                        <th style={{ padding: '0.75rem', fontWeight: 600, textAlign: 'center' }}>Sätze</th>
                        <th style={{ padding: '0.75rem', fontWeight: 600, textAlign: 'center' }}>Pkt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s, idx) => (
                        <tr key={s.player.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem' }}>
                            {idx < 2 ? <Badge variant="success">{idx + 1}</Badge> : <span className="text-muted" style={{ fontFamily: 'monospace' }}>{idx + 1}</span>}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                            {s.player.firstName} {s.player.lastName}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>{s.matches}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>{s.wins}:{s.losses}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>{s.setsWon}:{s.setsLost}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>{s.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Matches in dieser Gruppe
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {groupMatches.map(m => {
                      const pA = allPlayers.find(p => p.id === m.playerAId);
                      const pB = allPlayers.find(p => p.id === m.playerBId);
                      if(!pA || !pB) return null;
                      
                      return (
                        <Link key={m.id} href={`/matches/${m.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderRadius: 'var(--radius)', textDecoration: 'none', border: '1px solid transparent', transition: 'all 0.2s', backgroundColor: 'var(--bg-card)' }}
                              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                              onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                          <div style={{ flex: 1, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem', fontWeight: m.winnerId === pA.id ? 'bold' : 'normal' }}>
                            {pA.firstName} {pA.lastName}
                          </div>
                          
                          <div style={{ padding: '0 0.75rem', textAlign: 'center', minWidth: '80px', flexShrink: 0 }}>
                            {m.status === 'completed' ? (
                              <Badge variant="default" style={{ width: '100%', justifyContent: 'center' }}>
                                {m.sets.filter(s => s.scoreA > s.scoreB).length} : {m.sets.filter(s => s.scoreB > s.scoreA).length}
                              </Badge>
                            ) : m.status === 'active' ? (
                              <Badge variant="warning">Aktiv</Badge>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', border: '1px solid var(--border-color)', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>vs</span>
                            )}
                          </div>
                          
                          <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem', fontWeight: m.winnerId === pB.id ? 'bold' : 'normal' }}>
                            {pB.firstName} {pB.lastName}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
