import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function RulesPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary">Regelwerk</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Casual Uni-TTC Regeln 🏓</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>Dieses Turnier steht im Zeichen von Spaß und Fairplay. Die wichtigsten Regeln im Überblick:</p>
          
          <ul className="pl-6" style={{ listStyleType: 'disc', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Spielmodus:</strong> Gespielt wird im <em>Best-of-3</em> (wer zuerst 2 Sätze gewinnt, hat das Match gewonnen).</li>
            <li><strong>Satzgewinn:</strong> Ein Satz geht bis 11 Punkte.</li>
            <li><strong>Verlängerung:</strong> Ein Satz muss mit 2 Punkten Abstand gewonnen werden (z. B. 12:10, 15:13).</li>
            <li><strong>Aufschlag:</strong> Nach jeweils 2 Punkten wechselt das Aufschlagsrecht. Ab dem Spielstand von 10:10 wechselt der Aufschlag nach <em>jedem</em> Punkt.</li>
            <li><strong>Seitenwechsel:</strong> Nach jedem Satz werden die Tischseiten gewechselt. In einem entscheidenden 3. Satz wird die Seite gewechselt, sobald ein Spieler 5 Punkte erreicht hat.</li>
            <li><strong>Netzroller:</strong> Ein Netzroller beim Aufschlag führt zur Wiederholung. Im laufenden Ballwechsel zählt ein Netzroller ganz normal weiter.</li>
          </ul>
          
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Wichtige Hinweise & Fair Play</h4>
            <p className="text-sm">Bitte seid pünktlich an den Tischtennisplatten. Wer mehr als 5 Minuten zu spät kommt, dessen Match kann als verloren gewertet werden. Bei Unklarheiten entscheiden wir gemeinsam fair, im Zweifelsfall hat die Turnierleitung das letzte Wort. Schiedsrichter stellen wir nur bei Bedarf.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
