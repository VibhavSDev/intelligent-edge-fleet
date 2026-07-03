import mapboxgl from 'mapbox-gl';
import type { vehicleTelemetry } from '../hooks/useWebSockets';
import type React from 'react';
import { useEffect, useRef } from 'react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapViewProps {
    fleet: vehicleTelemetry[];
}

export const MapView: React.FC<MapViewProps> = ({ fleet }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if(!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-73.9950, 40.7180],
            zoom: 13
        });

        mapRef.current.on('load', () => {
            mapRef.current?.addSource('fleet-source', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] }
            });

            mapRef.current?.addLayer({
                id: 'fleet-layer',
                type: 'circle',
                source: 'fleet-source',
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#ff3333',
                    'circle-stroke-color': '#ffffff'
                }
            });
        });

        return () => mapRef.current?.remove();
    }, []);

    useEffect(() => {
        if(!mapRef.current || !mapRef.current.isStyleLoaded()) return;

        const source = mapRef.current.getSource('fleet-source') as mapboxgl.GeoJSONSource;
        if(!source) return;

        const features = fleet.map((vehicle) => ({
            type: 'Feature' as const,
            geometry: {
                type: 'Point' as const,
                coordinates: [vehicle.lng, vehicle.lat]
            },
            properties: {
                id: vehicle.vehicle_id
            },
        }));

        source.setData({
            type: 'FeatureCollection',
            features
        });
    }, [fleet]);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
}
