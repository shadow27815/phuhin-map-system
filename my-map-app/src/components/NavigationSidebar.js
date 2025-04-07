import React, { useState, useEffect } from "react";

const useIsMobile = () => window.innerWidth <= 768;

const NavigationSidebar = ({ destination, distance, duration, onStop }) => {
    const [isMobile, setIsMobile] = useState(useIsMobile());
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!destination || !distance || !duration) return null;

    const containerStyle = {
        position: "absolute",
        zIndex: 999,
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        transition: "transform 0.3s ease-in-out",
        ...(isMobile
            ? {
                bottom: 0,
                left: 0,
                right: 0,
                padding: "15px",
                transform: isOpen ? "translateY(0)" : "translateY(100%)",
            }
            : {
                top: 20,
                left: isOpen ? 20 : -280,
                width: "260px",
                padding: "15px",
            }),
    };

    const toggleButtonStyle = {
        position: "absolute",
        background: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        ...(isMobile
            ? {
                top: -40,
                left: "calc(50% - 20px)",
                width: 40,
                height: 30,
                borderRadius: "10px 10px 0 0",
            }
            : {
                top: 0,
                right: -30,
                width: 30,
                height: 30,
                borderRadius: "5px 0 0 5px",
            }),
    };

    return (
        <div style={containerStyle}>
            <button style={toggleButtonStyle} onClick={() => setIsOpen(!isOpen)}>
                {isMobile ? (isOpen ? "▾" : "▴") : isOpen ? "◀" : "▶"}
            </button>
            <h3>🚗 กำลังนำทาง</h3>
            <p><strong>ไปยัง:</strong> {destination.name}</p>
            <p><strong>ระยะทาง:</strong> {(distance / 1000).toFixed(2)} กม.</p>
            <p><strong>เวลาโดยประมาณ:</strong> {Math.ceil(duration / 60)} นาที</p>
            <button
                style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "100%",
                    marginTop: "10px",
                    cursor: "pointer"
                }}
                onClick={onStop}
            >
                🛑 หยุดนำทาง
            </button>
        </div>
    );
};

export default NavigationSidebar;
