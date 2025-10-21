import { pgTable, text, serial, integer, boolean, decimal, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const casinos = pgTable('casinos', {
  id: serial('id').primaryKey(),
  casinoName: text('casino_name').notNull(),
  slug: text('slug').unique(), // URL-friendly slug for /go/ redirects
  casinoImageUrl: text('casino_image_url').notNull(),
  bonusPercentage: integer('bonus_percentage').notNull(), // e.g., 100, 200
  bonusAmount: integer('bonus_amount').notNull(), // e.g., 100, 200, 250 (in currency)
  freeSpins: integer('free_spins').default(0), // e.g., 88, 50, 100
  ratingScore: decimal('rating_score', { precision: 2, scale: 1 }).notNull(), // e.g., 9.8, 9.6, 9.4
  ratingStars: integer('rating_stars').notNull(), // 1-5 stars
  reviewCount: integer('review_count').notNull(), // e.g., 1247, 892, 1456
  actionButtonText: text('action_button_text').notNull(), // e.g., "BONUS BEANSPRUCHEN", "BONUS HOLEN"
  actionButtonLink: text('action_button_link').notNull(), // URL for the action button
  termsConditions: text('terms_conditions').notNull(), // T&Cs text
  ribbonText: text('ribbon_text'), // Custom ribbon text for each casino
  minDeposit: integer('min_deposit').default(10), // Minimum deposit amount in currency
  sortOrder: integer('sort_order').default(0), // for controlling display order
  displayOrder: integer('display_order').default(999), // Simple 1-9 ordering system
  isActive: boolean('is_active').default(true), // to show/hide listings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: text('subscribed_at').notNull(),
  active: boolean('active').default(true),
});

// Landing pages for PPC campaigns
export const landingPages = pgTable('landing_pages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(), // URL path (e.g., "best-uk-slots", "mobile-casino-bonus")
  pageTitle: text('page_title').notNull(), // H1 title displayed on the page
  pageSubheading: text('page_subheading'), // Optional subheading that appears after em dash
  useCurrentDate: boolean('use_current_date').default(false), // Use dynamic current date instead of custom subheading
  pageDescription: text('page_description').notNull(), // Opening description text
  metaTitle: text('meta_title').notNull(), // SEO title tag
  metaDescription: text('meta_description').notNull(), // SEO meta description
  isActive: boolean('is_active').default(true), // to show/hide pages
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertCasinoSchema = createInsertSchema(casinos)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    ratingScore: z.number().min(0).max(10),
  });

export const updateCasinoSchema = insertCasinoSchema.partial();

export const insertNewsletterSchema = createInsertSchema(newsletterSubscriptions)
  .omit({
    id: true,
    subscribedAt: true,
    active: true,
  })
  .pick({
    email: true,
  });

export type InsertCasino = z.infer<typeof insertCasinoSchema>;
export type UpdateCasino = z.infer<typeof updateCasinoSchema>;
export type Casino = typeof casinos.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletterSubscriptions.$inferSelect;

// Landing page schemas and types
export const insertLandingPageSchema = createInsertSchema(landingPages)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    slug: z
      .string()
      .min(1, 'URL slug is required')
      .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    pageTitle: z.string().min(1, 'Page title is required').max(100, 'Page title must be under 100 characters'),
    pageSubheading: z.string().optional(),
    useCurrentDate: z.boolean().optional(),
    pageDescription: z.string().min(1, 'Page description is required'),
    metaTitle: z.string().min(1, 'Meta title is required').max(60, 'Meta title should be under 60 characters for SEO'),
    metaDescription: z
      .string()
      .min(1, 'Meta description is required')
      .max(160, 'Meta description should be under 160 characters for SEO'),
  });

export const updateLandingPageSchema = insertLandingPageSchema.partial();

export type InsertLandingPage = z.infer<typeof insertLandingPageSchema>;
export type UpdateLandingPage = z.infer<typeof updateLandingPageSchema>;
export type LandingPage = typeof landingPages.$inferSelect;

// Frontend Casino type that matches the API response mapping
export type FrontendCasino = {
  id: number;
  name: string;
  logo: string;
  bonus: string;
  bonusAmount: number;
  bonusPercentage: number;
  freeSpins: number;
  rating: string;
  score: string;
  ratingStars: number;
  reviewCount: number;
  website: string;
  actionButtonText: string;
  actionButtonLink: string;
  terms: string;
  ribbonText?: string;
  minDeposit: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  featured: boolean;
  tag: string | null;
  tagColor: string;
  payoutSpeed: string;
  gameTypes: string[];
  mobileOptimized: boolean;
  licensedDE: boolean;
};
// export type AuditLogEntry = typeof auditLog.$inferSelect; // auditLog table not yet defined

// Content sections for dynamic page content management
export const contentSections = pgTable('content_sections', {
  id: serial('id').primaryKey(),
  sectionKey: text('section_key').notNull().unique(), // e.g., "homepage_rating_section", "mobile_rating_section"
  sectionTitle: text('section_title').notNull(), // e.g., "How we rate online casinos"
  sectionSubtitle: text('section_subtitle'), // Optional subtitle
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Individual content items within sections (rating criteria, trust indicators)
export const contentItems = pgTable('content_items', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').notNull(), // References content_sections.id
  itemKey: text('item_key').notNull(), // e.g., "security_licensing", "game_selection"
  itemTitle: text('item_title').notNull(), // e.g., "Security & Licensing"
  itemDescription: text('item_description').notNull(), // Full description text
  itemIcon: text('item_icon'), // Emoji or icon identifier
  backgroundColor: text('background_color'), // CSS class for background color
  displayOrder: integer('display_order').default(0), // Order within the section
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Trust indicators (statistics, badges, credentials)
export const trustIndicators = pgTable('trust_indicators', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').notNull(), // References content_sections.id
  indicatorKey: text('indicator_key').notNull(), // e.g., "years_experience", "reviewed_casinos"
  indicatorText: text('indicator_text').notNull(), // e.g., "15+ Years Experience"
  backgroundColor: text('background_color'), // CSS class for background color
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Content sections schemas and types
export const insertContentSectionSchema = createInsertSchema(contentSections)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    sectionKey: z.string().min(1, 'Section key is required').max(100, 'Section key too long'),
    sectionTitle: z.string().min(1, 'Section title is required').max(200, 'Section title too long'),
    sectionSubtitle: z.string().max(300, 'Section subtitle too long').optional(),
  });

export const insertContentItemSchema = createInsertSchema(contentItems)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    itemKey: z.string().min(1, 'Item key is required').max(100, 'Item key too long'),
    itemTitle: z.string().min(1, 'Item title is required').max(200, 'Item title too long'),
    itemDescription: z.string().min(1, 'Item description is required'),
    itemIcon: z.string().max(50, 'Icon too long').optional(),
    backgroundColor: z.string().max(100, 'Background color too long').optional(),
  });

export const insertTrustIndicatorSchema = createInsertSchema(trustIndicators)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    indicatorKey: z.string().min(1, 'Indicator key is required').max(100, 'Indicator key too long'),
    indicatorText: z.string().min(1, 'Indicator text is required').max(100, 'Indicator text too long'),
    backgroundColor: z.string().max(100, 'Background color too long').optional(),
  });

export type ContentSection = typeof contentSections.$inferSelect;
export type ContentItem = typeof contentItems.$inferSelect;
export type TrustIndicator = typeof trustIndicators.$inferSelect;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type InsertTrustIndicator = z.infer<typeof insertTrustIndicatorSchema>;
