export const COMPANY = {
  name: "MAN Engineering Consultancy",
  nameAr: "شركة MAN للاستشارات الهندسية",
  email: "info@marwannazer.com", // public contact address shown on the site
  // Outgoing mail is sent through the mail.mnc.sa SMTP account, so the
  // From address must stay on that domain; replies go to `email` via Reply-To.
  senderEmail: "hr@mnc.sa",
  phone: "0505649859",
  whatsapp: "966505649859", // international format, used for wa.me links
};

// Numbers the site used before 0505649859. A copy may still be saved in the
// dashboard (Firestore "contact" doc); treat them as unset so the new number shows.
export const LEGACY_PHONES = ["0598242385", "0569898000", "966569898000"];
export const LEGACY_WHATSAPPS = ["966598242385", "966569898000"];
// Contact email used before info@marwannazer.com (may still be saved in the dashboard)
export const LEGACY_EMAIL = "hr@mnc.sa";
