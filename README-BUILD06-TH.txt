LUNGNUAD PORTFOLIO — BUILD 06
ADMIN MENU + BASIC LOGIN + THAI FONT FIX

สิ่งที่เพิ่ม
- เพิ่ม Admin ใน Sidebar (ลิงก์ไป /studio)
- /studio ถูกล็อกด้วยหน้า Login
- รหัสเริ่มต้น: Admin
- Login ใช้ HttpOnly cookie อายุ 12 ชั่วโมง
- ป้องกัน /studio และ /api/studio/* ด้วย Next.js 16 proxy.ts
- เพิ่ม Logout ใน Reel Manager
- ใช้ Noto Sans Thai ผ่าน next/font เพื่อแก้ปัญหาตัวอักษรไทยซ้อน/บรรทัดชนกัน
- ปรับ line-height ภาษาไทยใน Hero / Project / Navigation

ติดตั้ง
1) Copy src ไปทับ ~/lungnuad-portfolio-v1/src
2) เปิด Terminal:
   cd ~/lungnuad-portfolio-v1
   npm run dev
3) เข้า http://localhost:3000
4) กด Admin ใน Sidebar
5) Login ด้วย: Admin

ก่อนขึ้น Vercel ต้องตั้ง Environment Variable ใน Vercel Project > Settings > Environment Variables:
ADMIN_PASSWORD=Admin

จากนั้นแนะนำทดสอบ Production Build:
   npm run build

ถ้าผ่าน:
   git add .
   git commit -m "Build 06 Admin login and Thai typography"
   git push

Vercel ที่เชื่อม GitHub ไว้แล้วจะ Deploy ให้อัตโนมัติ

สำคัญด้านความปลอดภัย
รหัส Admin เป็น Basic Lock ตามที่ขอ และ repo ปัจจุบันเป็น Public จึงไม่เหมาะกับข้อมูลลับหรือระบบสำคัญ
บน Vercel ระบบ Production ต้องใช้ ADMIN_PASSWORD จาก Environment Variable เท่านั้น
ตอนนี้ตั้งเป็น ADMIN_PASSWORD=Admin ตามที่ขอ
ถ้าต้องการเปลี่ยนภายหลัง เปลี่ยนค่าตัวนี้แล้ว Redeploy ได้เลย
