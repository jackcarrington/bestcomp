#!/usr/bin/env tsx
/**
 * ⚡ AFFILIATE URL OPTIMIZATION SCRIPT
 *
 * Purpose: Minimize redirect hops for Google Ads compliance
 * - Replace affiliate network redirectors with direct casino URLs where possible
 * - Eliminate opaque tracking URLs that get flagged by scanners
 * - Maintain tracking capabilities through transparent parameters
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

interface CasinoUpdate {
  slug: string;
  currentUrl: string;
  optimizedUrl: string;
  hopReduction: number;
  reasoning: string;
}

/**
 * OPTIMIZATION RULES FOR GOOGLE ADS COMPLIANCE
 */
const optimizationRules: Record<string, (currentUrl: string, slug: string) => CasinoUpdate | null> = {
  // PlayOJO: Already direct, just clean up parameters
  playojo: (currentUrl, slug) => {
    const cleanUrl = currentUrl.replace('brandbing_ukppc', 'directads');
    return {
      slug,
      currentUrl,
      optimizedUrl: cleanUrl,
      hopReduction: 0,
      reasoning: 'Already direct - simplified tracking parameter for transparency',
    };
  },

  // All British: Use direct casino URL instead of affiliate redirector
  allbritish: (currentUrl, slug) => {
    const optimizedUrl =
      'https://allbritishcasino.com/welcome-bonus?utm_source=findcasinosites&utm_medium=affiliate&utm_campaign=comparison';
    return {
      slug,
      currentUrl,
      optimizedUrl,
      hopReduction: 3,
      reasoning: 'Eliminated affiliate redirector - direct casino URL with transparent UTM tracking',
    };
  },

  // Dream Vegas: Request direct URL from affiliate manager
  dreamvegas: (currentUrl, slug) => {
    // For now, keep current but note for optimization
    return {
      slug,
      currentUrl,
      optimizedUrl: currentUrl,
      hopReduction: 0,
      reasoning: 'Requires affiliate manager approval for direct URL - flagged for manual review',
    };
  },

  // Quinn Casino: Simplify tracking
  quinncasino: (currentUrl, slug) => {
    const optimizedUrl = 'https://quinnbet.com/casino?source=findcasinosites';
    return {
      slug,
      currentUrl,
      optimizedUrl,
      hopReduction: 2,
      reasoning: 'Direct casino URL with transparent tracking parameters',
    };
  },

  // Pub Casino: Direct URL instead of affiliate platform
  pubcasino: (currentUrl, slug) => {
    const optimizedUrl =
      'https://pubcasino.co.uk/welcome?utm_source=findcasinosites&utm_medium=affiliate';
    return {
      slug,
      currentUrl,
      optimizedUrl,
      hopReduction: 2,
      reasoning: 'Direct casino URL with UTM tracking instead of affiliate redirector',
    };
  },

  // Knight Slots: Already direct, optimize parameters
  knightslots: (currentUrl, slug) => {
    const optimizedUrl = currentUrl.replace('brandbing-inhouseppc', 'direct-ads');
    return {
      slug,
      currentUrl,
      optimizedUrl,
      hopReduction: 0,
      reasoning: 'Already direct - simplified affiliate parameter for transparency',
    };
  },

  // Mr Play: Direct casino URL
  mrplay: (currentUrl, slug) => {
    const optimizedUrl =
      'https://mrplay.com/en/welcome?utm_source=findcasinosites&utm_medium=affiliate';
    return {
      slug,
      currentUrl,
      optimizedUrl,
      hopReduction: 1,
      reasoning: 'Direct casino welcome page with transparent UTM tracking',
    };
  },
};

/**
 * GOOGLE ADS COMPLIANCE VALIDATION
 */
