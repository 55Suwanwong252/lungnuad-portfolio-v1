
import { Mail, Facebook, MapPin } from "lucide-react";
import { site } from "@/lib/content";

export default function ContactPage() {
  return (
    <div className="page-wrap narrow-page">
      <span className="eyebrow">Get in touch</span>
      <h1 className="display-title">มีเรื่องที่อยากเล่า? มาคุยกันครับ.</h1>
      <p className="lead">สนใจผลิตสื่อโฆษณา วิดีโอ ภาพนิ่ง หรือสอบถามแพ็กเกจงานถ่ายทำ สามารถติดต่อเพื่อคุยโจทย์เบื้องต้นได้</p>
      <div className="contact-list">
        <a href={`mailto:${site.email}`}><Mail/><span>Email</span><b>{site.email}</b></a>
        <a href={site.facebookUrl} target="_blank" rel="noreferrer"><Facebook/><span>Facebook Page</span><b>{site.facebookLabel}</b></a>
        <div><MapPin/><span>พื้นที่ให้บริการ</span><b>{site.serviceArea}</b></div>
      </div>
    </div>
  );
}
