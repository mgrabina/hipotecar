// pages/api/credits/popular.ts
import { sql } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next/types'

const getPopularCredits = async () => {
  const result = await sql`
    SELECT credit_id
    FROM (
      SELECT jsonb_array_elements(compatiblecredits) ->> 'Id' AS credit_id
      FROM users
      WHERE compatiblecredits IS NOT NULL
    ) AS all_credits
    GROUP BY credit_id
    ORDER BY COUNT(*) DESC
    LIMIT 5;
  `

  return result.rows.map(row => row.credit_id)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const popularCreditIds = await getPopularCredits()
      if (popularCreditIds.length > 0) {
        res.status(200).json({ popularCreditIds })
      } else {
        res.status(404).json({ error: 'No credits found' })
      }
    } catch (error: any) {
      console.error('Error fetching popular credits:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
