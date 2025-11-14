"use server";

// Re-export from modules for backward compatibility
export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  rateProject,
  likeProject,
} from "@/modules/projects/api/actions";
