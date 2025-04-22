import React, { useEffect, useState, useRef } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import NavigationSidebar from "./NavigationSidebar";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

const directionsClient = MapboxDirections({ accessToken: MAPBOX_ACCESS_TOKEN });

const iconStyles = {
    "tourism-campingsite": "/assets/camp.png",
    "transport-car": "/assets/parking.png",
    "stores-flowers": "/assets/flowers.png",
    "restaurant-coffee": "/assets/coffee.png",
    "restaurant-restaurant": "/assets/restaurant.png",
    "sport-hiking": "/assets/hiking.png",
    "friends-home": "/assets/home.png",
    "tourism-chapel": "/assets/chapel.png",
    "misc-toilets": "/assets/toilet.png",
    "sport-firstaid": "/assets/firstaid.png",
    "nature-mountains": "/assets/mountain.png",
    "tourism-buddha": "/assets/buddha.png",
    "stores-bookstore": "/assets/bookstore.png",
    "restaurant-hotel": "/assets/placehome.png",
    "tourism-forest": "/assets/viewpoint.png",
};

// รายการ 4 สถานที่ที่ต้องมีลิงก์
const linkPlaces = {
    "ลานหินปุ่ม": "https://portal.dnp.go.th/Content/nationalpark?contentId=1927",
    "โรงเรียนการเมืองทหาร": "https://portal.dnp.go.th/Content/nationalpark?contentId=1924",
    "ลานหินแตก": "https://portal.dnp.go.th/Content/nationalpark?contentId=1923",
    "ผาชูธง": "https://portal.dnp.go.th/Content/nationalpark?contentId=1921"
};

const defaultCoordinates = { lat: 16.991495, lng: 100.996908 };

