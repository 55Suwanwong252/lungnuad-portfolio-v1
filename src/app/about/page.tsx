
import Link from "next/link";
import { ArrowRight, Camera, MonitorPlay, Mic2, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="page-wrap narrow-page">
      <span className="eyebrow">Lung Nuad Photographer</span>
      <h1 className="display-title">ประสบการณ์ที่เปลี่ยนโจทย์ ให้กลายเป็นเรื่องราว.</h1>
      <p className="lead">“ลุงหนวด ช่างภาพ” ทำงานด้านภาพถ่ายและวิดีโอมายาวนาน พร้อมประสบการณ์ร่วมงานในสตูดิโอสื่อขนาดใหญ่กว่า 15 ปี ให้ความสำคัญกับองค์ประกอบภาพ แสง สี มุมกล้อง และการเล่าเรื่อง เพื่อดึงเอกลักษณ์ของแบรนด์ บุคคล และองค์กรออกมาให้ชัดเจน</p>
      <div className="about-stats"><div><b>15+ Years</b><span>Production experience</span></div><div><b>Video + Photo</b><span>ครบทั้งภาพเคลื่อนไหวและภาพนิ่ง</span></div><div><b>Nationwide</b><span>ภาคใต้และทั่วประเทศ</span></div></div>
      <div className="capability-grid">
        <div><Camera/><b>Production</b><span>กล้องและการถ่ายทำ</span></div>
        <div><Lightbulb/><b>Studio Lighting</b><span>ระบบไฟกองถ่าย</span></div>
        <div><MonitorPlay/><b>Post Production</b><span>ห้องตัดต่อ Professional</span></div>
        <div><Mic2/><b>Audio</b><span>ห้องบันทึกเสียงเฉพาะทาง</span></div>
      </div>
      <Link className="primary-button inline-button" href="/contact">พูดคุยเรื่องโปรเจค <ArrowRight size={18}/></Link>
    </div>
  );
}
