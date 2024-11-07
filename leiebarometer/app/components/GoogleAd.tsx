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
  adFormat = "auto",
  fullWidthResponsive = true,
}) => {
  useEffect(() => {
    // Ensure adsbygoogle array exists
    if (typeof window !== "undefined" && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle.push({});
      } catch (error) {
        console.error("Adsbygoogle push error:", error);
      }
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
