// Google tag (gtag.js) helpers for Google Ads conversion tracking.
// The tag itself is loaded once in the root layout by <GoogleTag />; these
// helpers are safe to call anywhere on the client — they no-op during SSR or
// if the tag was blocked (ad blockers), so they can never break a click.

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18437986841";

// Conversion labels from Google Ads → Goals → Conversions → (action) → Tag setup.
// Each one looks like "AbC-D_efG-h12_34-567". Leave a label empty until the
// conversion action exists: the click is still sent as a regular event.
export const CONVERSION_LABELS = {
  whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP || "",
  phone: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE || "",
  email: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_EMAIL || "",
  contactForm: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT_FORM || "ZcfxCKXeiKEdEJm09ddE",
};

/** Low-level wrapper around window.gtag. */
export function gtag(...args) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Send a generic event (e.g. gtagEvent("click_whatsapp", { location: "footer" })). */
export function gtagEvent(name, params = {}) {
  gtag("event", name, { transport_type: "beacon", ...params });
}

/**
 * Report a Google Ads conversion.
 * @param {string} label  conversion label (the part after "AW-…/")
 * @param {{ value?: number, currency?: string, transactionId?: string }} [options]
 */
export function trackConversion(label, { value, currency = "SAR", transactionId } = {}) {
  if (!label) return;
  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    transport_type: "beacon",
    ...(value != null && { value, currency }),
    ...(transactionId && { transaction_id: transactionId }),
  });
}

/**
 * Track a click on a contact channel: always sends a named event, and a
 * Google Ads conversion when that channel has a label configured.
 * @param {"whatsapp" | "phone" | "email" | "contactForm"} channel
 * @param {string} [location]  where on the site the click happened (e.g. "footer")
 */
export function trackContactClick(channel, location) {
  gtagEvent(`contact_${channel}`, location ? { location } : {});
  trackConversion(CONVERSION_LABELS[channel]);
}
