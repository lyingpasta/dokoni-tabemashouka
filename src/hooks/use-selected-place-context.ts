import { Place } from "@/domain/entities/place";
import { createContext, useContext } from "react";

type SelectedPlaceContextType = {
  selectedPlace?: Place;
  setSelectedPlace: (p: Place) => void;
};

export const SelectedPlaceContext = createContext<SelectedPlaceContextType>({
  setSelectedPlace: () => {},
});

export const SelectedPlaceContextProvider = SelectedPlaceContext.Provider;

export const useSelectedPlaceContext = () => useContext(SelectedPlaceContext);
