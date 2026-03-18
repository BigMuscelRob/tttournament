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

// SETUP OVERRIDE
export async function ensureDb() {
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
  try {
    const { rows } = await sql`SELECT * FROM players ORDER BY "createdAt" DESC`;
    return rows as Player[];
  } catch (e) {
    return []; // fallback if DB is not initialized
  }
}

export async function addPlayer(player: Omit<Player, 'createdAt'>) {
  try {
    await sql`
      INSERT INTO players (id, "firstName", "lastName", nickname, email, matriculation, "bringsBat", "skillLevel")
      VALUES (${player.id}, ${player.firstName}, ${player.lastName}, ${player.nickname}, ${player.email}, ${player.matriculation}, ${player.bringsBat}, ${player.skillLevel})
    `;
  } catch (e) {
    if ((e as Error).message.includes('relation "players" does not exist')) {
      await ensureDb();
      await addPlayer(player);
    }
  }
}

export async function deleteAllPlayers() {
  try { await sql`DELETE FROM players`; } catch(e) {}
}

// GROUPS
export async function getGroups(): Promise<Group[]> {
  try {
    const { rows } = await sql`SELECT * FROM groups ORDER BY name ASC`;
    return rows.map(r => ({ ...r, playerIds: JSON.parse(r.playerIds) })) as Group[];
  } catch(e) { return []; }
}

export async function saveGroups(groups: Omit<Group, 'createdAt'>[]) {
  try {
    await sql`DELETE FROM groups`;
    for (const g of groups) {
      await sql`INSERT INTO groups (id, name, "playerIds") VALUES (${g.id}, ${g.name}, ${JSON.stringify(g.playerIds)})`;
    }
  } catch(e) {}
}

export async function deleteAllGroups() {
  try { await sql`DELETE FROM groups`; } catch(e) {}
}

// MATCHES
export async function getMatches(): Promise<Match[]> {
  try {
    const { rows } = await sql`SELECT * FROM matches ORDER BY "createdAt" ASC`;
    return rows.map(r => ({ ...r, sets: JSON.parse(r.sets) })) as Match[];
  } catch(e) { return []; }
}

export async function saveMatches(matches: Omit<Match, 'createdAt'>[]) {
  try {
    await sql`DELETE FROM matches`;
    for (const m of matches) {
      await sql`
        INSERT INTO matches (id, "groupId", stage, "playerAId", "playerBId", sets, "winnerId", status)
        VALUES (${m.id}, ${m.groupId}, ${m.stage}, ${m.playerAId}, ${m.playerBId}, ${JSON.stringify(m.sets)}, ${m.winnerId}, ${m.status})
      `;
    }
  } catch(e) {}
}

export async function addMatch(m: Omit<Match, 'createdAt'>) {
  try {
    await sql`
      INSERT INTO matches (id, "groupId", stage, "playerAId", "playerBId", sets, "winnerId", status)
      VALUES (${m.id}, ${m.groupId}, ${m.stage}, ${m.playerAId}, ${m.playerBId}, ${JSON.stringify(m.sets)}, ${m.winnerId}, ${m.status})
    `;
  } catch(e) {}
}

export async function updateMatch(id: string, data: Partial<Omit<Match, 'createdAt' | 'id'>>) {
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
  } catch(e) {}
}

export async function deleteAllMatches() {
  try { await sql`DELETE FROM matches`; } catch(e) {}
}
