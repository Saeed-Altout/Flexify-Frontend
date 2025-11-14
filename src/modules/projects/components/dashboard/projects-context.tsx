import { QueryProjectsDto } from "@/types";
import { createContext, useContext, ReactNode, useState } from "react";

type ProjectsContextProps = {
  queryParams: QueryProjectsDto;
  setQueryParams: (queryParams: QueryProjectsDto) => void;
};
const initialQueryParams: QueryProjectsDto = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  order: "DESC",
};

const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

type ProjectsProviderProps = {
  children: ReactNode;
};

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const [queryParams, setQueryParams] =
    useState<QueryProjectsDto>(initialQueryParams);

  return (
    <ProjectsContext.Provider value={{ queryParams, setQueryParams }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
