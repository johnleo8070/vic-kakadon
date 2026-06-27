// Meta Pixel event tracking utility

declare global {
  interface Window {
    fbq?: any;
  }
}

export interface PixelEvent {
  eventName: string;
  parameters?: Record<string, any>;
}

export const trackPixelEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackCustomPixelEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

// Standard Meta Pixel events
export const PixelEvents = {
  VIEW_CONTENT: 'ViewContent',
  SEARCH: 'Search',
  ADD_TO_CART: 'AddToCart',
  ADD_TO_WISHLIST: 'AddToWishlist',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  ADD_PAYMENT_INFO: 'AddPaymentInfo',
  PURCHASE: 'Purchase',
  LEAD: 'Lead',
  COMPLETE_REGISTRATION: 'CompleteRegistration',
};

// Helper functions for common events
export const trackViewContent = (productId: string, productName: string, price: number, category?: string) => {
  trackPixelEvent(PixelEvents.VIEW_CONTENT, {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency: 'NGN',
    category: category,
  });
};

export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number = 1) => {
  trackPixelEvent(PixelEvents.ADD_TO_CART, {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price * quantity,
    currency: 'NGN',
    quantity: quantity,
  });
};

export const trackInitiateCheckout = (value: number, numItems: number) => {
  trackPixelEvent(PixelEvents.INITIATE_CHECKOUT, {
    value: value,
    currency: 'NGN',
    num_items: numItems,
  });
};

export const trackPurchase = (orderId: string, value: number, numItems: number, products: Array<{id: string, name: string, price: number, quantity: number}>) => {
  trackPixelEvent(PixelEvents.PURCHASE, {
    transaction_id: orderId,
    value: value,
    currency: 'NGN',
    num_items: numItems,
    contents: products.map(p => ({
      id: p.id,
      quantity: p.quantity,
      item_price: p.price,
    })),
  });
};

export const trackSearch = (searchString: string) => {
  trackPixelEvent(PixelEvents.SEARCH, {
    search_string: searchString,
  });
};
