import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flexify Portfolio - Frontend Developer",
    short_name: "Flexify",
    description:
      "Frontend Developer building modern web applications with Next.js, TypeScript, and cutting-edge technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: [
      "portfolio",
      "developer",
      "technology",
      "web development",
      "frontend development",
      "backend development",
      "full stack development",
      "web design",
      "ui/ux design",
      "responsive design",
      "performance optimization",
      "seo",
      "accessibility",
      "web development services",
      "frontend development services",
      "backend development services",
      "full stack development services",
      "web design services",
      "ui/ux design services",
      "responsive design services",
      "performance optimization services",
      "seo services",
      "accessibility services",
    ],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/og.jpeg",
        sizes: "1200x630",
        type: "image/jpeg",
      },
    ],
    shortcuts: [
      {
        name: "Projects",
        short_name: "Projects",
        description: "View my portfolio projects",
        url: "/projects",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Services",
        short_name: "Services",
        description: "View my services",
        url: "/services",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Contact",
        short_name: "Contact",
        description: "Get in touch",
        url: "/contact",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
