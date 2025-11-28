export interface GrabbyOptions {
  accountId: string;
  url?: string;

  // Configurations
  compact?: boolean;
  lang?: string;
  returnUrl?: string;
  isIframe?: boolean;

  // Advanced Configurations
  // Advanced Configurations
  isGiftCardOpen?: boolean;

  // Theming Configurations
  colorPrimary?: string;
  colorAccent?: string;
  color?: string;
  background?: string;
  bannerUrl?: string;
  logoUrl?: string;
}

export interface GrabbyOpenOptions {
  productId?: string;
  eventId?: string;
  preselectGiftCardAmount?: number;
}
