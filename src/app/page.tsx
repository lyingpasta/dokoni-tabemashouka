"use client";

import { getNearbyPlaces } from "@/infrastructure/api/places";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import List from "@/components/list";
import SearchBar from "@/components/search";
import FiltersSet from "@/components/filter";
import {
  categories,
  DINING_AND_DRINKING_CATEGORY_ID,
} from "@/domain/value-objects/categories";
import { center } from "@/domain/value-objects/places";
import { Place } from "@/domain/entities/place";
import { LatLngTuple } from "leaflet";
import { PlacesContext } from "@/infrastructure/context/places-context.provider";
import { SearchCriteriaContext } from "@/infrastructure/context/seach-criteria-context.provider";

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });
const MarkerComponent = dynamic(
  () => import("../components/map").then((mod) => mod.MarkerComponent),
  { ssr: false },
);

export default function Home() {
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState(
    categories.map((category) => ({ ...category, isActive: false })),
  );

  const placesContextValue = useMemo(() => nearbyPlaces, [nearbyPlaces]);
  const searchCriteriaContextValue = useMemo(
    () => ({ query, searchFilters, setQuery, setSearchFilters }),
    [query, setQuery, searchFilters, setSearchFilters],
  );

  const getActiveFilterCategoryIds = useCallback(
    (): string[] =>
      searchFilters
        .filter((filter) => filter.isActive)
        .map((filter) => filter.id),
    [searchFilters],
  );

  useEffect(() => {
    const categoriesToSearch = getActiveFilterCategoryIds();
    getNearbyPlaces(
      [center[0], center[1]],
      categoriesToSearch.length < 1
        ? [DINING_AND_DRINKING_CATEGORY_ID]
        : categoriesToSearch,
      query,
    ).then((res) => setNearbyPlaces(res));
  }, [query, searchCriteriaContextValue, getActiveFilterCategoryIds]);

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
              <MapComponent center={center}>
                {nearbyPlaces.map(makePlaceMarker)}
              </MapComponent>
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

const makePlaceMarker = (place: Place) => (
  <MarkerComponent key={place.id} position={place.coordinates as LatLngTuple}>
    <div>{place.name}</div>
  </MarkerComponent>
);
