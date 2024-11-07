// app/components/GoogleAd.tsx

import React, { useEffect } from "react";

interface GoogleAdProps {
  adClient: string;
  adSlot: string;
  style?: React.CSSProperties;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  adClient,
  adSlot,
  style,
  adFormat,
  fullWidthResponsive,
}) => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle && Array.isArray((window as any).adsbygoogle)) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Adsbygoogle push error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    ></ins>
  );
};

export default GoogleAd;
