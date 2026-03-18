'use client'
import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerPlayer } from '@/app/actions/players';
import { ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await registerPlayer(fd);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Teilnehmer-Registrierung</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Melde dich für das Turnier an!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Vorname *" name="firstName" required placeholder="z. B. Max" />
              <Input label="Nachname *" name="lastName" required placeholder="z. B. Mustermann" />
            </div>
            
            <Input label="Spitzname / Anzeige-Name (Optional)" name="nickname" placeholder="Wie sollen wir dich auf dem Scoreboard nennen?" />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="E-Mail (Optional)" type="email" name="email" placeholder="Für Benachrichtigungen" />
              <Input label="Matrikelnummer (Optional)" name="matriculation" placeholder="Zur Kurszuordnung" />
            </div>

            <div className="mt-2 mb-2">
              <label className="form-label">Erfahrungslevel *</label>
              <select name="skillLevel" required style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '1rem', marginTop: '0.5rem' }}>
                <option value="">Bitte wählen...</option>
                <option value="beginner">Anfänger (Spiele nur gelegentlich)</option>
                <option value="intermediate">Fortgeschritten (Regelmäßige Praxis)</option>
                <option value="advanced">Sehr erfahren (Vereinsniveau oder ähnlich)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="bringsBat" name="bringsBat" style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="bringsBat" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ich bringe einen eigenen Tischtennisschläger mit</label>
            </div>

            <div style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid #bee3f8', margin: '1rem 0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldCheck className="shrink-0 mt-0.5" size={20} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Deine Daten werden nur für die Dauer dieses Turniers lokal gespeichert und nach Abschluss gelöscht.</p>
            </div>

            <Button type="submit" size="lg" fullWidth disabled={isPending}>
              {isPending ? 'Wird angemeldet...' : 'Jetzt anmelden'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
