'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Player } from '@/lib/api';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function PlayerListClient({ initialPlayers }: { initialPlayers: Player[] }) {
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  const filtered = initialPlayers.filter(p => {
    const term = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      (p.nickname && p.nickname.toLowerCase().includes(term))
    );
  });

  const getSkillBadge = (skill: string) => {
    switch(skill) {
      case 'beginner': return <Badge variant="default">Anfänger</Badge>;
      case 'intermediate': return <Badge variant="warning">Fortgeschritten</Badge>;
      case 'advanced': return <Badge variant="error">Profi</Badge>;
      default: return null;
    }
  };

  return (
    <div>
      {registered && (
        <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid #bbf7d0', marginBottom: '1.5rem' }}>
          Erfolgreich registriert! Du stehst jetzt auf der Teilnehmerliste.
        </div>
      )}

      <div className="mb-6 relative max-w-md" style={{ position: 'relative' }}>
        <Input 
          placeholder="Spieler suchen..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute text-muted" style={{ position: 'absolute', right: '0.75rem', top: '0.6rem' }} size={20} />
      </div>

      <div className="flex justify-between items-end mb-4">
        <p className="text-muted text-sm">{filtered.length} Spieler {search ? 'gefunden' : 'registriert'}</p>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted">
            Keine Spieler gefunden.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(player => (
            <Card key={player.id} style={{ transition: 'box-shadow 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title" style={{ fontSize: '1.125rem' }}>
                    {player.firstName} {player.lastName}
                  </h3>
                  {player.bringsBat === 1 && <span title="Bringt eigenen Schläger" style={{ fontSize: '1.25rem' }}>🏓</span>}
                </div>
                {player.nickname && <p className="text-muted text-sm mb-3">"{player.nickname}"</p>}
                
                <div className="mt-4 flex justify-between items-center">
                  {getSkillBadge(player.skillLevel)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
