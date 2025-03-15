"use client";

import { getNearbyPlaces } from "@/infrastructure/api/places";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { createContext, useEffect, useMemo, useState } from "react";
import List from "@/components/list";
import SearchBar from "@/components/search";
import { LatLngTuple } from "leaflet";
import FiltersSet from "@/components/filter";

const DINING_AND_DRINKING_CATEGORY_ID = 13000;
const center: LatLngTuple = [35.6646782, 139.7378198];
const MapComponent = dynamic(() => import("../components/map"), { ssr: false });
export const PlacesContext = createContext([]);
export const SearchCriteriaContext = createContext({ query: "", setQuery: (_: any) => {} })

export default function Home() {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [query, setQuery] = useState("")

  const placesContextValue = useMemo(() => nearbyPlaces, [nearbyPlaces])
  const searchCriteriaContextValue = useMemo(() => ({query, setQuery}), [query, setQuery])

  useEffect(() => {
    getNearbyPlaces([center[0], center[1]], [DINING_AND_DRINKING_CATEGORY_ID], query).then((p) =>
      setNearbyPlaces(p),
    );
  }, [searchCriteriaContextValue]);

  return (
    <PlacesContext.Provider value={placesContextValue}>
      <div className={styles.page}>
        <div className={styles.container}>
          <SearchCriteriaContext.Provider value={searchCriteriaContextValue}>
            <div className={styles.topBar}>
              <FiltersSet />
              <SearchBar />
            </div>
          </SearchCriteriaContext.Provider>
          <div className={styles.content}>
            <div className={styles.mapContainer}>
              <MapComponent center={center}></MapComponent>
            </div>
            <div className={styles.listContainer}>
              <List />
            </div>
          </div>
        </div>
      </div>
    </PlacesContext.Provider>
  );
}
