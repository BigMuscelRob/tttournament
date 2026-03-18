'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { seedDemoPlayers } from '@/app/actions/seed';
import { generateGroupsAction, resetTournamentAction } from '@/app/actions/admin';
import { generateBracketAction } from '@/app/actions/bracket';
import { DatabaseBackup, Trash2, Users, Trophy } from 'lucide-react';

export default function AdminControlsClient({ playersCount, groupsCount }: { playersCount: number, groupsCount: number }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleAction = async (actionId: string, actionFn: () => Promise<any>) => {
    setLoading(actionId);
    setMessage(null);
    try {
      const result = await actionFn();
      if (result?.error) {
        setMessage({ text: result.error, type: 'error' });
      } else if (result?.success) {
        setMessage({ text: result.message, type: 'success' });
      }
    } catch (e) {
      setMessage({ text: 'Ein Fehler ist aufgetreten.', type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Steuerung</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {message && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', 
             backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
             color: message.type === 'success' ? '#166534' : '#991b1b',
             border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
            {message.text}
          </div>
        )}

        {playersCount === 0 && (
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => handleAction('seed', () => seedDemoPlayers())}
            disabled={loading !== null}
          >
            <DatabaseBackup size={18} /> Demodaten generieren (16 Spieler)
          </Button>
        )}

        {playersCount >= 4 && groupsCount === 0 && (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => handleAction('groups', () => generateGroupsAction(4))}
            disabled={loading !== null}
          >
            <Users size={18} /> Gruppenphase auslosen
          </Button>
        )}

        {groupsCount > 0 && playersCount >= 4 && (
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={() => handleAction('bracket', generateBracketAction)}
            disabled={loading !== null}
          >
            <Trophy size={18} /> KO-Phase generieren
          </Button>
        )}

        {groupsCount > 0 && (
          <Button 
            variant="danger" 
            fullWidth 
            onClick={() => {
              if(confirm('Achtung: Alle Gruppenergebnisse und Matches werden unwiderruflich gelöscht!')) {
                handleAction('reset', resetTournamentAction);
              }
            }}
            disabled={loading !== null}
          >
            <Trash2 size={18} /> Turnier zurücksetzen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
