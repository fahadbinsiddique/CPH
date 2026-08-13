export default function manifest() {
  return {
    name: "Center for Psychology",
    short_name: "CPH",
    description: "Mental wellness & online counseling platform",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["health", "medical", "lifestyle"],
    icons: [
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Desktop view of Center for Psychology",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Mobile view of Center for Psychology",
      },
    ],
    shortcuts: [
      {
        name: "Find Consultants",
        short_name: "Consultants",
        url: "/consultant",
        icons: [{ src: "/icons/web-app-manifest-192x192.png", sizes: "192x192" }],
      },
      {
        name: "My Dashboard",
        short_name: "Dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/web-app-manifest-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Take Assessment",
        short_name: "Assessment",
        url: "/assessment",
        icons: [{ src: "/icons/web-app-manifest-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}