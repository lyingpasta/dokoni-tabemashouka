"use client";

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
import PlaceDetails from "@/components/place-details";
import { PopupContent } from "@/components/map/popup-content";
import { PlacesContextProvider } from "@/hooks/use-place-context";
import { SearchCriteriaContextProvider } from "@/hooks/use-search-criteria-context";
import { SelectedPlaceContextProvider } from "@/hooks/use-selected-place-context";
import { getNearbyPlaces } from "@/server/api/places";

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });
const MarkerComponent = dynamic(
  () => import("../components/map").then((mod) => mod.MarkerComponent),
  { ssr: false },
);

export default function Home() {
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
    undefined,
  );
  const [query, setQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState(
    categories.map((category) => ({ ...category, isActive: false })),
  );

  const placesContextValue = useMemo(() => nearbyPlaces, [nearbyPlaces]);
  const searchCriteriaContextValue = useMemo(
    () => ({ query, searchFilters, setQuery, setSearchFilters }),
    [query, setQuery, searchFilters, setSearchFilters],
  );
  const selectedPlaceContextValue = useMemo(
    () => ({ selectedPlace, setSelectedPlace }),
    [selectedPlace],
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
    <PlacesContextProvider value={placesContextValue}>
      <div className={styles.page}>
        <div className={styles.container}>
          <SearchCriteriaContextProvider value={searchCriteriaContextValue}>
            <div className={styles.topBar}>
              <FiltersSet />
              <SearchBar />
            </div>
          </SearchCriteriaContextProvider>

          <SelectedPlaceContextProvider value={selectedPlaceContextValue}>
            <div className={styles.content}>
              <div className={styles.mapContainer}>
                <MapComponent
                  center={center}
                  focusPoint={
                    (selectedPlace?.coordinates as LatLngTuple) ?? undefined
                  }
                >
                  {nearbyPlaces.map(buildPlaceMarker)}
                </MapComponent>
              </div>
              <div className={styles.listContainer}>
                <List />
              </div>
            </div>

            <PlaceDetails />
          </SelectedPlaceContextProvider>
        </div>
      </div>
    </PlacesContextProvider>
  );
}

const buildPlaceMarker = (place: Place) => (
  <MarkerComponent
    key={place.id}
    position={place.coordinates as LatLngTuple}
    place={place}
  >
    <PopupContent place={place} />
  </MarkerComponent>
);
