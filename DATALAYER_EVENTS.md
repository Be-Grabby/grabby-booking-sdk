# Booking – Datalayer / GTM Events

This document lists every event pushed to `window.dataLayer` from the booking flow so the GTM team can build the matching tags.

All pushes follow the **GA4 Enhanced Ecommerce** shape:

```js
window.dataLayer.push({
  event: '<event_name>',
  ecommerce: { /* payload described per event below */ }
});
```

---

## 1. Payload building blocks

### `GEcommerceItem`

| Key | Type | Notes |
|---|---|---|
| `item_id` | string | Product / Event id |
| `item_name` | string | Product name / Event title |
| `item_category` | string | Always `'online-booking'` for booking-flow events |
| `item_category2` | string | `'service'` \| `'product'` \| `'grabby-event'` |
| `item_category3` | string | Product category id **or** `event-<eventId>` during checkout |
| `item_category4` | string? | `'grabby-event'` when the line belongs to a grabby event |
| `item_list_id` | string | The `accountId` (tenant / venue id) |
| `price` | number | In currency units (cents ÷ 100) |
| `quantity` | number | 1 on view / add / remove of a single product; line amount on checkout |

### `GEcommerce` envelope

| Key | Type | Notes |
|---|---|---|
| `currency` | string | ISO currency code (e.g. `EUR`) |
| `item_list_id` | string | Tenant / venue id (`accountId`) |
| `value` | number | Total in currency units |
| `payment_type` | string? | Only present on `purchase` |
| `transaction_id` | string? | Only present on `purchase` — the booking id, used by GA4 to de-duplicate |
| `items` | `GEcommerceItem[]` | |

---

## 2. Events

### 2.1 `view_item_list` — Product detail opened

**Triggered when** the user opens a product detail modal.

```json
{
  "event": "view_item_list",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 12.5,
    "items": [{
      "item_id": "<productId>",
      "item_name": "<productName>",
      "item_category": "online-booking",
      "item_category2": "service | product",
      "item_category3": "<productCategoryId>",
      "item_list_id": "<accountId>",
      "price": 12.5,
      "quantity": 1
    }]
  }
}
```

---

### 2.2 `view_item_list` — Event detail opened

**Triggered when** the user opens an event detail modal. The event is a bundle of products, so `value` / `price` equal the sum of `product.price * quantity` across the bundle.

```json
{
  "event": "view_item_list",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 30.0,
    "items": [{
      "item_id": "<eventId>",
      "item_name": "<eventTitle>",
      "item_category": "online-booking",
      "item_category2": "grabby-event",
      "item_list_id": "<accountId>",
      "price": 30.0,
      "quantity": 1
    }]
  }
}
```

---

### 2.3 `add_to_cart` — Product added from product modal

**Triggered when** the user clicks "Add" inside the product detail modal.

```json
{
  "event": "add_to_cart",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 12.5,
    "items": [{
      "item_id": "<productId>",
      "item_name": "<productName>",
      "item_category": "online-booking",
      "item_category2": "service | product",
      "item_category3": "<productCategoryId>",
      "item_list_id": "<accountId>",
      "price": 12.5,
      "quantity": 1
    }]
  }
}
```

---

### 2.4 `add_to_cart` — Quantity incremented inside cart

**Triggered when** the user increments a product line from the cart step.

```json
{
  "event": "add_to_cart",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 12.5,
    "items": [{
      "item_id": "<productId>",
      "item_name": "<productName>",
      "item_category": "online-booking",
      "item_category2": "service | product",
      "item_category3": "<productCategoryId>",
      "item_list_id": "<accountId>",
      "price": 12.5,
      "quantity": 1
    }]
  }
}
```

---

### 2.5 `add_to_cart` — Event bundle added

**Triggered when** the user confirms adding an event bundle from the event detail modal.

```json
{
  "event": "add_to_cart",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 30.0,
    "items": [{
      "item_id": "<eventId>",
      "item_name": "<eventTitle>",
      "item_category": "online-booking",
      "item_category2": "grabby-event",
      "item_list_id": "<accountId>",
      "price": 30.0,
      "quantity": 1
    }]
  }
}
```

---

### 2.6 `remove_from_cart` — Product removed / decremented

**Triggered when** the user decrements or removes a product line from the cart step. Only fires for **products**; there is no equivalent event for removing an event bundle.

```json
{
  "event": "remove_from_cart",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 12.5,
    "items": [{
      "item_id": "<productId>",
      "item_name": "<productName>",
      "item_category": "online-booking",
      "item_category2": "service | product",
      "item_category3": "<productCategoryId>",
      "item_list_id": "<accountId>",
      "price": 12.5,
      "quantity": 1
    }]
  }
}
```

