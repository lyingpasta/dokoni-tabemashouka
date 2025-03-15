"use client";

import { getNearbyPlaces } from "@/infrastructure/api/places";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { createContext, useEffect, useMemo, useState } from "react";
import List from "@/components/list";
import SearchBar from "@/components/search";
import FiltersSet from "@/components/filter";
import {
  categories,
  DINING_AND_DRINKING_CATEGORY_ID,
} from "@/domain/value-objects/categories";
import { center } from "@/domain/value-objects/places";

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

export const PlacesContext = createContext([]);
export const SearchCriteriaContext = createContext({
  query: "",
  setQuery: (_: any) => {},
  searchFilters: categories.map((category) => ({
    ...category,
    isActive: false,
  })),
  setSearchFilters: (_: any) => {},
});

export default function Home() {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState(
    categories.map((category) => ({ ...category, isActive: false })),
  );

  const placesContextValue = useMemo(() => nearbyPlaces, [nearbyPlaces]);
  const searchCriteriaContextValue = useMemo(
    () => ({ query, searchFilters, setQuery, setSearchFilters }),
    [query, setQuery, searchFilters, setSearchFilters],
  );

  const getActiveFilterCategoryIds = (): string[] =>
    searchFilters
      .filter((filter) => filter.isActive)
      .map((filter) => filter.id);

  useEffect(() => {
    const categoriesToSearch = getActiveFilterCategoryIds();
    getNearbyPlaces(
      [center[0], center[1]],
      categoriesToSearch.length < 1
        ? [DINING_AND_DRINKING_CATEGORY_ID]
        : categoriesToSearch,
      query,
    ).then((p) => setNearbyPlaces(p));
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
