import { Circle, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { SelfPositionMarkerComponent } from "./marker";

type MapComponentInput = {
  center: LatLngTuple;
  children: React.ReactNode;
};

export function MapComponent({
  center,
  children,
}: Readonly<MapComponentInput>) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={center}
        radius={1000}
        fillColor="#dec6ff"
        fillOpacity={0.3}
        color="#ab5cff"
        opacity={0.6}
      ></Circle>
      <SelfPositionMarkerComponent
        position={center}
      ></SelfPositionMarkerComponent>
      {children}
    </MapContainer>
  );
}
