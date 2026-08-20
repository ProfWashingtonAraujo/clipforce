import { create } from "zustand";
import projectsData from "../mocks/projects.json";
import type { Project } from "../types";

interface ProjectState {
  projects: Project[];
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: projectsData as Project[],
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
  duplicateProject: (id) =>
    set((state) => {
      const project = state.projects.find((item) => item.id === id);
      if (!project) return state;
      return {
        projects: [
          {
            ...project,
            id: `${id}-copy-${Date.now()}`,
          title: `${project.title} - cópia`,
            status: "Draft",
          updatedAt: "Agora mesmo",
          },
          ...state.projects,
        ],
      };
    }),
}));
