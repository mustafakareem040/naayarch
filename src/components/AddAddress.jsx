'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { ChevronLeft, MapPin, Maximize2, Search, Crosshair, X } from 'lucide-react';
import debounce from 'lodash/debounce';

const provider = new OpenStreetMapProvider({
    params: {
        countrycodes: 'iq', // ISO 3166-1alpha2 code for Iraq,
        'accept-language': 'ar',
        addressDetails: 1,
        enableHighAccuracy: true,
        setView: true,

    },
});

const SearchControl = ({ onLocationFound }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const map = useMap();

    const debouncedSearch = useRef(
        debounce(async (value) => {
            if (value.length > 2) {
                setIsSearching(true);
                setNoResults(false);
                const results = await provider.search({ query: value });
                setIsSearching(false);
                if (results.length === 0) {
                    setNoResults(true);
                } else {
                    setSuggestions(results.slice(0, 5));
                }
            } else {
                setSuggestions([]);
                setNoResults(false);
            }
        }, 300)
    ).current;

    const handleSearch = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (query) {
            setIsSearching(true);
            setNoResults(false);
            const results = await provider.search({ query });
            setIsSearching(false);
            if (results.length > 0) {
                const { x, y } = results[0];
                map.setView([y, x], 13);
                onLocationFound({ lat: y, lng: x });
            } else {
                setNoResults(true);
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSuggestionClick = (result) => {
        const { x, y } = result;
        map.setView([y, x], 13);
        onLocationFound({ lat: y, lng: x });
        setQuery(result.label);
        setSuggestions([]);
    };

    return (
        <div className="absolute top-2 left-0 m-auto right-0 z-[1000] bg-white p-2 rounded-lg shadow-lg w-72">
            <form onSubmit={handleSearch} className="relative">
                <input
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search location..."
                    className="w-full p-2 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                    <Search className="h-5 w-5" />
                </button>
            </form>
            {isSearching && <p className="mt-2 text-sm text-gray-600">Searching...</p>}
            {noResults && <p className="mt-2 text-sm text-red-500">No results found</p>}
            {suggestions.length > 0 && (
                <ul className="mt-2 bg-white border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {suggestions.map((result, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(result)}
                            className="p-2 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                        >
                            {result.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const MapEvents = ({ onLocationChange }) => {
    const map = useMapEvents({
        click(e) {
            onLocationChange(e.latlng);
        },
    });
    return null;
};

export default function AddAddress() {
    const [location, setLocation] = useState({ lat: 33.3152, lng: 44.3661 });
    const [addressType, setAddressType] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        detectCurrentLocation();
    }, []);

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
    };

    const toggleFullScreen = (e) => {
        e.stopPropagation();
        setIsFullScreen(!isFullScreen);
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 100);
    };

    const detectCurrentLocation = (e) => {
        if (e) e.stopPropagation();
        setIsDetectingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setLocation(newLocation);
                    if (mapRef.current) {
                        mapRef.current.setView([newLocation.lat, newLocation.lng], 13);
                    }
                    setIsDetectingLocation(false);
                },
                (error) => {
                    console.error('Error detecting location:', error);
                    setIsDetectingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    animate: true,
                    setView: true,
                    maximumAge: 0
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
            setIsDetectingLocation(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow">
                <button className="mr-4 hover:bg-gray-200 p-2 rounded-full transition duration-150 ease-in-out">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add Address</h1>
            </div>

            <div className={`mb-6 relative bg-white rounded-lg shadow-lg overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : 'h-[400px]'}`}>
                <h2 className="text-lg font-semibold mb-2 p-4 bg-gray-50">Your Location On Map</h2>
                <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={13}
                    className="w-full h-full"
                    attributionControl={false}
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution=''
                    />
                    <Marker position={[location.lat, location.lng]} />
                    <MapEvents onLocationChange={handleLocationChange} />
                    <SearchControl onLocationFound={handleLocationChange} />
                    <div className="leaflet-top leaflet-right">
                        <div className="leaflet-control leaflet-bar">
                            <button
                                onClick={toggleFullScreen}
                                className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition duration-150 ease-in-out"
                                style={{ display: 'block', margin: '10px' }}
                            >
                                {isFullScreen ? <X className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={detectCurrentLocation}
                                className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition duration-150 ease-in-out"
                                style={{ display: 'block', margin: '10px' }}
                            >
                                <Crosshair className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </MapContainer>
            </div>

            <div className="flex space-x-4 mb-6">
                {['home', 'work', 'other'].map((type) => (
                    <button
                        key={type}
                        className={`flex-1 flex items-center justify-center px-4 py-3 border rounded-lg transition duration-150 ease-in-out ${
                            addressType === type ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setAddressType(type)}
                    >
                        <MapPin className="mr-2 h-5 w-5" /> {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <form className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Full Name" />
                <select className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Governorate</option>
                    <option value="baghdad">Baghdad</option>
                    <option value="basra">Basra</option>
                    <option value="mosul">Mosul</option>
                </select>
                <input className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="City" />
                <input className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Address" />
                <input className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="The closest point of a function" />
                <input className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Phone Number" />
                <button className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-150 ease-in-out">
                    Save
                </button>
            </form>
        </div>
    );
}