import { Place } from "@/domain/entities/place";
import { useSelectedPlaceContext } from "@/hooks/use-selected-place-context";
import L, { LatLngTuple } from "leaflet";
import { Marker, Popup } from "react-leaflet";

const standardMarkerIcon = new L.Icon({
  iconUrl: "/marker.svg",
  iconSize: new L.Point(40, 40),
});

const selectedMarkerIcon = new L.Icon({
  iconUrl: "/selected-marker.svg",
  iconSize: new L.Point(40, 40),
});

const selfMarkerIcon = new L.Icon({
  iconUrl: "/self-marker.svg",
  iconSize: new L.Point(40, 40),
});

type MarkerComponentInput = {
  position: LatLngTuple;
  children: React.ReactNode;
  icon?: L.Icon;
  place?: Place;
};

export function MarkerComponent({
  position,
  children,
  icon,
  place,
}: MarkerComponentInput) {
  const { selectedPlace, setSelectedPlace } = useSelectedPlaceContext();

  const markerIcon = icon ?? (selectedPlace?.id === place?.id ? selectedMarkerIcon : standardMarkerIcon)

  const handleClick = () => place && setSelectedPlace(place);

  return (
    <Marker
      icon={markerIcon}
      position={position}
      autoPanOnFocus={true}
      riseOnHover={true}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>{children}</Popup>
    </Marker>
  );
}

export function SelfPositionMarkerComponent({
  position,
}: {
  position: LatLngTuple;
}) {
  return <MarkerComponent position={position} icon={selfMarkerIcon}>You are here!</MarkerComponent>;
}


