// pages/api/users.ts
import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import { UserData } from "@/configs/DataProvider"
import { Credit } from 'src/configs/constants'

export type SubmitUserBody = {
  data: UserData
}

const createUsersTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS "users" (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      loanamount NUMERIC,
      salary NUMERIC,
      duration INTEGER,
      banks TEXT,
      provinces TEXT,
      creditType VARCHAR(255),
      compatibleCredits JSONB
    );
  `
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body: SubmitUserBody = req.body

    if (!body) {
      return res.status(400).json({ error: 'No body provided' })
    }
    if (!body.data) {
      return res.status(400).json({ error: 'No data provided' })
    }
    if (!body.data.email) {
      return res.status(400).json({ error: 'No email provided' })
    }

    const data = body.data

    const insertUser = async () => {
      return await sql`
        INSERT INTO "users" (email, name, loanamount, salary, duration, banks, provinces, creditType) VALUES (
          ${data.email},
          ${data.name},
          ${data.loanAmount},
          ${data.salary},
          ${data.duration},
          ${data.banks?.toString()},
          ${data.provinces?.toString()},
          ${data.creditType}
        )
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          loanamount = EXCLUDED.loanamount,
          salary = EXCLUDED.salary,
          duration = EXCLUDED.duration,
          banks = EXCLUDED.banks,
          provinces = EXCLUDED.provinces,
          creditType = EXCLUDED.creditType,
          compatibleCredits = EXCLUDED.compatibleCredits
        RETURNING *;
      `
    }

    try {
      const result = await insertUser()
      res.status(200).json({ user: data.email, result })
    } catch (error: any) {
      // Check if the error is related to the table not existing
      if (error.message.includes('relation "users" does not exist')) {
        try {
          // Create the table
          await createUsersTable()

          // Retry the insertion
          const result = await insertUser()
          res.status(200).json({ user: data.email, result })
        } catch (retryError) {
          console.error('Error after retry:', retryError)
          res.status(500).json({ error: 'Internal Server Error' })
        }
      } else {
        console.error('Error saving user:', error)
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
