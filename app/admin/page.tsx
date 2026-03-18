import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getPlayers, getGroups, getMatches } from '@/lib/api';
import AdminControlsClient from './AdminControlsClient';

export default async function AdminPage() {
  const [players, groups, matches] = await Promise.all([getPlayers(), getGroups(), getMatches()]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin-Bereich</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Turnier-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mb-4" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span className="text-muted">Spieler Registriert</span>
                <span className="font-bold">{players.length}</span>
              </li>
              <li className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span className="text-muted">Aktive Gruppen</span>
                <span className="font-bold">{groups.length}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Spiele (Gesamt)</span>
                <span className="font-bold">{matches.length}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <AdminControlsClient 
          playersCount={players.length} 
          groupsCount={groups.length} 
        />
      </div>
    </div>
  );
}
