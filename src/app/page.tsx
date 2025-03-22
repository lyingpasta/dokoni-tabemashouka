"use client";

import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import List from "@/components/list";
import SearchBar from "@/components/search";
import FiltersSet, {
  filterValues,
  getActiveFilters,
} from "@/components/filter";
import { center } from "@/domain/value-objects/places";
import { Place } from "@/domain/entities/place";
import { LatLngTuple } from "leaflet";
import PlaceDetails from "@/components/place-details";
import { PopupContent } from "@/components/map/popup-content";
import { PlacesContextProvider } from "@/hooks/use-place-context";
import { SearchCriteriaContextProvider } from "@/hooks/use-search-criteria-context";
import { SelectedPlaceContextProvider } from "@/hooks/use-selected-place-context";
import RandomizeButton from "@/components/randomize";
import { usePlaces } from "@/hooks/use-places";
import { Loader } from "@/components/loader/loader";
import Error from "@/components/error";
import { QueryClientProviders } from "./providers";

// dynamic imports without SSR, important for Map
const MapComponent = dynamic(() => import("../components/map"), { ssr: false });
const MarkerComponent = dynamic(
  () => import("../components/map").then((mod) => mod.MarkerComponent),
  { ssr: false },
);

export default function Home() {
  return (
    <QueryClientProviders>
      <HomeContent />
    </QueryClientProviders>
  );
}

function HomeContent() {
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(
    undefined,
  );
  const [query, setQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState(
    filterValues.map((filter) => ({ ...filter, isActive: false })),
  );

  const {
    data: nearbyPlaces = [],
    isLoading,
    isError,
  } = usePlaces({
    query,
    ...getActiveFilters(searchFilters),
  });

  const placesContextValue = useMemo(() => nearbyPlaces, [nearbyPlaces]);
  const searchCriteriaContextValue = useMemo(
    () => ({ query, searchFilters, setQuery, setSearchFilters }),
    [query, setQuery, searchFilters, setSearchFilters],
  );
  const selectedPlaceContextValue = useMemo(
    () => ({ selectedPlace, setSelectedPlace }),
    [selectedPlace],
  );

  return (
    <PlacesContextProvider value={placesContextValue}>
      <div className={styles.page}>
        <div className={styles.container}>
          <SelectedPlaceContextProvider value={selectedPlaceContextValue}>
            <SearchCriteriaContextProvider value={searchCriteriaContextValue}>
              <ActionBar />
            </SearchCriteriaContextProvider>

            <div className={styles.content}>
              <Map
                center={center}
                focusPoint={
                  selectedPlace && (selectedPlace.coordinates as LatLngTuple)
                }
                nearbyPlaces={nearbyPlaces}
              />
              <PlacesList
                places={nearbyPlaces}
                isLoading={isLoading}
                isError={isError}
              />
            </div>

            <PlaceDetails />
          </SelectedPlaceContextProvider>
        </div>
      </div>
    </PlacesContextProvider>
  );
}

const ActionBar = () => (
  <div className={styles.topBar}>
    <FiltersSet />
    <RandomizeButton />
    <SearchBar />
  </div>
);

const Map = ({
  center,
  focusPoint,
  nearbyPlaces,
}: {
  center: LatLngTuple;
  focusPoint?: LatLngTuple;
  nearbyPlaces: Place[];
}) => (
  <div className={styles.mapContainer}>
    <MapComponent center={center} focusPoint={focusPoint}>
      {nearbyPlaces.map(buildPlaceMarker)}
    </MapComponent>
  </div>
);

const PlacesList = ({
  places,
  isLoading,
  isError,
}: {
  places: Place[];
  isLoading: boolean;
  isError: boolean;
}) => (
  <div className={styles.listContainer}>
    {isLoading ? (
      <div className={styles.status}>
        <Loader />
      </div>
    ) : isError ? (
      <div className={styles.status}>
        <Error message="Sorry! We couldn't retrieve nearby places..." />
      </div>
    ) : (
      <List places={places} />
    )}
  </div>
);

const buildPlaceMarker = (place: Place) => (
  <MarkerComponent
    key={place.id}
    position={place.coordinates as LatLngTuple}
    place={place}
  >
    <PopupContent place={place} />
  </MarkerComponent>
);
