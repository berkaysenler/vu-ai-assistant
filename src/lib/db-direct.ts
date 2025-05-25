import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function createUser(data: {
  email: string;
  fullName: string;
  password: string;
  verified: boolean;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (id, email, "fullName", password, verified, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [data.email, data.fullName, data.password, data.verified]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function findUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function createVerificationToken(data: {
  email: string;
  token: string;
  type: string;
  expiresAt: Date;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO verification_tokens (id, email, token, type, "expiresAt", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW()) RETURNING *',
      [data.email, data.token, data.type, data.expiresAt]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}
