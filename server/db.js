import mysql from 'mysql2/promise';

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL || undefined,
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
      port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT || 3306),
      user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
      database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'nourish_net_db'),
      waitForConnections: true,
      // FreeDB has a very small per-user connection cap; keep the demo pool conservative.
      // FreeDB's account-wide cap is lower than a serverless deployment's default.
      connectionLimit: 1,
      maxIdle: Number(process.env.DB_MAX_IDLE ?? 0),
      idleTimeout: Number(process.env.DB_IDLE_TIMEOUT || 60000),
      queueLimit: Number(process.env.DB_QUEUE_LIMIT || 0),
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      namedPlaceholders: true,
      decimalNumbers: true,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: process.env.DATABASE_SSL_VERIFY !== 'false' } : undefined,
    });
  }
  return pool;
}

export function db() {
  return getPool();
}

export async function withTransaction(work) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
