import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ position, setPosition }) {
    const map = useMap();

    useEffect(() => {
        if (map && position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    setPosition(e.target.getLatLng());
                },
            }}
        />
    );
}

export default function MapComponent({ position, setPosition }) {
    const [key, setKey] = useState(0);

    useEffect(() => {
        // Force re-render of MapContainer when position changes
        setKey(prevKey => prevKey + 1);
    }, [position]);

    // Cleanup function to remove the map and its event listeners
    useEffect(() => {
        let map;
        const cleanup = () => {
            if (map) {
                map.off(); // Remove all event listeners
                map.remove(); // Remove the map instance
            }
        };

        return cleanup;
    }, [key]); // Run cleanup when key changes, indicating a new map instance is created

    if (!position) {
        return <div>Loading map...</div>;
    }

    return (
        <MapContainer
            key={key}
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(mapInstance) => {
                console.log('Map created');
                map = mapInstance; // Save map instance to use in cleanup
            }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
    );
}
