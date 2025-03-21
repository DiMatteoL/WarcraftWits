// Global type definitions
interface Window {
  adsbygoogle: {
    push: (params: {
      google_ad_client?: string
      enable_page_level_ads?: boolean
      overlays?: {
        bottom?: boolean
        top?: boolean
      }
    }) => void
  }[]
}

