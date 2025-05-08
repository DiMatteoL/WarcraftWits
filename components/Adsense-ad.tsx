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
        <div className="w-full h-[250px] relative flex-1 flex flex-col">
            <div className="absolute inset-0 border-border border-t self-end">
                <ins
                    className="adsbygoogle"
                    style={{ display: "block", height: "250px", width: "100%" }}
                    data-ad-client="ca-pub-5164534018223080"
                    data-ad-slot="8089054608"
                    data-ad-format="auto"
                    data-full-width-responsive="false"
                />
            </div>
        </div>
    )
}
