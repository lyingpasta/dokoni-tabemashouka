import L, { LatLngTuple } from "leaflet";
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
};

export function MarkerComponent({ position, children }: MarkerComponentInput) {
  return (
    <Marker icon={marker} position={position}>
      <Popup>{children}</Popup>
    </Marker>
  );
}
