import { Circle, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MarkerComponent } from "./marker";
import { LatLngTuple } from "leaflet";

type MapComponentInput = {
  center: LatLngTuple;
};

export function MapComponent({ center }: MapComponentInput) {
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
      <MarkerComponent></MarkerComponent>
    </MapContainer>
  );
}
