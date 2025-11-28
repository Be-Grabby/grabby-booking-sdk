# Grabby Booking SDK

The Grabby Booking SDK allows you to easily integrate the Grabby booking interface into your website. You can embed it as an iframe in a container or display it as a modal overlay.

## Installation

### CDN (Recommended)

Add the following script tag to your HTML:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/Be-Grabby/grabby-booking-sdk/dist/grabby-sdk.umd.js"></script>
```

### NPM

```bash
npm install @begrabby/booking-sdk
```

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grabby Booking</title>
  <script type="module" src="https://cdn.jsdelivr.net/gh/Be-Grabby/grabby-booking-sdk/dist/grabby-sdk.umd.js"></script>
</head>
<body>
  <div id="booking-container" style="width: 100%; height: 600px;"></div>

  <script type="module">
    const grabby = new window.Grabby('YOUR_ACCOUNT_ID', {
      lang: 'en',
      url: 'https://app.begrabby.com'
    });

    grabby.render('#booking-container');
  </script>
</body>
</html>
```

## API Reference

### Constructor

```javascript
new Grabby(accountId, options)
```

#### Parameters

- **accountId** (string, required): Your Grabby account ID
- **options** (object, required): Configuration options

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `url` | string | Base URL for the booking interface (default: `https://app.begrabby.com`) |
| `lang` | string | Language code (e.g., `'en'`, `'es'`, `'de'`) |
| `compact` | boolean | Enable compact mode for smaller displays |
| `returnUrl` | string | URL to redirect after booking completion |
| `isIframe` | boolean | Enable iframe mode |
| `isGiftCardOpen` | boolean | Open gift card section by default |
| `colorPrimary` | string | Primary color (hex without `#`, e.g., `'fe6913'`) |
| `colorAccent` | string | Accent color (hex without `#`) |
| `color` | string | Text color (hex without `#`) |
| `background` | string | Background color (hex without `#`) |
| `bannerUrl` | string | URL to custom banner image |
| `logoUrl` | string | URL to custom logo image |

### Methods

#### `render(selector, openOptions?)`

Renders the booking interface inside a container element.

```javascript
grabby.render('#booking-container', {
  productId: 'product-uuid',
  compact: true
});
```

**Parameters:**
- `selector` (string): CSS selector for the container element
- `openOptions` (object, optional): Additional options to override constructor options

#### `showModal(openOptions?)`

Displays the booking interface in a modal overlay.

```javascript
grabby.showModal({
  productId: 'product-uuid',
  eventId: 'event-uuid',
  compact: true
});
```

**Parameters:**
- `openOptions` (object, optional): Additional options to override constructor options

#### `close()`

Closes the modal or removes the iframe.

```javascript
grabby.close();
```

### Open Options

When calling `render()` or `showModal()`, you can pass additional options:

| Option | Type | Description |
|--------|------|-------------|
| `productId` | string | Pre-select a specific product |
| `eventId` | string | Pre-select a specific event |
| `preselectGiftCardAmount` | number | Pre-select gift card amount |

All constructor options can also be passed here to override the default configuration.

## Examples

### Basic Embedded Widget

```html
<div id="booking-container" style="width: 100%; height: 600px;"></div>

<script type="module">
  const grabby = new window.Grabby('YOUR_ACCOUNT_ID', {
    lang: 'en'
  });

  grabby.render('#booking-container');
</script>
```

### Modal with Custom Styling

```html
<button id="book-now">Book Now</button>

<script type="module">
  const grabby = new window.Grabby('YOUR_ACCOUNT_ID', {
    lang: 'en',
    colorPrimary: 'fe6913',
    colorAccent: '1E1F21',
    bannerUrl: 'https://example.com/banner.png',
    logoUrl: 'https://example.com/logo.png'
  });

  document.getElementById('book-now').addEventListener('click', () => {
    grabby.showModal();
  });
</script>
```

### Pre-select Product

```html
<button id="book-product">Book Specific Product</button>

<script type="module">
  const grabby = new window.Grabby('YOUR_ACCOUNT_ID', {
    lang: 'en'
  });

  document.getElementById('book-product').addEventListener('click', () => {
    grabby.showModal({
      productId: 'fdfbd428-7d39-4819-969f-01823d01958d',
      compact: true,
      isIframe: true
    });
  });
</script>
```

### Gift Card Purchase

```html
<button id="buy-gift-card">Buy Gift Card</button>

<script type="module">
  const grabby = new window.Grabby('YOUR_ACCOUNT_ID', {
    lang: 'en'
  });

  document.getElementById('buy-gift-card').addEventListener('click', () => {
    grabby.showModal({
      isGiftCardOpen: true,
      preselectGiftCardAmount: 50
    });
  });
</script>
```

## Events

The SDK automatically listens for messages from the booking interface:

- **booking.close**: Closes the modal/iframe
- **booking.redirect**: Opens a redirect URL in a new tab
- **booking.css**: Adjusts iframe height dynamically

These events are handled automatically by the SDK.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- Module script support required

## License

ISC
