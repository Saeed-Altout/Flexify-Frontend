import type { Project, UpdateProjectDto, ProjectFormValues } from "@/types";

/**
 * Compare two objects and return only the changed fields
 */
export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  updated: T
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (key in original) {
      const originalValue = original[key];
      const updatedValue = updated[key];

      // Deep comparison for arrays and objects
      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
          changes[key] = updatedValue;
        }
      } else if (
        typeof originalValue === "object" &&
        originalValue !== null &&
        typeof updatedValue === "object" &&
        updatedValue !== null
      ) {
        // For nested objects, recursively check
        const nestedChanges = getChangedFields(
          originalValue as Record<string, unknown>,
          updatedValue as Record<string, unknown>
        );
        if (Object.keys(nestedChanges).length > 0) {
          changes[key] = updatedValue;
        }
      } else if (originalValue !== updatedValue) {
        changes[key] = updatedValue;
      }
    } else {
      // New field
      changes[key] = updatedValue;
    }
  }

  return changes;
}

/**
 * Get only changed fields for project update
 */
export function getProjectChanges(
  original: Project,
  updated: ProjectFormValues
): UpdateProjectDto {
  const changes: UpdateProjectDto = {};

  // Compare basic fields
  if (original.role !== updated.role) changes.role = updated.role;
  if (original.is_published !== updated.is_published)
    changes.is_published = updated.is_published;

  // Compare arrays (deep comparison)
  if (
    JSON.stringify(original.tech_stack || []) !==
    JSON.stringify(updated.tech_stack || [])
  ) {
    changes.tech_stack = updated.tech_stack;
  }
  if (
    JSON.stringify(original.images || []) !==
    JSON.stringify(updated.images || [])
  ) {
    changes.images = updated.images;
  }

  // Compare URLs (handle empty strings as undefined)
  const originalGithubUrl = original.github_url || undefined;
  const updatedGithubUrl = updated.github_url || undefined;
  if (originalGithubUrl !== updatedGithubUrl) {
    changes.github_url = updatedGithubUrl;
  }

  const originalGithubBackendUrl = original.github_backend_url || undefined;
  const updatedGithubBackendUrl = updated.github_backend_url || undefined;
  if (originalGithubBackendUrl !== updatedGithubBackendUrl) {
    changes.github_backend_url = updatedGithubBackendUrl;
  }

  const originalLiveDemoUrl = original.live_demo_url || undefined;
  const updatedLiveDemoUrl = updated.live_demo_url || undefined;
  if (originalLiveDemoUrl !== updatedLiveDemoUrl) {
    changes.live_demo_url = updatedLiveDemoUrl;
  }

  const originalMainImage = original.main_image || undefined;
  const updatedMainImage = updated.main_image || undefined;
  if (originalMainImage !== updatedMainImage) {
    changes.main_image = updatedMainImage;
  }

  // Compare translations
  const originalTranslations = original.translations || [];
  const updatedTranslations = updated.translations || [];

  // Check if translations have changed
  const translationsChanged =
    originalTranslations.length !== updatedTranslations.length ||
    originalTranslations.some((orig, index) => {
      const updated = updatedTranslations[index];
      if (!updated) return true;
      return (
        orig.title !== updated.title ||
        orig.summary !== updated.summary ||
        orig.description !== updated.description ||
        (orig.architecture || "") !== (updated.architecture || "") ||
        JSON.stringify(orig.features || []) !== JSON.stringify(updated.features || [])
      );
    });

  if (translationsChanged && updatedTranslations.length > 0) {
    changes.translations = updatedTranslations.map((t) => ({
      language: t.language,
      title: t.title,
      summary: t.summary,
      description: t.description,
      architecture: t.architecture,
      features: t.features,
    }));
  }

  return changes;
}

/**
 * Check if there are any changes between original and updated project
 */
export function hasProjectChanges(
  original: Project,
  updated: ProjectFormValues
): boolean {
  const changes = getProjectChanges(original, updated);
  return Object.keys(changes).length > 0;
}

