LUNGNUAD PORTFOLIO — BUILD 07
Mobile Reel Home + Reel Library Manager

สิ่งที่แก้
- มือถือเข้า Home แล้วไม่ Redirect ไป /reels อีกต่อไป
- คลิป Reel แรกเล่นเต็มจอด้านบนของ Home
- เลื่อนลงแล้วเจอ Home / Portfolio ต่อทันที
- ปุ่ม Sound แก้ให้สั่ง video.muted โดยตรงจาก user tap เพื่อรองรับ iPhone Safari
- หน้า /reels ใช้ Sound logic เดียวกัน
- Admin อัปโหลด Reel แบบ Client Upload ไป Vercel Blob เหมาะกับไฟล์วิดีโอขนาดใหญ่กว่า server upload
- Admin ลบ Reel บน Vercel Blob ได้
- จำนวน Reel ใน Blob คือจำนวน Reel ที่หน้าเว็บแสดงจริง
- ลบให้เหลือ 1 คลิปได้ / เพิ่มใหม่ได้อิสระ
- ถ้า Blob พร้อมแต่ไม่มีคลิป หน้า Reels จะแสดง Zero State ไม่ดึง Demo กลับมา
- รวม production fix ของ /studio/login (Suspense) ไว้แล้ว

ติดตั้ง
1. แตก ZIP
2. Copy โฟลเดอร์ src ไปทับ ~/lungnuad-portfolio-v1/src
3. npm run build
4. ถ้าผ่าน:
   git add .
   git commit -m "Build 07 mobile reel home and reel manager"
   git push

Vercel Blob
- ต้องมี Blob Store เชื่อมกับ Project
- Build นี้ใช้ @vercel/blob/client สำหรับอัปโหลดจาก browser โดยตรง
- Delete ใช้ Vercel Blob del() ผ่าน API ที่ล็อกด้วย Studio cookie
