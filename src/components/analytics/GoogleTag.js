import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/gtag";

// Loads gtag.js with strategy="afterInteractive": Next.js injects it after
// hydration, so it never blocks HTML parsing, FCP or LCP. The inline stub
// defines window.gtag immediately, so calls made before gtag.js finishes
// downloading are queued in dataLayer and replayed — nothing is lost.
export default function GoogleTag() {
  if (!GOOGLE_ADS_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
