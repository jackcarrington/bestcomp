#!/usr/bin/env node

/**
 * Seed Script for Content Sections
 * Creates database entries for dynamic ContentSection component content
 */

import { neon } from '@netlify/neon';
import { neon as regularNeon } from '@neondatabase/serverless';

// Sample content sections data
const contentSectionsData = [
  {
    sectionKey: 'homepage_rating_section',
    sectionTitle: 'How we rate online casinos',
    sectionSubtitle: null,
    contentItems: [
      {
        itemKey: 'security_licensing',
        itemTitle: 'Security & Licensing',
        itemDescription:
          'We verify that all casinos hold valid UK gambling licenses and use advanced SSL encryption to protect your data.',
        itemIcon: '🛡️',
        backgroundColor: 'bg-[var(--casino-purple)]/20',
        displayOrder: 1,
      },
      {
        itemKey: 'game_selection',
        itemTitle: 'Game Selection',
        itemDescription:
          'Our experts evaluate the variety and quality of slots, table games, and live dealer options from top providers.',
        itemIcon: '🎮',
        backgroundColor: 'bg-[var(--casino-pink)]/20',
        displayOrder: 2,
      },
      {
        itemKey: 'bonuses_promotions',
        itemTitle: 'Bonuses & Promotions',
        itemDescription:
          'We analyse welcome bonuses, ongoing promotions, and loyalty programmes to find the best value for players.',
        itemIcon: '💰',
        backgroundColor: 'bg-[var(--casino-gold)]/20',
        displayOrder: 3,
      },
      {
        itemKey: 'payout_speed',
        itemTitle: 'Payout Speed',
        itemDescription:
          'We test withdrawal times and banking options to ensure fast and reliable payouts when you win.',
        itemIcon: '⚡',
        backgroundColor: 'bg-green-500/20',
        displayOrder: 4,
      },
    ],
    trustIndicators: [
      {
        indicatorKey: 'years_experience',
        indicatorText: '15+ Years Experience',
        backgroundColor: 'bg-[var(--casino-purple)]/20',
        displayOrder: 1,
      },
      {
        indicatorKey: 'reviewed_casinos',
        indicatorText: '1000+ Reviewed Casinos',
        backgroundColor: 'bg-[var(--casino-pink)]/20',
        displayOrder: 2,
      },
      {
        indicatorKey: 'independent_testing',
        indicatorText: 'Independent Testing',
        backgroundColor: 'bg-[var(--casino-gold)]/20',
        displayOrder: 3,
      },
    ],
  },
  {
    sectionKey: 'mobile_rating_section',
    sectionTitle: 'How we rate mobile casinos',
    sectionSubtitle: 'Specialized criteria for mobile casino evaluation',
    contentItems: [
      {
        itemKey: 'mobile_optimized_interface',
        itemTitle: 'Mobile-Optimized Interface',
        itemDescription:
          'We test touch responsiveness, loading speeds, and navigation ease across iOS and Android devices.',
        itemIcon: '📱',
        backgroundColor: 'bg-blue-500/20',
        displayOrder: 1,
      },
      {
        itemKey: 'app_quality',
        itemTitle: 'Native App Quality',
        itemDescription:
          'Our experts review casino apps for stability, features, and user experience compared to browser versions.',
        itemIcon: '📲',
        backgroundColor: 'bg-purple-500/20',
        displayOrder: 2,
      },
      {
        itemKey: 'mobile_payment_options',
        itemTitle: 'Mobile Payment Options',
        itemDescription:
          'We evaluate mobile-specific payment methods like Apple Pay, Google Pay, and mobile banking integration.',
        itemIcon: '💳',
        backgroundColor: 'bg-green-500/20',
        displayOrder: 3,
      },
      {
        itemKey: 'mobile_game_selection',
        itemTitle: 'Mobile Game Compatibility',
        itemDescription:
          'We test game performance, graphics quality, and touch controls across different mobile devices.',
        itemIcon: '🎰',
        backgroundColor: 'bg-orange-500/20',
        displayOrder: 4,
      },
    ],
    trustIndicators: [
      {
        indicatorKey: 'mobile_devices_tested',
        indicatorText: '50+ Mobile Devices Tested',
        backgroundColor: 'bg-blue-500/20',
        displayOrder: 1,
      },
      {
        indicatorKey: 'mobile_apps_reviewed',
        indicatorText: '200+ Mobile Apps Reviewed',
        backgroundColor: 'bg-purple-500/20',
        displayOrder: 2,
      },
      {
        indicatorKey: 'real_device_testing',
        indicatorText: 'Real Device Testing',
        backgroundColor: 'bg-green-500/20',
        displayOrder: 3,
      },
    ],
  },
];

