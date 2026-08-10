import { create } from "zustand";

interface FleetState {
  selectedCountry: string;

  wishlist: string[];

  compareVehicles: string[];

  setCountry: (country: string) => void;

  addWishlist: (id: string) => void;

  removeWishlist: (id: string) => void;

  addCompare: (id: string) => void;

  removeCompare: (id: string) => void;
}

export const useFleetStore =
  create<FleetState>((set) => ({
    selectedCountry: "All",

    wishlist: [],

    compareVehicles: [],

    setCountry: (country) =>
      set({
        selectedCountry: country
      }),

    addWishlist: (id) =>
      set((state) => ({
        wishlist: [...state.wishlist, id]
      })),

    removeWishlist: (id) =>
      set((state) => ({
        wishlist: state.wishlist.filter(
          (v) => v !== id
        )
      })),

    addCompare: (id) =>
      set((state) => ({
        compareVehicles: [
          ...state.compareVehicles,
          id
        ]
      })),

    removeCompare: (id) =>
      set((state) => ({
        compareVehicles:
          state.compareVehicles.filter(
            (v) => v !== id
          )
      }))
  }));
