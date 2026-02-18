"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }: { position: L.LatLngExpression, setPosition: (pos: L.LatLng) => void }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position as L.LatLngTuple, map.getZoom());
    }, [position, map]);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} draggable={true} eventHandlers={{
            dragend: (e) => {
                setPosition(e.target.getLatLng());
            }
        }} />
    );
}

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

export default function LocationPicker({ onLocationSelect, initialLat = 11.2588, initialLng = 75.7804 }: LocationPickerProps) {
    // Default to Kerala/Nilambur area if no initial pos
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng));

    useEffect(() => {
        // Try to get current user location on mount if no initial passed
        if (navigator.geolocation && (initialLat === 11.2588)) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition(new L.LatLng(latitude, longitude));
            });
        }
    }, [initialLat]);

    useEffect(() => {
        onLocationSelect(position.lat, position.lng);
    }, [position, onLocationSelect]);

    return (
        <div className="h-[400px] w-full rounded-md overflow-hidden border border-white/10 relative z-0">
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>

            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur text-white p-2 rounded text-center text-xs z-[1000] pointer-events-none">
                Drag marker or click map to set location
            </div>
        </div>
    );
}
