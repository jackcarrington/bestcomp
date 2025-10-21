#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

// Simple displayOrder mapping using integers 1-9 (no falsy values!)
const casinoOrder = [
  { casinoName: 'PlayOJO', displayOrder: 1 },
  { casinoName: 'All British Casino', displayOrder: 2 },
  { casinoName: 'Dream Vegas Casino', displayOrder: 3 },
  { casinoName: 'Quinn Casino', displayOrder: 4 },
  { casinoName: 'Pub Casino', displayOrder: 5 },
  { casinoName: 'PlayZee', displayOrder: 6 },
  { casinoName: 'Knight Slots', displayOrder: 7 },
  { casinoName: 'SpinYoo', displayOrder: 8 },
  { casinoName: 'Mr Play', displayOrder: 9 },
];

async function fixCasinoOrder() {
  try {
    console.log('🎰 Fixing casino order with simple displayOrder system...');

    const sql = neon(process.env.DATABASE_URL);

    // First, add the displayOrder column if it doesn't exist
    console.log('Adding displayOrder column...');
    try {
      await sql`
        ALTER TABLE casinos 
        ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER DEFAULT 999
      `;
      console.log('✅ displayOrder column added/verified');
    } catch {
      console.log('Column might already exist, continuing...');
    }

    // Update each casino with simple 1-9 ordering
    for (const casino of casinoOrder) {
      console.log(`Setting ${casino.casinoName} = displayOrder ${casino.displayOrder}`);

      const result = await sql`
        UPDATE casinos 
        SET "displayOrder" = ${casino.displayOrder}
        WHERE "casinoName" ILIKE ${casino.casinoName}
      `;

      console.log(`  ✅ Updated ${result.count || 0} rows`);
    }

    console.log('\n📊 Verifying new order:');
    const casinos = await sql`
      SELECT "casinoName", "displayOrder" 
      FROM casinos 
      WHERE "isActive" = true
      ORDER BY "displayOrder" ASC
    `;

    casinos.forEach(casino => {
      console.log(`${casino.displayOrder}. ${casino.casinoName}`);
    });

    console.log('\n✅ Casino order fixed with displayOrder system!');
  } catch (error) {
    console.error('❌ Error fixing casino order:', error);
    process.exit(1);
  }
}

// Run the fix
fixCasinoOrder();
