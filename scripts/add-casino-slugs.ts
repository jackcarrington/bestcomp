/**
 * Database migration script to add clean URL slugs to existing casinos
 * This will generate /go/[slug] URLs for clean first-party redirects
 */

import { neon } from '@netlify/neon';
import { neon as regularNeon } from '@neondatabase/serverless';
import { getCasinoSlug } from '../src/lib/url-shortener.ts';

// Get database client (production vs development)
function getDatabaseClient() {
  if (process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
    return neon(); // Netlify integration
  } else if (process.env.DATABASE_URL) {
    return regularNeon(process.env.DATABASE_URL); // Local development
  }
  throw new Error('No database connection available');
}

async function addCasinoSlugs() {
  console.log('🚀 Adding clean URL slugs to casino database...');

  let sql;
  try {
    sql = getDatabaseClient();
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    process.exit(1);
  }

  try {
    // Note: Neon doesn't support complex transactions with loops
    // Running operations individually
    // First, add the slug column if it doesn't exist
    console.log('📊 Adding slug column to casinos table...');
    await sql`
        ALTER TABLE casinos
        ADD COLUMN IF NOT EXISTS slug TEXT
    `;

    // Get all casinos that need slugs
    const casinos = await sql`
        SELECT id, "casinoName", slug
        FROM casinos
        WHERE "isActive" = true
    `;

    console.log(`📋 Found ${casinos.length} casinos to process`);

    // Update each casino with a clean slug
    for (const casino of casinos) {
      if (!casino.slug) {
        const cleanSlug = getCasinoSlug(casino.casinoName);

        await sql`
            UPDATE casinos
            SET slug = ${cleanSlug}
            WHERE id = ${casino.id}
        `;

        console.log(`✅ Updated ${casino.casinoName} → /go/${cleanSlug}`);
      } else {
        console.log(`⏭️  ${casino.casinoName} already has slug: /go/${casino.slug}`);
      }
    }

    // Verify results
    const updatedCasinos = await sql`
        SELECT "casinoName", slug, "actionButtonLink"
        FROM casinos
        WHERE "isActive" = true
        ORDER BY "sortOrder", id
    `;

    console.log('\n🎯 Clean URL Mapping:');
    console.log('='.repeat(60));
    updatedCasinos.forEach((casino, index) => {
      const cleanUrl = `/go/${casino.slug}`;
      const affiliateUrl = casino.actionButtonLink || 'No URL';
      console.log(`${index + 1}. ${casino.casinoName}`);
      console.log(`   Clean URL: https://findcasinosites.co.uk${cleanUrl}`);
      console.log(`   Redirects to: ${affiliateUrl}`);
      console.log('');
    });

    console.log('✅ Casino slug migration completed successfully!');

    console.log('\n💡 Next steps:');
    console.log('1. Update components to use /go/ URLs');
    console.log('2. Add rel="sponsored nofollow" attributes');
    console.log('3. Test redirect functionality');
  } catch (error) {
    console.error('❌ Migration failed:', (error as Error).message);
    process.exit(1);
  }
}

// Run the migration
addCasinoSlugs().catch(console.error);
