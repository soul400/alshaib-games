import { Pool } from 'pg';
import { AnyQuestion, PlayerScore } from '@aep/types';

// Connection details for local PostgreSQL (pgAdmin 4) - Database: gameshow
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:A86a7616513@localhost:5432/gameshow';

export const dbPool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

/**
 * Initializes Database Schema in PostgreSQL (gameshow DB)
 */
export async function initializeGameshowDB(): Promise<boolean> {
  try {
    const client = await dbPool.connect();
    
    // Create Questions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(100) PRIMARY KEY,
        engine_type VARCHAR(50) NOT NULL,
        title TEXT NOT NULL,
        category VARCHAR(100),
        difficulty VARCHAR(20),
        points INT DEFAULT 100,
        time_limit_seconds INT DEFAULT 30,
        acceptable_answers JSONB NOT NULL,
        options JSONB,
        image_url TEXT,
        video_url TEXT,
        audio_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Leaderboard Scores Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_scores (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        score INT DEFAULT 0,
        correct_answers_count INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
    console.log('✅ PostgreSQL (gameshow DB) connected and initialized successfully!');
    return true;
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection fallback (using local memory store):', err);
    return false;
  }
}

/**
 * Fetch Questions from PostgreSQL gameshow DB
 */
export async function getQuestionsFromDB(engineType?: string): Promise<AnyQuestion[]> {
  try {
    const client = await dbPool.connect();
    let query = 'SELECT * FROM questions';
    const params: any[] = [];

    if (engineType) {
      query += ' WHERE engine_type = $1';
      params.push(engineType);
    }

    const res = await client.query(query, params);
    client.release();

    return res.rows.map(row => ({
      id: row.id,
      engineType: row.engine_type,
      title: row.title,
      category: row.category,
      difficulty: row.difficulty,
      points: row.points,
      timeLimitSeconds: row.time_limit_seconds,
      acceptableAnswers: typeof row.acceptable_answers === 'string' ? JSON.parse(row.acceptable_answers) : row.acceptable_answers,
      options: row.options ? (typeof row.options === 'string' ? JSON.parse(row.options) : row.options) : undefined,
      imageUrl: row.image_url,
      videoUrl: row.video_url,
      audioUrl: row.audio_url
    } as any));
  } catch (e) {
    return [];
  }
}

/**
 * Save Player Score to PostgreSQL gameshow DB
 */
export async function savePlayerScoreToDB(player: PlayerScore): Promise<boolean> {
  try {
    const client = await dbPool.connect();
    await client.query(`
      INSERT INTO player_scores (id, username, display_name, avatar_url, score, correct_answers_count, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        score = EXCLUDED.score,
        correct_answers_count = EXCLUDED.correct_answers_count,
        updated_at = CURRENT_TIMESTAMP;
    `, [player.id, player.username, player.displayName, player.avatarUrl, player.score, player.correctAnswersCount]);
    client.release();
    return true;
  } catch (e) {
    return false;
  }
}
