#!/usr/bin/env node

// This script is designed to run in Netlify environment with NETLIFY_DATABASE_URL
import { neon } from '@netlify/neon';

// Casino data with correct order and ribbonText
const casinosData = [
  {
    casinoName: 'Play OJO',
    ribbonText: 'No Wagering',
    sortOrder: 0,
  },
  {
    casinoName: 'All British Casino',
    ribbonText: 'No Max Cash out',
    sortOrder: 1,
  },
  {
    casinoName: 'Dream Vegas Casino',
    ribbonText: 'Most Popular',
    sortOrder: 2,
  },
  {
    casinoName: 'Quinnbet Casino',
    ribbonText: 'SPORTSBOOK',
    sortOrder: 3,
  },
  {
    casinoName: 'Pub Casino',
    ribbonText: 'No Max Cash out',
    sortOrder: 4,
  },
  {
    casinoName: 'Playzee Casino',
    ribbonText: 'Best Slots',
    sortOrder: 5,
  },
  {
    casinoName: 'Knight Slots',
    ribbonText: 'FREE SPINS',
    sortOrder: 6,
  },
  {
    casinoName: 'SpinYoo Casino',
    ribbonText: 'Fast Withdrawals',
    sortOrder: 7,
  },
  {
    casinoName: 'Mr Play',
    ribbonText: 'FREE SPINS',
    sortOrder: 8,
  },
];

async function updateProductionCasinoOrder() {
  try {
    console.log('🎰 Updating production casino sortOrder and ribbonText...');

    // Use Netlify Neon integration (available in production)
    if (!process.env.NETLIFY_DATABASE_URL && !process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
      console.log('❌ This script must run in Netlify environment with NETLIFY_DATABASE_URL');
      process.exit(1);
    }

    const sql = neon(); // Netlify Neon integration

    // Update each casino by name (more reliable than ID)
    for (const casino of casinosData) {
      console.log(`Updating ${casino.casinoName}: sortOrder=${casino.sortOrder}, ribbonText="${casino.ribbonText}"`);

      const result = await sql`
        UPDATE casinos 
        SET "sortOrder" = ${casino.sortOrder}, 
            "ribbonText" = ${casino.ribbonText}
        WHERE "casinoName" ILIKE ${casino.casinoName}
      `;

      console.log(`  - Updated ${result.count || 0} rows`);
    }

    console.log('✅ Production casino order updated successfully!');

    // Verify the update
    const updatedCasinos = await sql`
      SELECT id, "casinoName", "sortOrder", "ribbonText" 
      FROM casinos 
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, id ASC
    `;

    console.log('\n📊 Updated production casino order:');
    updatedCasinos.forEach((casino, index) => {
      console.log(
        `${index + 1}. ${casino.casinoName} (sortOrder: ${casino.sortOrder}, ribbon: "${casino.ribbonText}")`
      );
    });
  } catch (error) {
    console.error('❌ Error updating production casino order:', error);
    process.exit(1);
  }
}

// Run the update
updateProductionCasinoOrder();
