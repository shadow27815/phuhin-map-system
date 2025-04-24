import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
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
                    <a href="/map">
                        <img src="/assets/home12.png" alt="Profile Image" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
