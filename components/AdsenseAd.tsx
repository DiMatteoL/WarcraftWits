import { useEffect } from "react"

export const AdsenseAd = () => {
    useEffect(() => {
        try {
            // @ts-expect-error - adsbygoogle is a global variable injected by Google
            if (window) (window.adsbygoogle = window.adsbygoogle || []).push({})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {}
    }, [])
    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "90px" }}
            data-ad-client="ca-pub-5164534018223080"
            data-ad-slot="8089054608"
            data-ad-format="horizontal"
            data-full-width-responsive="false"
        />
    )
}
