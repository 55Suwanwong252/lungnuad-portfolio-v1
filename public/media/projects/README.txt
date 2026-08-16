โฟลเดอร์นี้สำหรับไฟล์ภาพ/วิดีโอของคุณเอง

แนะนำโครงสร้าง:
public/media/projects/ชื่อ-slug/cover.jpg
public/media/projects/ชื่อ-slug/vertical.jpg
public/media/projects/ชื่อ-slug/gallery-01.jpg
public/media/projects/ชื่อ-slug/gallery-02.jpg
public/media/projects/ชื่อ-slug/video.mp4

เวลาใส่ใน Content Studio ให้ใช้ path แบบ:
 /media/projects/ชื่อ-slug/cover.jpg
 /media/projects/ชื่อ-slug/vertical.jpg
 /media/projects/ชื่อ-slug/gallery-01.jpg
 /media/projects/ชื่อ-slug/video.mp4

ข้อดี: ไม่ต้องแก้ URL ภายนอก และไฟล์จะไปกับเว็บตอน Deploy
หมายเหตุ: วิดีโอไฟล์ใหญ่ไม่ควรวางใน Vercel ระยะยาว ให้ใช้ YouTube/Vimeo/Mux/Cloudflare Stream ภายหลัง
