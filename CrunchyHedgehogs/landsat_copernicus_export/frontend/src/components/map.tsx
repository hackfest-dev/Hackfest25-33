"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet's default marker icon path fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ center, onLocationSelect }) => {  

  const [position, setPosition] = useState(center);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setPosition(center);
  }, [center]);

  const MapEvents = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onLocationSelect({ lat, lng });
      }
    });
    return null;
  };

  useEffect(() => {
    if (mapRef.current && markerPosition) {
        mapRef.current.flyTo(markerPosition, 13);
    }
  }, [markerPosition]);

  return (
    <MapContainer
        ref={mapRef}
        center={position}
        zoom={13}
        style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />
        {markerPosition && (
            <Marker position={markerPosition}>
                <Popup>Clicked location: {markerPosition.lat}, {markerPosition.lng}</Popup>
            </Marker>
        )}
    </MapContainer>
  );
};
export default Map;


