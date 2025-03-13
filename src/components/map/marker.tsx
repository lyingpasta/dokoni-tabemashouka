import { Marker, Popup } from "react-leaflet";

export function MarkerComponent() {
  return (
    <Marker position={[35.6646782, 139.7378198]}>
      <Popup>
        A pretty CSS3 popup. < br /> Easily customizable.
      </Popup>
    </Marker>
  )
}
