import crypto from "crypto";
import pool from "../db/postgres";
import { log } from "../utils/logger";

export async function addNewUser(input: {
  LinnworksUniqueIdentifier: string;
  Email: string;
  AccountName: string;
}): Promise<string> {
  const { LinnworksUniqueIdentifier, Email, AccountName } = input;

  if (!LinnworksUniqueIdentifier || !Email || !AccountName) {
    throw new Error("Invalid AddNewUser request");
  }

  const query = `
    WITH new_account AS (
      INSERT INTO accounts (linnworks_unique_identifier, email, account_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (linnworks_unique_identifier) DO UPDATE
      SET email = EXCLUDED.email
      RETURNING id
    )
    INSERT INTO auth_tokens (account_id, token)
    SELECT id, $4 FROM new_account
    RETURNING token;
  `;

  const token = crypto.randomBytes(16).toString("hex");

  try {
    const result = await pool.query(query, [
      LinnworksUniqueIdentifier,
      Email,
      AccountName,
      token,
    ]);

    log("INFO", "New user registered", { accountId: result.rows[0].id });
    return token;
  } catch (err) {
    log("ERROR", "AddNewUser failed", err);
    throw err;
  }
}


export async function getAccountByToken(token: string) {
  const result = await pool.query(
    `
    SELECT a.id
    FROM auth_tokens t
    JOIN accounts a ON a.id = t.account_id
    WHERE t.token = $1 AND t.revoked = false
    `,
    [token]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid or revoked authorization token");
  }

  return result.rows[0].id as string;
}