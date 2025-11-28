import {
    DonationItem,
    DonationItemStatus,
    DonationRequest,
} from "@/types/donations";
import { InventoryRecord } from "@/types/inventory";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons/CloseIcon";
import { Badge } from "../Badge";

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

type ItemReviewModalProps = {
    item: DonationItem;
    dr: DonationRequest;
    onClose: () => void;
    setStatus: (status: DonationItemStatus) => void;
};

export function ItemReviewModal({
    dr,
    item,
    onClose,
    setStatus,
    
}: ItemReviewModalProps) {

    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const [mapError, setMapError] = useState<string | null>(null);

   const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
        const token = mapboxgl.accessToken;
        const encoded = encodeURIComponent(address);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (!data.features?.length) return null;
            
            const feature = data.features[0];
            
            const requirements = ['address'];
            const hasAcceptableType = feature.place_type?.some((type: string) => 
                requirements.includes(type)
            );
            
            if (!hasAcceptableType) {
                console.log("geocoding result not doing address", feature.place_type);
                return null;
            }
            
            return feature.center as [number, number];

        } catch (err) {
            console.error("geocoding failed:", err);
            return null;
        }
    };
   
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = "pk.eyJ1Ijoic2FyYWozMyIsImEiOiJjbWlodWUxdjEwZm8zM2twcHhwY2ZkZzlyIn0.GDgfh2-z2vMiUG_tgvTRGA";

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-72.7, 41.5], //default to connecticut
            zoom: 8,
        });
        
        mapRef.current = map;

        map.on("load", async () => {
            const fullAddress = `${dr.donor.address.streetAddress}, ${dr.donor.address.city}, ${dr.donor.address.state} ${dr.donor.address.zipCode}`;

            const coords = await geocodeAddress(fullAddress);

            if (coords) {
                map.setCenter(coords);
                map.setZoom(15);

                if (markerRef.current) {
                    markerRef.current.remove();
                }
                
                markerRef.current = new mapboxgl.Marker()
                    .setLngLat(coords)
                    .addTo(map);

            } else {
                setMapError("Unable to locate address on map.");
            }
        });

        return () => {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
            map.remove();
            mapRef.current = null;
        }
    }, [dr.donor.address]);
    
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto overflow-y-auto">
                <div className="bg-white w-full h-full flex">
                    <div className="flex-1 border-light-border justify-center flex items-center bg-gray-100">
                        {item.item.photos.length > 0 ? (
                            <img
                                className="max-w-full max-h-full"
                                src={item.item.photos[0].url}
                            />
                        ) : null}
                    </div>
                    <div className="w-[30em] p-10 flex flex-col overflow-y-auto">
                        <div className="flex">
                            <span className="font-semibold text-xl">
                                {item.item.name}
                            </span>
                            <button
                                className="ml-auto text-2xl"
                                onClick={onClose}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="text-xs flex gap-2 my-2">
                            <Badge text={item.item.category} color="blue" />
                            <Badge
                                text={item.item.size}
                                color={
                                    item.item.size == "Large"
                                        ? "pink"
                                        : item.item.size == "Medium"
                                        ? "purple"
                                        : "yellow"
                                }
                            />
                            <Badge
                                text={item.item.quantity.toString()}
                                color="orange"
                            />
                        </div>
                        <span className="text-[#A2A2A2] text-sm font-family-opensans mb-6">
                            {item.item.dateAdded
                                .toDate()
                                .toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                        </span>
                        <span className="font-semibold">Item Notes</span>
                        <span className="mb-5">{item.item.notes}</span>

                        <span className="font-semibold mb-1">Donor Info</span>
                        <div className="flex gap-4 mb-5">
                            <div className="flex justify-center items-center">
                                <img
                                    className="h-16 w-16"
                                    src="/DefaultProfilePicture.png"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span>
                                    {dr.donor.firstName} {dr.donor.lastName}
                                </span>
                                <a
                                    href={`mailto:${dr.donor.email}`}
                                    className="text-blue-500 underline"
                                >
                                    {dr.donor.email}
                                </a>
                                <span>{dr.donor.phoneNumber}</span>
                            </div>
                        </div>

                        <span className="font-semibold mb-2">
                            Donor Address
                        </span>
                        <span className="text-sm">
                            {dr.donor.address.streetAddress}
                        </span>
                        <span className="text-sm">
                            {dr.donor.address.city}, {dr.donor.address.state}{" "}
                            {dr.donor.address.zipCode}
                        </span>
                        
                        {/*map*/}
                        <div className="mt-5 w-full h-60 relative rounded-md overflow-hidden border border-gray-300">
                            <div
                                id="map-container"
                                ref={mapContainerRef}
                                className="w-full h-full"
                            />
                            {mapError && (
                                <div className="absolute top-2 left-2 bg-red-100 text-red-700 px-3 py-1 rounded text-xs">
                                    {mapError}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-8">
                            <button
                                className="text-sm bg-primary rounded-xs h-8 px-4 text-white"
                                onClick={() => setStatus("Approved")}
                            >
                                Approve
                            </button>
                            <button
                                className="text-sm rounded-xs h-8 px-4 border border-light-border"
                                onClick={() => setStatus("Denied")}
                            >
                                Deny
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