function validateGoogleAdsCompliance(url: string): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];

  try {
    const urlObj = new URL(url);

    // Check for opaque redirectors
    const redirectorPatterns = ['/redirector', '/redirect.aspx', '/promoRedirect', 'tracker', 'click'];

    if (redirectorPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
      issues.push('Contains opaque redirector pattern');
    }

    // Check for suspicious domains
    const suspiciousDomains = ['affiliates.', 'media.', 'tracking.', 'click.'];

    if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
      issues.push('Uses affiliate/tracking subdomain');
    }

    // Check for transparent tracking
    const hasTransparentTracking = url.includes('utm_') || url.includes('ref=') || url.includes('source=');

    if (!hasTransparentTracking) {
      issues.push('No transparent tracking parameters (utm_, ref=, source=)');
    }
  } catch {
    issues.push('Invalid URL format');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
}

async function optimizeAffiliateUrls() {
  console.log('🔍 Starting affiliate URL optimization for Google Ads compliance...\n');

  try {
    // Get current casino URLs
    const casinos = await sql`
      SELECT "casinoName", "actionButtonLink", slug
      FROM casinos
      WHERE "isActive" = true
      ORDER BY "displayOrder"
    `;

    const updates: CasinoUpdate[] = [];
    let totalHopReduction = 0;

    // Analyze each casino
    for (const casino of casinos) {
      console.log(`📊 Analyzing: ${casino.casinoName} (${casino.slug})`);

      // Current URL compliance check
      const currentCompliance = validateGoogleAdsCompliance(casino.actionButtonLink);
      console.log(`   Current URL: ${casino.actionButtonLink.substring(0, 80)}...`);
      console.log(`   Google Ads Compliant: ${currentCompliance.compliant ? '✅' : '❌'}`);

      if (!currentCompliance.compliant) {
        console.log(`   Issues: ${currentCompliance.issues.join(', ')}`);
      }

      // Apply optimization rule if available
      const optimizer = optimizationRules[casino.slug];
      if (optimizer) {
        const update = optimizer(casino.actionButtonLink, casino.slug);
        if (update) {
          // Check optimized URL compliance
          const optimizedCompliance = validateGoogleAdsCompliance(update.optimizedUrl);
          console.log(`   Optimized URL: ${update.optimizedUrl.substring(0, 80)}...`);
          console.log(`   New Compliance: ${optimizedCompliance.compliant ? '✅' : '❌'}`);
          console.log(`   Hop Reduction: ${update.hopReduction}`);
          console.log(`   Reasoning: ${update.reasoning}`);

          updates.push(update);
          totalHopReduction += update.hopReduction;
        }
      } else {
        console.log(`   ⚠️ No optimization rule defined`);
      }

      console.log('');
    }

    // Summary
    console.log('📈 OPTIMIZATION SUMMARY:');
    console.log(`   Total casinos analyzed: ${casinos.length}`);
    console.log(`   Optimizations available: ${updates.length}`);
    console.log(`   Total redirect hops eliminated: ${totalHopReduction}`);
    console.log('');

    // Show what would be updated
    if (updates.length > 0) {
      console.log('🔄 PLANNED UPDATES:');
      updates.forEach((update, index) => {
        console.log(`${index + 1}. ${update.slug}:`);
        console.log(`   Current:   ${update.currentUrl.substring(0, 70)}...`);
        console.log(`   Optimized: ${update.optimizedUrl.substring(0, 70)}...`);
        console.log(`   Benefit:   ${update.reasoning}`);
        console.log('');
      });

      // Ask for confirmation
      console.log('⚠️  DRY RUN COMPLETE - No changes made to database');
      console.log('📋 To apply these optimizations:');
      console.log('   1. Review each optimization carefully');
      console.log('   2. Test affiliate tracking with partners');
      console.log('   3. Uncomment the database update section below');
      console.log('   4. Run script again to apply changes');

      /*
      // UNCOMMENT TO APPLY CHANGES
      console.log('\n🚀 Applying optimizations...');
      for (const update of updates) {
        await sql`
          UPDATE casinos
          SET "actionButtonLink" = ${update.optimizedUrl}
          WHERE slug = ${update.slug}
        `;
        console.log(`✅ Updated ${update.slug}`);
      }
      console.log('🎉 All optimizations applied successfully!');
      */
    } else {
      console.log('✅ No further optimizations needed - all URLs are already optimal');
    }
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Run the optimization
optimizeAffiliateUrls();
