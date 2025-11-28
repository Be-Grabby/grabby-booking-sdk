export interface GrabbyOptions {
    accountId: string;
    url?: string;
    compact?: boolean;
    lang?: string;
    returnUrl?: string;
    isIframe?: boolean;
    isGiftCardOpen?: boolean;
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
