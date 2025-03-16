import { Place } from "@/domain/entities/place";
import { createContext } from "react";

export const PlacesContext = createContext<Place[]>([]);
