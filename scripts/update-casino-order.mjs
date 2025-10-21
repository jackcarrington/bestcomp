#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

// Casino data from JSON with correct order and ribbonText
const casinosData = [
  {
    id: 9,
    casinoName: 'Play OJO',
    ribbonText: 'No Wagering',
    sortOrder: 0,
  },
  {
    id: 14,
    casinoName: 'All British Casino',
    ribbonText: 'No Max Cash out',
    sortOrder: 1,
  },
  {
    id: 15,
    casinoName: 'Dream Vegas Casino',
    ribbonText: 'Most Popular',
    sortOrder: 2,
  },
  {
    id: 16,
    casinoName: 'Quinnbet Casino',
    ribbonText: 'SPORTSBOOK',
    sortOrder: 3,
  },
  {
    id: 13,
    casinoName: 'Pub Casino',
    ribbonText: 'No Max Cash out',
    sortOrder: 4,
  },
  {
    id: 10,
    casinoName: 'Playzee Casino',
    ribbonText: 'Best Slots',
    sortOrder: 5,
  },
  {
    id: 8,
    casinoName: 'Knight Slots',
    ribbonText: 'FREE SPINS',
    sortOrder: 6,
  },
  {
    id: 11,
    casinoName: 'SpinYoo Casino',
    ribbonText: 'Fast Withdrawals',
    sortOrder: 7,
  },
  {
    id: 12,
    casinoName: 'Mr Play',
    ribbonText: 'FREE SPINS',
    sortOrder: 8,
  },
];

async function updateCasinoOrder() {
  try {
    console.log('🎰 Updating casino sortOrder and ribbonText...');

    // Initialize Neon client
    const sql = neon(process.env.DATABASE_URL);

    // Update each casino
    for (const casino of casinosData) {
      console.log(`Updating ${casino.casinoName}: sortOrder=${casino.sortOrder}, ribbonText="${casino.ribbonText}"`);

      await sql`
        UPDATE casinos 
        SET "sortOrder" = ${casino.sortOrder}, 
            "ribbonText" = ${casino.ribbonText}
        WHERE id = ${casino.id}
      `;
    }

    console.log('✅ All casinos updated successfully!');

    // Verify the update
    const updatedCasinos = await sql`
      SELECT id, "casinoName", "sortOrder", "ribbonText" 
      FROM casinos 
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC
    `;

    console.log('\n📊 Updated casino order:');
    updatedCasinos.forEach((casino, index) => {
      console.log(
        `${index + 1}. ${casino.casinoName} (sortOrder: ${casino.sortOrder}, ribbon: "${casino.ribbonText}")`
      );
    });
  } catch (error) {
    console.error('❌ Error updating casino order:', error);
    process.exit(1);
  }
}

// Run the update
updateCasinoOrder();
