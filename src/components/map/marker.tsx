import { Place } from "@/domain/entities/place";
import { SelectedPlaceContext } from "@/infrastructure/context/selected-place-context.provider";
import L, { LatLngTuple } from "leaflet";
import { useContext } from "react";
import { Marker, Popup } from "react-leaflet";

const marker = new L.Icon({
  iconUrl: "/marker.svg",
  iconSize: new L.Point(40, 40),
});

export function SelfPositionMarkerComponent({
  position,
}: {
  position: LatLngTuple;
}) {
  return <MarkerComponent position={position}>You are here!</MarkerComponent>;
}

type MarkerComponentInput = {
  position: LatLngTuple;
  children: React.ReactNode;
  place?: Place;
};

export function MarkerComponent({
  position,
  children,
  place,
}: MarkerComponentInput) {
  const { setSelectedPlace } = useContext(SelectedPlaceContext);

  const handleClick = () => place && setSelectedPlace(place);

  return (
    <Marker
      icon={marker}
      position={position}
      autoPanOnFocus={true}
      riseOnHover={true}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>{children}</Popup>
    </Marker>
  );
}
