import React, { useState } from 'react';

// รูปไอคอนที่ใช้ (Mapping ตามโค้ดเดิม)
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

const LayerControl = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false); // สถานะเปิด/ปิดกล่อง

    // กำหนดหมวดหมู่และประเภทข้อมูลข้างใน
    const categories = [
        {
            id: 'attractions',
            name: 'แหล่งท่องเที่ยว',
            types: ['sport-hiking', 'nature-mountains', 'tourism-forest', 'stores-flowers', 'tourism-chapel', 'tourism-buddha']
        },
        {
            id: 'food',
            name: 'ร้านอาหาร/กาแฟ',
            types: ['restaurant-restaurant', 'restaurant-coffee']
        },
        {
            id: 'accommodation',
            name: 'ที่พัก/ลานกางเต็นท์',
            types: ['tourism-campingsite', 'restaurant-hotel']
        },
        {
            id: 'facilities',
            name: 'สิ่งอำนวยความสะดวก',
            types: ['transport-car', 'misc-toilets', 'friends-home', 'sport-firstaid', 'stores-bookstore']
        }
    ];

    // State เก็บสถานะการติ๊ก (Default คือ true = แสดงหมด)
    const [checkedCategories, setCheckedCategories] = useState({
        attractions: true,
        food: true,
        accommodation: true,
        facilities: true
    });

    const handleToggle = (categoryId) => {
        const newState = { ...checkedCategories, [categoryId]: !checkedCategories[categoryId] };
        setCheckedCategories(newState);

        // คำนวณรายชื่อ types ทั้งหมดที่ต้องแสดง
        let activeTypes = [];
        categories.forEach(cat => {
            if (newState[cat.id]) {
                activeTypes = [...activeTypes, ...cat.types];
            }
        });

        // ส่งค่ากลับไปบอกไฟล์แม่ (NUATM.js)
        onFilterChange(activeTypes);
    };

    return (
        <div style={styles.container}>
            {/* ปุ่มเปิด/ปิด Sidebar */}
            <button onClick={() => setIsOpen(!isOpen)} style={styles.toggleButton}>
                {isOpen ? '❌ ปิดตัวกรอง' : '🗺️ ตัวกรองสถานที่'}
            </button>

            {/* เนื้อหา Sidebar */}
            {isOpen && (
                <div style={styles.panel}>
                    <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                        แสดงข้อมูล
                    </h4>
                    
                    {categories.map((cat) => (
                        <div key={cat.id} style={styles.categoryItem}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
                                <input
                                    type="checkbox"
                                    checked={checkedCategories[cat.id]}
                                    onChange={() => handleToggle(cat.id)}
                                    style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                                />
                                {cat.name}
                            </label>
                            
                            {/* ส่วนแสดง Legend (คำอธิบายสัญลักษณ์) */}
                            <div style={styles.legendContainer}>
                                {cat.types.map(type => (
                                    <div key={type} style={styles.legendItem}>
                                        <img src={iconStyles[type]} alt="" style={styles.icon} />
                                        {/* ตรงนี้ถ้าอยากให้แสดงชื่อไทยของแต่ละไอคอน ต้องทำ Mapping เพิ่ม */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// CSS-in-JS (หรือจะเอาไปใส่ไฟล์ .css ก็ได้)
const styles = {
    container: {
        position: 'absolute',
        top: '80px', // ให้ต่ำลงมาจาก Search bar นิดนึง
        left: '10px',
        zIndex: 1000,
        fontFamily: 'Mitr, sans-serif'
    },
    toggleButton: {
        padding: '8px 15px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    panel: {
        marginTop: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        width: '220px',
        maxHeight: '70vh',
        overflowY: 'auto'
    },
    categoryItem: {
        marginBottom: '15px'
    },
    legendContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '5px',
        paddingLeft: '24px' // ให้ย่อหน้าตรงกับชื่อหมวด
    },
    legendItem: {
        marginRight: '5px',
        marginBottom: '5px'
    },
    icon: {
        width: '25px',
        height: '25px',
        objectFit: 'contain'
    }
};

export default LayerControl;