import React, { useState } from 'react';

// รายการไอคอนและความหมาย (อ้างอิงจาก Database ของพี่)
const legendItems = [
    { icon: "/assets/home.png", label: "ที่ทำการ/ศูนย์บริการ" },
    { icon: "/assets/hiking.png", label: "แหล่งท่องเที่ยว/จุดเดินเท้า" },
    { icon: "/assets/viewpoint.png", label: "จุดชมวิว/ธรรมชาติ" },
    { icon: "/assets/camp.png", label: "ลานกางเต็นท์" },
    { icon: "/assets/placehome.png", label: "บ้านพักอุทยาน" },
    { icon: "/assets/parking.png", label: "ลานจอดรถ" },
    { icon: "/assets/restaurant.png", label: "ร้านอาหาร" },
    { icon: "/assets/coffee.png", label: "ร้านกาแฟ" },
    { icon: "/assets/toilet.png", label: "ห้องน้ำ" },
    { icon: "/assets/firstaid.png", label: "ศูนย์พยาบาล" },
    { icon: "/assets/flowers.png", label: "ทุ่งดอกไม้" },
    { icon: "/assets/mountain.png", label: "หน้าผา/ภูเขา" },
    { icon: "/assets/buddha.png", label: "ศาลา/สิ่งศักดิ์สิทธิ์" },
    { icon: "/assets/chapel.png", label: "สุสาน/อนุสรณ์" },
    { icon: "/assets/bookstore.png", label: "จุดแสดงข้อมูล" }
];

const MapLegend = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* 1. ปุ่ม ? วงกลมมุมขวาล่าง */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={styles.floatButton}
                title="คำอธิบายสัญลักษณ์"
            >
                {isOpen ? '❌' : '?'}
            </button>

            {/* 2. กล่องแสดงรายการ (จะโชว์เมื่อกดปุ่ม) */}
            {isOpen && (
                <div style={styles.panel}>
                    <h4 style={styles.header}>📌 สัญลักษณ์บนแผนที่</h4>
                    <div style={styles.listContainer}>
                        {legendItems.map((item, index) => (
                            <div key={index} style={styles.item}>
                                <img src={item.icon} alt="" style={styles.icon} />
                                <span style={styles.label}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

// CSS-in-JS (แต่งสวยๆ ให้แล้วครับ)
const styles = {
    floatButton: {
        position: 'absolute',
        bottom: '10px',      // สูงจากขอบล่าง
        right: '10px',       // ห่างจากขอบขวา
        width: '25px',
        height: '25px',
        borderRadius: '50%', // ทำเป็นวงกลม
        backgroundColor: '#fff',
        border: '2px solid #000',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        zIndex: 2000,        // อยู่เหนือ Mapbox
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    panel: {
        position: 'absolute',
        bottom: '90px',      // อยู่เหนือปุ่มขึ้นมาหน่อย
        right: '20px',
        width: '280px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: 2000,
        fontFamily: 'Mitr, sans-serif',
        maxHeight: '60vh',   // กันยาวเกินจอ
        overflowY: 'auto'    // ถ้าล้นให้เลื่อนได้
    },
    header: {
        margin: '0 0 10px 0',
        paddingBottom: '8px',
        borderBottom: '2px solid #eee',
        textAlign: 'center',
        color: '#0056b3'
    },
    listContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // แบ่งเป็น 2 คอลัมน์
        gap: '10px'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px'
    },
    icon: {
        width: '25px',
        height: '35px',
        objectFit: 'contain',
        marginRight: '8px'
    },
    label: {
        color: '#333'
    }
};

export default MapLegend;