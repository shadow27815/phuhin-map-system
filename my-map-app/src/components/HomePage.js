import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const HomePage = () => {
    
    // 1. โหลด Font
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    // 2.แจ้งเตือนฤดูกาล (แก้ไขตรงนี้)
    useEffect(() => {
        // ---เช็คก่อนว่าเคยโชว์ไปหรือยัง? ---
        const hasShown = sessionStorage.getItem('seasonPopupShown');
        
        // ถ้ามีค่าว่าโชว์ไปแล้ว (true) ให้จบการทำงานเลย ไม่ต้องทำต่อ
        if (hasShown) return; 

        const date = new Date();
        const currentMonth = date.getMonth() + 1;
        let seasonData = null;

        // เช็คเดือนและเลือกข้อมูลที่จะโชว์
        if (currentMonth === 1 || currentMonth === 2) {
            seasonData = {
                title: '🌸 ฤดูกาลท่องเที่ยวมาถึงแล้ว!',
                text: 'ช่วงนี้ดอกนางพญาเสือโคร่งกำลังบานสะพรั่งสีชมพูเต็มภูลมโล รีบมาเช็คอินก่อนดอกร่วงนะครับ!',
                imageUrl: '/assets/tiger.png',
                backdrop: `rgba(0,0,123,0.4)`
            };
        } else if (currentMonth >= 6 && currentMonth <= 10) {
            seasonData = {
                title: '☔ เข้าสู่ฤดูฝน...ป่ากำลังสวย',
                text: 'เชิญชมความเขียวชอุ่มของมอสและดอกเปราะภูขาวที่ลานหินแตก บรรยากาศสดชื่นสุดๆ',
                imageUrl: '/assets/sgm.jpg', 
                backdrop: `rgba(0,0,123,0.4)`
            };
        } else if (currentMonth === 11 || currentMonth === 12) {
            seasonData = {
                title: '🍁 ฤดูใบเมเปิ้ลเปลี่ยนสี',
                text: 'พลาดไม่ได้กับใบเมเปิ้ลสีแดงสดที่โรงเรียนการเมืองการทหาร อากาศกำลังหนาวได้ที่',
                imageUrl: '/assets/mapel.jpg',
                backdrop: `rgba(0,0,123,0.4)`
            };
        } else {
            seasonData = {
                title: '☀️ หน้าร้อนนี้นอนดูดาวกันไหม?',
                text: 'ช่วงนี้ฟ้าเปิด เหมาะแก่การถ่ายรูปนอนดูดาวและกางเต็นท์รับลมเย็นที่ลานหินปุ่ม',
                imageUrl: '/assets/sleep.jpg',
                backdrop: `rgba(0,0,123,0.4)`
            };
        }

        // สั่งเด้ง Popup
        if (seasonData) {
            Swal.fire({
                title: seasonData.title,
                text: seasonData.text,
                imageUrl: seasonData.imageUrl,
                imageAlt: 'Seasonal Highlight',
                confirmButtonText: 'เข้าสู่เว็บไซต์',
                confirmButtonColor: '#28a745', 
                backdrop: seasonData.backdrop,
                allowOutsideClick: false, 
                padding: '1.5em', // จัด Padding มาตรฐาน
                background: '#fff',
                customClass: {
                    // เพิ่มคลาสนี้เพื่อให้มั่นใจว่า CSS เราจะทำงานถูกตัว
                    popup: 'seasonal-popup-class' 
                }
            }).then(() => {
                sessionStorage.setItem('seasonPopupShown', 'true');
            });
        }
    }, []);

    return (
        <div className="container">
            <section className="content">
                <div className="text">
                    <h1>ระบบแนะนำเส้นทางแหล่งท่องเที่ยวภายในอุทยานแห่งชาติภูหินร่องกล้า</h1>
                    <p>
                        ระบบแนะนำเส้นทางแหล่งท่องเที่ยวภายในอุทยานแห่งชาติภูหินร่องกล้า เป็นโครงงานที่มีเป้าหมายในการแนะนำเส้นทางแหล่งท่องเที่ยวภายในอุทยานแห่งชาติภูหินร่องกล้า โดยเน้นการใช้เทคโนโลยีสารสนเทศเพื่อเพิ่มความสะดวกและประสิทธิภาพให้แก่ผู้ใช้บริการ
                    </p>
                    <div className="social-icons">
                        <p style={{ fontSize: '18px' }}>ติดต่อเรา</p>
                        <p style={{ fontSize: '14px' }}>เบอร์ติดต่อ : 081-596 5977</p>
                        <p style={{ fontSize: '14px' }}>อีเมล : phuh-055@hotmail.co.th</p>
                        <p style={{ fontSize: '14px' }}>ตำแหน่งที่ตั้ง : ตู้ ปณ. 3 อ.นครไทย จ.พิษณุโลก 65120 หรือ ทางหลวงแผ่นดินหมายเลข 2331 ต.เนินเพิ่ม อ.นครไทย</p>
                        <a href="https://portal.dnp.go.th/Content/nationalpark?contentId=790" target="_blank" rel="noreferrer">
                            <img src="/assets/WWW.png" alt="Website Icon" width="50" />
                        </a>
                        <a href="https://www.facebook.com/PhuhinrongklaNP/?locale=th_TH" target="_blank" rel="noreferrer">
                            <img src="/assets/Facebook.png" alt="Facebook Icon" width="50" />
                        </a>
                    </div>
                </div>
                <div className="profile-image">
                    {/* ลิ้งค์ไปยังหน้าแผนที่ */}
                    <Link to="/map">
                        <img src="/assets/home12.png" alt="Profile Image" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;