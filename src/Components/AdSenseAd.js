import React, { useEffect } from 'react';

const AdSenseAd = ({ adClient, adSlot, style, format, layout, layoutKey, fullWidthResponsive }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins className="adsbygoogle"
         style={style}
         data-ad-client={adClient}
         data-ad-slot={adSlot}
         data-ad-format={format}
         data-ad-layout={layout}
         data-ad-layout-key={layoutKey}
         data-full-width-responsive={fullWidthResponsive}></ins>
  );
};

export default AdSenseAd;