const NUATM = () => {
    const [data, setData] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [weather, setWeather] = useState(null);
    const [route, setRoute] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [navigationActive, setNavigationActive] = useState(false);
    const watchIdRef = useRef(null);
    const mapRef = useRef(null);
    const [watchId, setWatchId] = useState(null); // สำหรับหยุด watchPosition
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [navigationTarget, setNavigationTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/mypoints`)
            .then((res) => {
                const points = res.data.map((item) => {
                    const geometry = JSON.parse(item.geometry);
                    const [lng, lat] = geometry.coordinates;
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        sym: item.sym,
                        lat,
                        lng,
                        image: item.image
                            ? `${process.env.REACT_APP_API_URL}/uploads/${item.image}`
                            : "/assets/default-marker.png",
                    };
                });
                setData(points);
            });
    }, []);

    useEffect(() => {
        const id = navigator.geolocation.watchPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
        watchIdRef.current = id;
        return () => navigator.geolocation.clearWatch(watchIdRef.current);
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            return;
        }

        const results = data.filter((point) =>
            point.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, data]);

    const fetchWeather = async (lat, lng) => {
        try {
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
            );
            return res.data.main.temp;
        } catch (err) {
            return "N/A";
        }
    };

    const getRoute = async (destination) => {
        console.log("🔁 เรียก getRoute แล้ว", destination);
        if (!userLocation || !destination) {
            console.warn("⚠️ ไม่พบตำแหน่ง user หรือปลายทาง", userLocation, destination);
            return;
        }

        try {
            const res = await directionsClient
                .getDirections({
                    profile: "driving",
                    waypoints: [
                        { coordinates: [userLocation.lng, userLocation.lat] },
                        { coordinates: [destination.lng, destination.lat] },
                    ],
                    geometries: "geojson",
                    overview: "full",
                    steps: false,
                    annotations: ["distance", "duration"]
                })
                .send();

            const coords = res.body.routes[0].geometry.coordinates;
            const dist = res.body.routes[0].distance;
            const dur = res.body.routes[0].duration;

            setRoute(coords);
            setDistance(dist);
            setDuration(dur);
            setNavigationTarget(destination);
            setNavigationActive(true);

            // ย้ายหน้าจอไปยังตำแหน่งผู้ใช้
            mapRef.current?.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 15,
                duration: 1000,
            });
        } catch (err) {
            console.error("❌ เกิดข้อผิดพลาดตอน getRoute:", err);
        }
    };

    const stopNavigation = () => {
        setRoute(null);
        setNavigationActive(false);
    };

    return (
        <div className="map-container">
            <div className="map-search-box">
                <input
                    type="text"
                    placeholder="🔍 ค้นหาสถานที่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchResults.length > 0 && (
                    <div className="map-search-results">
                        {searchResults.map((result) => (
                            <div
                                key={result.id}
                                onClick={() => {
                                    mapRef.current?.flyTo({
                                        center: [result.lng, result.lat],
                                        zoom: 15,
                                        duration: 1000,
                                    });
                                    setSelectedMarker(result);
                                    setSearchTerm("");
                                    setSearchResults([]);
                                }}
                            >
                                📍 {result.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <Map
                interactive={true}
                ref={mapRef}
                initialViewState={{ latitude: defaultCoordinates.lat, longitude: defaultCoordinates.lng, zoom: 13 }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                onClick={() => setSelectedMarker(null)}
            >

                {userLocation && (
                    <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
                        <div style={{
                            width: "14px", height: "14px", borderRadius: "50%", background: "#007aff",
                            border: "2px solid white", boxShadow: "0 0 5px #007aff"
                        }} />
                    </Marker>
                )}

                {data.map((point) => (
                    <Marker
                        key={point.id}
                        longitude={point.lng}
                        latitude={point.lat}
                        onClick={async (e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedMarker(point);
                            const temp = await fetchWeather(point.lat, point.lng);
                            setWeather(temp);
                        }}
                    >
                        <img
                            src={iconStyles[point.sym] || "/assets/default-marker.png"}
                            alt={point.name}
                            style={{ width: "30px", height: "41px", cursor: "pointer" }}
                        />
                    </Marker>
                ))}


                {selectedMarker && (
                    <Popup
                        longitude={selectedMarker.lng}
                        latitude={selectedMarker.lat}
                        closeOnClick={false}
                        onClose={() => {
                            setSelectedMarker(null);
                            setWeather(null);
                        }}
                    >
                        <div style={{ maxWidth: 250 }}>
                            <h3>{selectedMarker.name}</h3>
                            <p>{selectedMarker.description}</p>
                            <p>🌡️ อุณหภูมิ: {weather !== null ? `${weather}°C` : "โหลด..."}</p>
                            <img src={selectedMarker.image} alt="" style={{ width: "100%", borderRadius: "5px" }} />
                            <button
                                style={{ marginTop: 10, width: "100%", backgroundColor: "#28a745", color: "#fff", border: "none", padding: 8, borderRadius: 5 }}
                                onClick={() => getRoute(selectedMarker)}
                            >
                                ▶️ เริ่มนำทาง
                            </button>
                            {navigationActive && (
                                <button
                                    style={{ marginTop: 8, width: "100%", backgroundColor: "#dc3545", color: "#fff", border: "none", padding: 8, borderRadius: 5 }}
                                    onClick={stopNavigation}
                                >
                                    🛑 หยุดนำทาง
                                </button>
                            )}
                            {linkPlaces[selectedMarker.name] && (
                                <a
                                    href={linkPlaces[selectedMarker.name]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "block",
                                        marginTop: 10,
                                        padding: 10,
                                        backgroundColor: "#e0f0ff", // พื้นหลังฟ้าอ่อน
                                        color: "#003366",           // ตัวหนังสือสีเข้ม
                                        fontWeight: "bold",         // ทำให้ตัวหนา
                                        textAlign: "center",
                                        borderRadius: 5,
                                        textDecoration: "none",     // ลบเส้นใต้ลิงก์
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)" // เพิ่มเงาเบาๆ
                                    }}
                                >
                                    🔗 ดูเพิ่มเติม
                                </a>

                            )}
                        </div>
                    </Popup>
                )}

                {route && (
                    <Source
                        id="route"
                        type="geojson"
                        data={{
                            type: "Feature",
                            geometry: { type: "LineString", coordinates: route },
                        }}
                    >
                        <Layer
                            id="route-line"
                            type="line"
                            paint={{ "line-color": "#3b9ddd", "line-width": 5 }}
                        />
                    </Source>
                )}
            </Map>
            {navigationActive && navigationTarget && (
                <NavigationSidebar
                    destination={navigationTarget}
                    distance={distance}
                    duration={duration}
                    onStop={() => {
                        setRoute(null);
                        setNavigationActive(false);
                        setDistance(null);
                        setDuration(null);
                        setSelectedMarker(null);
                        setNavigationTarget(null);
                    }}
                />
            )}
        </div>
    );
};

export default NUATM;
