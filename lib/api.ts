import { sql } from '@vercel/postgres';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  email: string | null;
  matriculation: string | null;
  bringsBat: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  playerIds: string[];
  createdAt: string;
}

export interface MatchSet {
  scoreA: number;
  scoreB: number;
}

export interface Match {
  id: string;
  groupId: string | null;
  stage: 'group' | 'quarter' | 'semi' | 'final' | 'third';
  playerAId: string;
  playerBId: string;
  sets: MatchSet[];
  winnerId: string | null;
  status: 'planned' | 'active' | 'completed';
  createdAt: string;
}

const isDbReady = () => !!process.env.POSTGRES_URL;
const ERROR_NOT_CONFIGURED = 'Datenbank (Vercel Postgres) ist nicht konfiguriert! Bitte verknüpfe das Projekt und lade die Environment Variablen herunter (vercel env pull .env.local).';

// SETUP OVERRIDE
export async function ensureDb() {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  console.log('Verifying and Creating Database Tables...');
  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id VARCHAR(255) PRIMARY KEY,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255) NOT NULL,
      nickname VARCHAR(255),
      email VARCHAR(255),
      matriculation VARCHAR(255),
      "bringsBat" INTEGER DEFAULT 0,
      "skillLevel" VARCHAR(50) NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS groups (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      "playerIds" TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS matches (
      id VARCHAR(255) PRIMARY KEY,
      "groupId" VARCHAR(255),
      stage VARCHAR(50) NOT NULL,
      "playerAId" VARCHAR(255) NOT NULL,
      "playerBId" VARCHAR(255) NOT NULL,
      sets TEXT NOT NULL,
      "winnerId" VARCHAR(255),
      status VARCHAR(50) NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// PLAYERS
export async function getPlayers(): Promise<Player[]> {
  if (!isDbReady()) return [];
  try {
    const { rows } = await sql`SELECT * FROM players ORDER BY "createdAt" DESC`;
    return rows as Player[];
  } catch (e: any) {
    if (e.message?.includes('relation "players" does not exist')) return [];
    console.warn('getPlayers fallback:', e.message);
    return []; 
  }
}

export async function addPlayer(player: Omit<Player, 'createdAt'>) {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try {
    await sql`
      INSERT INTO players (id, "firstName", "lastName", nickname, email, matriculation, "bringsBat", "skillLevel")
      VALUES (${player.id}, ${player.firstName}, ${player.lastName}, ${player.nickname}, ${player.email}, ${player.matriculation}, ${player.bringsBat}, ${player.skillLevel})
    `;
  } catch (e: any) {
    if (e.message?.includes('relation "players" does not exist')) {
      await ensureDb();
      await sql`
        INSERT INTO players (id, "firstName", "lastName", nickname, email, matriculation, "bringsBat", "skillLevel")
        VALUES (${player.id}, ${player.firstName}, ${player.lastName}, ${player.nickname}, ${player.email}, ${player.matriculation}, ${player.bringsBat}, ${player.skillLevel})
      `;
    } else {
      throw e;
    }
  }
}

export async function deleteAllPlayers() {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try { await sql`DELETE FROM players`; } 
  catch(e: any) { 
    if (!e.message?.includes('relation')) throw e; 
  }
}

// GROUPS
export async function getGroups(): Promise<Group[]> {
  if (!isDbReady()) return [];
  try {
    const { rows } = await sql`SELECT * FROM groups ORDER BY name ASC`;
    return rows.map(r => ({ ...r, playerIds: JSON.parse(r.playerIds) })) as Group[];
  } catch(e: any) { 
    return []; 
  }
}

export async function saveGroups(groups: Omit<Group, 'createdAt'>[]) {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try {
    await sql`DELETE FROM groups`;
    for (const g of groups) {
      await sql`INSERT INTO groups (id, name, "playerIds") VALUES (${g.id}, ${g.name}, ${JSON.stringify(g.playerIds)})`;
    }
  } catch(e) {
    throw e;
  }
}

export async function deleteAllGroups() {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try { await sql`DELETE FROM groups`; } 
  catch(e: any) { 
    if (!e.message?.includes('relation')) throw e;  
  }
}

// MATCHES
export async function getMatches(): Promise<Match[]> {
  if (!isDbReady()) return [];
  try {
    const { rows } = await sql`SELECT * FROM matches ORDER BY "createdAt" ASC`;
    return rows.map(r => ({ ...r, sets: JSON.parse(r.sets) })) as Match[];
  } catch(e: any) { 
    return []; 
  }
}

export async function saveMatches(matches: Omit<Match, 'createdAt'>[]) {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try {
    await sql`DELETE FROM matches`;
    for (const m of matches) {
      await sql`
        INSERT INTO matches (id, "groupId", stage, "playerAId", "playerBId", sets, "winnerId", status)
        VALUES (${m.id}, ${m.groupId}, ${m.stage}, ${m.playerAId}, ${m.playerBId}, ${JSON.stringify(m.sets)}, ${m.winnerId}, ${m.status})
      `;
    }
  } catch(e) {
    throw e;
  }
}

export async function addMatch(m: Omit<Match, 'createdAt'>) {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try {
    await sql`
      INSERT INTO matches (id, "groupId", stage, "playerAId", "playerBId", sets, "winnerId", status)
      VALUES (${m.id}, ${m.groupId}, ${m.stage}, ${m.playerAId}, ${m.playerBId}, ${JSON.stringify(m.sets)}, ${m.winnerId}, ${m.status})
    `;
  } catch(e) {
    throw e;
  }
}

export async function updateMatch(id: string, data: Partial<Omit<Match, 'createdAt' | 'id'>>) {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try {
    if (data.sets !== undefined) {
      await sql`UPDATE matches SET sets = ${JSON.stringify(data.sets)} WHERE id = ${id}`;
    }
    if (data.winnerId !== undefined || data.winnerId === null) {
      await sql`UPDATE matches SET "winnerId" = ${data.winnerId} WHERE id = ${id}`;
    }
    if (data.status !== undefined) {
      await sql`UPDATE matches SET status = ${data.status} WHERE id = ${id}`;
    }
  } catch(e) {
    throw e;
  }
}

export async function deleteAllMatches() {
  if (!isDbReady()) throw new Error(ERROR_NOT_CONFIGURED);
  try { await sql`DELETE FROM matches`; } 
  catch(e: any) { 
    if (!e.message?.includes('relation')) throw e; 
  }
}
