import { Place } from "@/domain/entities/place";
import { createContext, useContext } from "react";

export const PlacesContext = createContext<Place[]>([]);

export const PlacesContextProvider = PlacesContext.Provider

export const usePlacesContext = () => useContext(PlacesContext)
