import { create } from "zustand";
import { shallow } from "zustand/shallow"; // shallow 비교 사용

interface LocationState {
  selectedLocation: string;
  selectedLocationId: number;
  favorites: { id: number; location: string }[];
  setSelectedLocation: (location: string, id: number) => void;
  setFavorites: (favorites: { id: number; location: string }[]) => void;
  loadFavorites: () => void;
}

const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: "",
  selectedLocationId: 0,
  favorites: [],

  setSelectedLocation: (location, id) =>
    set({ selectedLocation: location, selectedLocationId: id }),

  setFavorites: (favorites) => set({ favorites }),

  loadFavorites: () => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      set({ favorites: JSON.parse(storedFavorites) });
    }
  },
}));

export const useLocationSelector = (selector: (state: LocationState) => any) =>
  useLocationStore(selector, shallow);
