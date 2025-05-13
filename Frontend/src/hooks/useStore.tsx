import create from "zustand";
import { Blog } from "../types";

type State = {
  token: string | null;
  setToken: (token: string | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  blog: Blog | null;
  setBlog: (blog: Blog | null) => void;
};

export const useStore = create<State>(set => ({
  token: null,
  setToken: token => set({ token }),
  userId: null,
  setUserId: userId => set({ userId }),
  blog: null,
  setBlog: blog => set({ blog }),
}));
