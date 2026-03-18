import { Card, CardContent } from '@/components/ui/Card';
import { getPlayers, getGroups, getMatches } from '@/lib/api';
import { Users, LayoutDashboard, CheckCircle, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const [players, groups, matches] = await Promise.all([getPlayers(), getGroups(), getMatches()]);

  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const activeMatches = matches.filter(m => m.status === 'active').length;
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Turnier Dashboard</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Users style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }} size={32} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{players.length}</p>
            <p className="text-muted text-sm mt-1">Registrierte Spieler</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <LayoutDashboard style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} size={32} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{groups.length}</p>
            <p className="text-muted text-sm mt-1">Gruppen</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <CheckCircle style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} size={32} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{completedMatches}</p>
            <p className="text-muted text-sm mt-1">Beendete Spiele</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Clock style={{ color: 'var(--danger)', marginBottom: '0.5rem' }} size={32} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{activeMatches}</p>
            <p className="text-muted text-sm mt-1">Laufende Spiele</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="card-header">
            <h3 className="card-title">Aktueller Status</h3>
          </div>
          <div className="card-content">
            <p className="text-muted mb-4">Das Turnier befindet sich aktuell in Vorbereitung bzw. Anmeldung.</p>
            {players.length < 12 && (
              <p className="text-sm border border-amber-200 bg-amber-50 text-amber-800 p-3 rounded-md">
                Es werden noch mehr Spieler benötigt, um sinnvolle Gruppen zu generieren.
              </p>
            )}
            {players.length >= 12 && groups.length === 0 && (
              <p className="text-sm border border-blue-200 bg-blue-50 text-blue-800 p-3 rounded-md">
                Genug Spieler sind registriert. Die Gruppenphase kann im Admin-Bereich ausgelost werden.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
