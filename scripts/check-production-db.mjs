#!/usr/bin/env node

import { neon } from '@netlify/neon';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkProductionDatabase() {
  try {
    console.log('🎰 Checking production database (Netlify Neon)...');

    // Use Netlify Neon integration (same as production)
    if (!process.env.NETLIFY_DATABASE_URL) {
      console.log('❌ NETLIFY_DATABASE_URL not found. Are you running this from Netlify environment?');
      console.log(
        'Available env vars:',
        Object.keys(process.env).filter(key => key.includes('DATABASE'))
      );
      return;
    }

    const sql = neon(); // Netlify Neon integration

    // Check the exact query from API route
    const casinos = await sql`
      SELECT * FROM casinos 
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, id ASC
    `;

    console.log('\n📊 Production database results (exact same query as API):');
    casinos.forEach((casino, index) => {
      console.log(`${index + 1}. ID:${casino.id} ${casino.casinoName} (sortOrder: ${casino.sortOrder})`);
    });

    // Specifically check PlayOJO
    const playOJO = casinos.find(c => c.casinoName.includes('OJO'));
    console.log(`\n🔍 PlayOJO details:`, {
      id: playOJO?.id,
      name: playOJO?.casinoName,
      sortOrder: playOJO?.sortOrder,
      isActive: playOJO?.isActive,
    });
  } catch (error) {
    console.error('❌ Error checking production database:', error);

    // Fallback to local database
    console.log('\n🔄 Falling back to local database...');
    try {
      const { neon: regularNeon } = await import('@neondatabase/serverless');
      const sql = regularNeon(process.env.DATABASE_URL);
      const casinos = await sql`
        SELECT * FROM casinos 
        WHERE "isActive" = true
        ORDER BY "sortOrder" ASC, id ASC
      `;

      console.log('\n📊 Local database results:');
      casinos.forEach((casino, index) => {
        console.log(`${index + 1}. ID:${casino.id} ${casino.casinoName} (sortOrder: ${casino.sortOrder})`);
      });
    } catch (localError) {
      console.error('❌ Local database also failed:', localError);
    }
  }
}

// Run the check
checkProductionDatabase();
