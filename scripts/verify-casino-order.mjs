#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyCasinoOrder() {
  try {
    console.log('🎰 Verifying current casino order in database...');

    // Initialize Neon client
    const sql = neon(process.env.DATABASE_URL);

    // Get all active casinos in the order they should appear
    const casinos = await sql`
      SELECT id, "casinoName", "sortOrder", "ribbonText", "isActive"
      FROM casinos 
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, id ASC
    `;

    console.log('\n📊 Current casino order in database:');
    casinos.forEach((casino, index) => {
      console.log(
        `${index + 1}. ${casino.casinoName} (sortOrder: ${casino.sortOrder}, ribbon: "${casino.ribbonText}")`
      );
    });

    console.log(`\n✅ Total active casinos: ${casinos.length}`);
  } catch (error) {
    console.error('❌ Error verifying casino order:', error);
    process.exit(1);
  }
}

// Run the verification
verifyCasinoOrder();
