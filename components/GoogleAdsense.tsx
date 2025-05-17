import Script from "next/script";

const GoogleAdsense: React.FC = () => {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5164534018223080"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-LLH4GV7QPS"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LLH4GV7QPS');
        `}
      </Script>
    </>
  );
};

export default GoogleAdsense;
