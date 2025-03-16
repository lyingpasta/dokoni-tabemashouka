import { Place } from "@/domain/entities/place";
import { createContext } from "react";

type SelectedPlaceContextType = {
  selectedPlace?: Place;
  setSelectedPlace: (p: Place) => void;
};

export const SelectedPlaceContext = createContext<SelectedPlaceContextType>({
  setSelectedPlace: () => {},
});
