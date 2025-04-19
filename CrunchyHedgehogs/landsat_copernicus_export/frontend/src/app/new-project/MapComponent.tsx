"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  onLocationSelect: (location: {
    displayName: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}

const MapComponent = ({ onLocationSelect, initialLocation, className }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fix for Leaflet icon URLs
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  // Initialize map
  const initMap = useCallback(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialLocation || [28.12, 78.31],
      zoom: 6,
      renderer: L.canvas()
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true
    }).addTo(map);

    // Add initial marker if location exists
    if (initialLocation && initialLocation.lat !== 0 && initialLocation.lng !== 0) {
      const marker = L.marker([initialLocation.lat, initialLocation.lng]).addTo(map);
      markerRef.current = marker;
    }

    // Handle map clicks
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      const newMarker = L.marker([lat, lng]).addTo(map);
      markerRef.current = newMarker;

      onLocationSelect({
        displayName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        coordinates: { lat, lng }
      });
    };

    map.on('click', handleMapClick);
    mapRef.current = map;

    // Force redraw after initialization
    setTimeout(() => {
      map.invalidateSize({ pan: false });
    }, 0);

    return () => {
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
    };
  }, [isMounted, initialLocation, onLocationSelect]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted) {
      initMap();
    }
  }, [isMounted, initMap]);

  // Handle window resize
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize({ pan: false });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  return (
    <div 
      ref={mapContainerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        cursor: 'pointer'
      }}
    />
  );
};

export default MapComponent;