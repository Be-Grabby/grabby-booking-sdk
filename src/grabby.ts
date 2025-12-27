import { GrabbyOpenOptions, GrabbyOptions } from './interfaces/options.interface';

export class GrabbySDK {
  private accountId: string | null = null;
  private options: GrabbyOptions | null = null;

  constructor(accountId: string, options: GrabbyOptions) {
    this.accountId = accountId;
    this.options = options;
  }

  private buildUrl(openOptions?: GrabbyOpenOptions & GrabbyOptions): string {
    const accountId = this.options?.accountId || this.accountId;
    if (!accountId) {
      throw new Error('Grabby: accountId is required. Call init(accountId) or pass it in options.');
    }

    const baseUrl = `${this.options?.url || 'https://app.begrabby.com'}/booking/${accountId}`;
    const url = new URL(baseUrl);

    // Add query params
    if (openOptions?.compact || this.options?.compact) url.searchParams.append('compact', 'true');
    if (openOptions?.hideFooter || this.options?.hideFooter) url.searchParams.append('hideFooter', 'true');

    const lang = openOptions?.lang || this.options?.lang;
    if (lang) url.searchParams.append('lang', lang);

    const returnUrl = openOptions?.returnUrl || this.options?.returnUrl;
    if (returnUrl) url.searchParams.append('returnUrl', returnUrl);
    if (openOptions?.isIframe !== undefined || this.options?.isIframe !== undefined) url.searchParams.append('isIframe', String(openOptions?.isIframe || this.options?.isIframe));

    if (openOptions?.productId) url.searchParams.append('productId', openOptions.productId);
    if (openOptions?.visitDate) url.searchParams.append('visitDate', openOptions.visitDate);
    if (openOptions?.eventId) url.searchParams.append('eventId', openOptions.eventId);
    if (openOptions?.isGiftCardOpen) url.searchParams.append('isGiftCardOpen', 'true');
    if (openOptions?.preselectGiftCardAmount) url.searchParams.append('preselectGiftCardAmount', String(openOptions.preselectGiftCardAmount));

    const colorPrimary = openOptions?.colorPrimary || this.options?.colorPrimary;
    if (colorPrimary) url.searchParams.append('colorPrimary', colorPrimary);

    const colorAccent = openOptions?.colorAccent || this.options?.colorAccent;
    if (colorAccent) url.searchParams.append('colorAccent', colorAccent);

    const color = openOptions?.color || this.options?.color;
    if (color) url.searchParams.append('color', color);

    const background = openOptions?.background || this.options?.background;
    if (background) url.searchParams.append('background', background);

    const bannerUrl = openOptions?.bannerUrl || this.options?.bannerUrl;
    if (bannerUrl) url.searchParams.append('bannerUrl', bannerUrl);

    const logoUrl = openOptions?.logoUrl || this.options?.logoUrl;
    if (logoUrl) url.searchParams.append('logoUrl', logoUrl);

    return url.toString();
  }

  render(selector: string, openOptions?: GrabbyOpenOptions & GrabbyOptions) {
    try {
      const url = this.buildUrl(openOptions);

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.id = 'grabby-iframe';

      // Find container
      let container: HTMLElement | null = null;
      if (selector) {
        container = document.querySelector(selector);
      }

      if (!container) {
        console.warn(`Grabby: Container with selector "${selector}" not found. Appending to body.`);
        container = document.body;
      }

      // Clear container? Maybe not, user might want to append.
      // But usually render implies putting it there.
      container.innerHTML = '';
      container.appendChild(iframe);

      this.attachListeners();
    } catch (e) {
      console.error(e);
    }
  }

  showModal(openOptions?: GrabbyOpenOptions & GrabbyOptions) {
    // For a modal, we might want to create a fixed overlay
    try {
      const url = this.buildUrl(openOptions);

      const overlay = document.createElement('div');
      overlay.id = 'grabby-modal-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9999';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';

      const iframeContainer = document.createElement('div');
      iframeContainer.style.width = '80%'; // Configurable?
      iframeContainer.style.height = '80%';
      iframeContainer.style.backgroundColor = 'white';
      iframeContainer.style.overflow = 'hidden';
      iframeContainer.style.position = 'relative';

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.id = 'grabby-iframe';

      iframeContainer.appendChild(iframe);
      overlay.appendChild(iframeContainer);
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          this.close();
        }
      });

      this.attachListeners();
    } catch (e) {
      console.error(e);
    }
  }

  private attachListeners() {
    window.removeEventListener('message', this.handleMessage);
    window.addEventListener('message', this.handleMessage);
  }

  private handleMessage = (event: MessageEvent) => {
    if (!event.data) return;

    switch(event.data.type) {
      case 'booking.close':
        this.close();
        break;
      case 'booking.redirect':
        if (event.data.redirectUri) {
          window.open(event.data.redirectUri, '_blank');
        }
        break;
      case 'booking.css':
        const height = event.data.height;
        const iframe = document.getElementById('grabby-iframe');
        if (iframe) {
          iframe.style.height = `${height}px`;
        }
        break;
    }
  }

  close() {
    const overlay = document.getElementById('grabby-modal-overlay');

    overlay?.remove();

    window.removeEventListener('message', this.handleMessage);
  }
}
