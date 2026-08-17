LUNGNUAD PORTFOLIO — BUILD 05
LIGHT MINIMAL HOME + PROJECTS / MOBILE REELS / REEL MANAGER

สิ่งที่เปลี่ยน
- Home เปลี่ยนเป็นโทนขาวสว่าง Clean / Minimal ตามภาพอ้างอิง
- Projects เปลี่ยนเป็นโปรไฟล์/Portfolio Listing แบบขาวสะอาด
- ใช้รูปโปรไฟล์ Pro.png ที่แนบมาในหน้า Home + Projects
- บนหน้าจอมือถือ: เปิด / แล้ว Redirect ไป /reels อัตโนมัติ
- Reels ใช้วิดีโอจริงและ Autoplay แบบ muted + playsInline
- ใส่ Reel ตัวอย่าง 3 คลิปจากไฟล์ที่แนบมา (บีบอัดสำหรับเว็บแล้ว)
- /studio เปลี่ยนเป็น Reel Manager สำหรับ Upload วิดีโอ Reel
- รองรับ Vercel Blob: เมื่อเชื่อม Blob แล้ว อัปโหลดจาก /studio บนเว็บ Vercel ได้โดยตรง

ติดตั้งบนโปรเจคเดิม
1) แตก ZIP
2) Copy โฟลเดอร์ src และ public ไปทับที่:
   /Users/khkschool_it/lungnuad-portfolio-v1
3) เปิด Terminal:
   cd ~/lungnuad-portfolio-v1
4) ติดตั้ง Vercel Blob SDK:
   npm install @vercel/blob
5) ทดสอบ:
   npm run dev
6) เปิด Desktop:
   http://localhost:3000
   http://localhost:3000/projects
   http://localhost:3000/studio
7) ทดสอบ Mobile โดยย่อ browser หรือเปิดจากมือถือ: / จะไป /reels

ขึ้น GitHub/Vercel หลังทดสอบผ่าน
  git add .
  git commit -m "Build 05 Light UI Mobile Reels"
  git push
Vercel จะ Deploy อัตโนมัติ

ตั้งค่า Vercel Blob สำหรับ Upload Reel จริง
- เข้า Vercel Project > Storage > Create Database / Blob
- สร้าง Blob Store แล้วเชื่อมกับโปรเจค
- Vercel จะเพิ่ม BLOB_READ_WRITE_TOKEN ให้ Environment Variables อัตโนมัติ
- Redeploy 1 รอบ
- เปิด https://ชื่อเว็บ.vercel.app/studio
- เลือกไฟล์ 9:16 แล้ว Upload
- หน้า /reels จะอ่านไฟล์จาก Blob โดยอัตโนมัติ

ข้อแนะนำไฟล์ Reel
- Ratio: 9:16
- Codec: H.264 MP4
- 720x1280 หรือ 1080x1920
- คลิปสั้น 10–45 วินาที
- ไฟล์ไม่ควรใหญ่เกินจำเป็น เพื่อโหลดเร็วบนมือถือ

หมายเหตุ
- /studio ยังไม่มี Login ตามที่ตกลงกันไว้ ดังนั้น URL นี้ควรเก็บไว้ใช้เองก่อน
- ถ้ายังไม่สร้าง Vercel Blob หน้า Reels จะใช้คลิปตัวอย่าง 3 คลิปใน public/media/reels