async function seedContentSections() {
  try {
    console.log('🌱 Starting content sections seeding...');

    // Get appropriate database client
    let sql;
    if (process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
      console.log('Using Netlify Neon integration');
      sql = neon();
    } else if (process.env.DATABASE_URL) {
      console.log('Using regular Neon connection');
      sql = regularNeon(process.env.DATABASE_URL);
    } else {
      throw new Error('No database configuration found. Please set NETLIFY_DATABASE_URL or DATABASE_URL');
    }

    // Default user ID for created_by field
    const defaultUserId = 1;

    let totalSections = 0;
    let totalItems = 0;
    let totalIndicators = 0;

    for (const sectionData of contentSectionsData) {
      console.log(`\n📝 Processing section: ${sectionData.sectionKey}`);

      // Check if section already exists
      const existingSections = await sql`
        SELECT id FROM content_sections
        WHERE section_key = ${sectionData.sectionKey}
      `;

      let sectionId;

      if (existingSections.length > 0) {
        sectionId = existingSections[0].id;
        console.log(`   ✅ Section already exists with ID: ${sectionId}`);

        // Update existing section
        await sql`
          UPDATE content_sections
          SET
            section_title = ${sectionData.sectionTitle},
            section_subtitle = ${sectionData.sectionSubtitle},
            updated_at = NOW()
          WHERE id = ${sectionId}
        `;
        console.log('   🔄 Updated existing section');
      } else {
        // Create new section
        const newSections = await sql`
          INSERT INTO content_sections (section_key, section_title, section_subtitle, created_by)
          VALUES (${sectionData.sectionKey}, ${sectionData.sectionTitle}, ${sectionData.sectionSubtitle}, ${defaultUserId})
          RETURNING id
        `;
        sectionId = newSections[0].id;
        totalSections++;
        console.log(`   ✨ Created new section with ID: ${sectionId}`);
      }

      // Clear existing content items and trust indicators for this section
      await sql`DELETE FROM content_items WHERE section_id = ${sectionId}`;
      await sql`DELETE FROM trust_indicators WHERE section_id = ${sectionId}`;

      // Insert content items
      for (const item of sectionData.contentItems) {
        await sql`
          INSERT INTO content_items (
            section_id, item_key, item_title, item_description,
            item_icon, background_color, display_order
          )
          VALUES (
            ${sectionId}, ${item.itemKey}, ${item.itemTitle}, ${item.itemDescription},
            ${item.itemIcon}, ${item.backgroundColor}, ${item.displayOrder}
          )
        `;
        totalItems++;
      }
      console.log(`   📋 Added ${sectionData.contentItems.length} content items`);

      // Insert trust indicators
      for (const indicator of sectionData.trustIndicators) {
        await sql`
          INSERT INTO trust_indicators (
            section_id, indicator_key, indicator_text,
            background_color, display_order
          )
          VALUES (
            ${sectionId}, ${indicator.indicatorKey}, ${indicator.indicatorText},
            ${indicator.backgroundColor}, ${indicator.displayOrder}
          )
        `;
        totalIndicators++;
      }
      console.log(`   🏆 Added ${sectionData.trustIndicators.length} trust indicators`);
    }

    console.log('\n🎉 Content sections seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Sections processed: ${contentSectionsData.length}`);
    console.log(`   - New sections created: ${totalSections}`);
    console.log(`   - Total content items: ${totalItems}`);
    console.log(`   - Total trust indicators: ${totalIndicators}`);

    console.log('\n💡 Usage examples:');
    console.log('   - Homepage: <ContentSection />');
    console.log('   - Mobile page: <ContentSection sectionKey="mobile_rating_section" />');
  } catch (error) {
    console.error('❌ Error seeding content sections:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedContentSections();
}
