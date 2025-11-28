/**
 * Server-side API utilities
 * For use in Server Components and generateMetadata functions
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

/**
 * Fetch project by slug (server-side)
 */
export async function getProjectBySlugServer(
  slug: string,
  locale: string = "en"
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects/slug/${slug}?locale=${locale}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          "Accept-Language": locale,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.project || null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