---

### 2.7 `begin_checkout` — User leaves the cart step

**Triggered when** the user clicks "Next / Continue" on the cart step to proceed to payment.

Notes on the items array (different from the single-item payloads above):
- `item_category3` = literal string `event-<eventId>` when the cart belongs to a grabby event; `event-undefined` otherwise.
- `item_category4` = `'grabby-event'` when the cart belongs to a grabby event; the key is omitted otherwise.
- `quantity` is the actual line amount (not forced to 1).
- `price` is the per-line unit price.

```json
{
  "event": "begin_checkout",
  "ecommerce": {
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 42.0,
    "items": [
      {
        "item_id": "<productId>",
        "item_name": "<productName>",
        "item_category": "online-booking",
        "item_category2": "service | product",
        "item_category3": "event-<eventId | undefined>",
        "item_category4": "grabby-event",
        "item_list_id": "<accountId>",
        "price": 10.0,
        "quantity": 2
      }
    ]
  }
}
```

---

### 2.8 `purchase` — Payment confirmed

**Triggered when** the user confirms payment on the pay step. Same items shape as `begin_checkout`, plus a populated `payment_type` and `transaction_id` (the booking id — used by GA4 for purchase de-duplication).

```json
{
  "event": "purchase",
  "ecommerce": {
    "transaction_id": "<bookingId>",
    "payment_type": "<paymentMethod>",
    "currency": "EUR",
    "item_list_id": "<accountId>",
    "value": 42.0,
    "items": [
      {
        "item_id": "<productId>",
        "item_name": "<productName>",
        "item_category": "online-booking",
        "item_category2": "service | product",
        "item_category3": "event-<eventId | undefined>",
        "item_category4": "grabby-event",
        "item_list_id": "<accountId>",
        "price": 10.0,
        "quantity": 2
      }
    ]
  }
}
```

---

## 3. Summary table

| # | `event` | Triggered when |
|---|---|---|
| 2.1 | `view_item_list` | Product detail modal opened |
| 2.2 | `view_item_list` | Event detail modal opened |
| 2.3 | `add_to_cart` | Product added from product detail modal |
| 2.4 | `add_to_cart` | Quantity incremented in the cart |
| 2.5 | `add_to_cart` | Event bundle added from event detail modal |
| 2.6 | `remove_from_cart` | Product decremented / removed in the cart |
| 2.7 | `begin_checkout` | User leaves the cart step toward payment |
| 2.8 | `purchase` | Payment confirmed |

---

## 4. Iframe integration (hosting site → parent `dataLayer`)

When the booking app is embedded inside a host site via `<iframe>`, the host's own GTM container lives on the parent window and cannot read the iframe's `dataLayer` directly. The app forwards every push to the parent window as a `postMessage` with the type `data-layer-event`, and the host is responsible for proxying it into its own `dataLayer`.

### 4.1 Message shape sent by the iframe

For every ecommerce event, the iframe emits **two** messages: first a clear, then the actual payload. This keeps the host's `dataLayer` aligned with GA4's "reset ecommerce before each push" rule.

```js
// (1) Sent by the iframe before each ecommerce payload
window.parent.postMessage({
  type: 'data-layer-event',
  event: null,
  data: { ecommerce: null }
}, '*');

// (2) Sent right after, with the actual payload
window.parent.postMessage({
  type: 'data-layer-event',
  event: '<event_name>',        // e.g. 'add_to_cart', 'purchase', ...
  data: { ecommerce: { /* any of the payloads described in §2 */ } }
}, '*');
```

### 4.2 Listener to install on the host page

Install this **once** on the parent page, ideally before GTM so no events are lost. Always validate the `origin` against the domain that serves the booking app to avoid accepting events from arbitrary frames.

```html
<script>
  window.dataLayer = window.dataLayer || [];

  window.addEventListener('message', (event) => {
    // 1. Only accept messages from the booking app origin
    const TRUSTED_ORIGINS = [
      'https://booking.begrabby.com',
      // add staging / preview origins here
    ];
    if (!TRUSTED_ORIGINS.includes(event.origin)) return;

    // 2. Filter for our envelope
    const msg = event.data;
    if (!msg || msg.type !== 'data-layer-event') return;

    // 3. Proxy into the host's dataLayer.
    window.dataLayer.push({ event: msg.event, ...msg.data });
  });
</script>
```
