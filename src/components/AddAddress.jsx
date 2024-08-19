'use client'
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import {ChevronLeft, MapPin, Crosshair, HomeIcon, CakeIcon, PlusCircleIcon} from 'lucide-react';
import Image from "next/image";
import {useRouter} from "next/navigation";

const provider = new OpenStreetMapProvider({
    params: {
        countrycodes: 'iq',
        'accept-language': 'ar',
    },
});

const AddressMap = ({ onLocationChange }) => {
    const map = useMap();
    const searchControlRef = useRef(null);

    useEffect(() => {
        if (!searchControlRef.current) {
            searchControlRef.current = new SearchControl({
                provider: provider,
                style: 'bar',
                showMarker: true,
                showPopup: false,
                autoClose: true,
                retainZoomLevel: false,
                animateZoom: true,
                keepResult: true,
                searchLabel: 'Search location',
            });
            map.addControl(searchControlRef.current);
        }

        return () => {
            if (searchControlRef.current) {
                map.removeControl(searchControlRef.current);
            }
        };
    }, [map]);

    const handleClick = (e) => {
        onLocationChange(e.latlng);
    };

    map.on('click', handleClick);

    return null;
};

export default function AddAddress() {
    const [location, setLocation] = useState({ lat: 33.3152, lng: 44.3661 });
    const [addressType, setAddressType] = useState('');
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const mapRef = useRef(null);
    const router = useRouter()

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
    };

    const detectCurrentLocation = () => {
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
                    maximumAge: 0
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
            setIsDetectingLocation(false);
        }
    };

    return (
        <div className="bg-white font-sans">
            <div className="flex items-center mb-6">
                <button onClick={router.back} className="relative z-20">
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1
                    className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-bold">
                    Add Address
                </h1>
            </div>

            <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">Your Location On Map</h2>
                <div className="h-96 mb-4 relative">
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
                        <Marker position={[location.lat, location.lng]}/>
                        <AddressMap onLocationChange={handleLocationChange}/>
                    </MapContainer>
                    <button
                        onClick={detectCurrentLocation}
                        className="absolute top-2 right-2 z-[1000] p-2 bg-white rounded-md shadow-md"
                        disabled={isDetectingLocation}
                    >
                        <Crosshair className="h-5 w-5"/>
                    </button>
                </div>

                <div className="flex font-medium space-x-2 mb-4">
                    <button
                        className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                            addressType === "home" ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setAddressType("home")}
                    >
                        <HomeIcon className="mr-2 h-4 w-4"/> Home
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                            addressType === "work" ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setAddressType("work")}
                    >
                        <Image src={"/work.svg"} width={16} height={16} className="mr-2" alt={"work"}/> Work
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                            addressType === "other" ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setAddressType("other")}
                    >
                        <PlusCircleIcon className="mr-2 h-4 w-4"/> Other
                    </button>
                </div>

                <form className="space-y-4 font-serif font-normal">
                    <input className="w-full p-3 border rounded-md" placeholder="Full Name"/>
                    <select className="w-full p-3 border bg-white rounded-md appearance-none">
                        <option value="" disabled={true} selected={true} hidden={true}>Governate</option>
                        <option value="baghdad">Baghdad</option>
                        <option value="basra">Basra</option>
                        <option value="mosul">Mosul</option>
                    </select>
                    <input className="w-full p-3 border rounded-md" placeholder="City"/>
                    <input className="w-full p-3 border rounded-md" placeholder="Address"/>
                    <input className="w-full p-3 border rounded-md" placeholder="The closest point of a function"/>
                    <input className="w-full p-3 border rounded-md" placeholder="Phone Number"/>
                    <button className="w-full p-3 bg-[#3B5345] text-white rounded-md">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}