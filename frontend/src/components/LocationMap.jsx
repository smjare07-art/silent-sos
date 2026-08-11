import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import {
  useEffect,
} from "react";

function RecenterMap({
  latitude,
  longitude,
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [latitude, longitude],
      map.getZoom(),
      {
        animate: true,
      }
    );
  }, [
    latitude,
    longitude,
    map,
  ]);

  return null;
}

function LocationMap({
  latitude,
  longitude,
  accuracy,
}) {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return null;
  }

  const position = [
    latitude,
    longitude,
  ];

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom
      className="location-map"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {accuracy && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.08,
            weight: 1,
          }}
        />
      )}

      <Marker position={position}>
        <Popup>
          Your current location
          <br />
          Accuracy:{" "}
          {accuracy
            ? `±${Math.round(
                accuracy
              )} m`
            : "Unknown"}
        </Popup>
      </Marker>

      <RecenterMap
        latitude={latitude}
        longitude={longitude}
      />
    </MapContainer>
  );
}

export default LocationMap;