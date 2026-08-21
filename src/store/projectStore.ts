import { create } from "zustand";
import { projectService } from "../services/projectService";
import type { Project } from "../types";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  refreshProject: (id: string) => Promise<void>;
  createProject: () => Promise<Project | null>;
  renameProject: (id: string, title: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  clear: () => void;
}

const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      set({ projects: await projectService.list(), loading: false });
    } catch (error) {
      set({ loading: false, error: errorMessage(error) });
    }
  },
  refreshProject: async (id) => {
    try {
      const project = await projectService.get(id);
      set((state) => ({
        projects: state.projects.some((item) => item.id === id)
          ? state.projects.map((item) => (item.id === id ? project : item))
          : [project, ...state.projects],
        error: null,
      }));
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },
  createProject: async () => {
    set({ error: null });
    try {
      const project = await projectService.create();
      set((state) => ({ projects: [project, ...state.projects] }));
      return project;
    } catch (error) {
      set({ error: errorMessage(error) });
      return null;
    }
  },
  renameProject: async (id, title) => {
    set({ error: null });
    try {
      const project = await projectService.rename(id, title);
      set((state) => ({
        projects: state.projects.map((item) =>
          item.id === id ? project : item,
        ),
      }));
      return true;
    } catch (error) {
      set({ error: errorMessage(error) });
      return false;
    }
  },
  deleteProject: async (id) => {
    set({ error: null });
    try {
      await projectService.remove(id);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
      }));
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },
  duplicateProject: async (id) => {
    const source = get().projects.find((project) => project.id === id);
    if (!source) return;
    set({ error: null });
    try {
      const project = await projectService.duplicate(source);
      set((state) => ({ projects: [project, ...state.projects] }));
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },
  clear: () => set({ projects: [], error: null, loading: false }),
}));
