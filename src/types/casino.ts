export interface Casino {
  id: number;
  casinoName: string;
  slug?: string;
  actionButtonLink?: string;
  bonusAmount?: number;
  bonusPercentage?: number;
  freeSpins?: number;
  ratingScore?: number;
  reviewCount?: number;
  ratingStars?: number;
  minDeposit?: number;
  ribbonText?: string;
  termsConditions?: string;
  isActive: boolean;
  displayOrder?: number;
  sortOrder?: number;
  payoutSpeed?: string;
  gameTypes?: string[];
  mobileOptimized?: boolean;
  licensedDE?: boolean;
  featured?: boolean;
  tag?: string | null;
  tagColor?: string;
}

export interface DatabaseCasino {
  id: number;
  casinoName: string;
  actionButtonLink: string;
  isActive: boolean;
  slug?: string;
  bonusAmount?: number;
  bonusPercentage?: number;
  freeSpins?: number;
  ratingScore?: number;
  reviewCount?: number;
  ratingStars?: number;
  minDeposit?: number;
  ribbonText?: string;
  termsConditions?: string;
  displayOrder?: number;
  sortOrder?: number;
  payoutSpeed?: string;
  gameTypes?: string[];
  mobileOptimized?: boolean;
  licensedDE?: boolean;
  featured?: boolean;
  tag?: string | null;
  tagColor?: string;
}
