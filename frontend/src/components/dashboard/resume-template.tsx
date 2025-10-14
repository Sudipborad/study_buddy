'use client';
import { type CvData } from "@/lib/types";
import { Separator } from "../ui/separator";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, FileText } from 'lucide-react';

interface ResumeTemplateProps {
    cvData: CvData | null;
}

export function ResumeTemplate({ cvData }: ResumeTemplateProps) {
    if (!cvData || !cvData.fullName) {
        return (
            <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center h-full">
                <FileText className="h-16 w-16 mb-4" />
                <h3 className="font-semibold text-lg">Your Resume Preview Appears Here</h3>
                <p>Fill out the form on the left to see your resume.</p>
            </div>
        );
    }
    
    const { fullName, email, phoneNumber, address, personalStatement, experience, education, skills } = cvData;

    return (
        <div className="w-full h-full p-4 bg-white text-black font-sans text-[10px] overflow-y-auto">
            <header className="text-center mb-4">
                <h1 className="text-2xl font-bold font-serif tracking-wider uppercase">{fullName}</h1>
                <div className="flex justify-center items-center gap-x-4 gap-y-1 text-[9px] mt-1 flex-wrap">
                    <a href={`mailto:${email}`} className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{email}</a>
                    <a href={`tel:${phoneNumber}`} className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{phoneNumber}</a>
                    <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{address}</p>
                </div>
            </header>

            <section className="mb-4">
                <h2 className="text-sm font-bold font-serif tracking-wide border-b-2 border-gray-300 pb-1 mb-2">SUMMARY</h2>
                <p className="text-justify">{personalStatement}</p>
            </section>
            
            <Separator className="my-2 bg-gray-200" />

            <section className="mb-4">
                <h2 className="text-sm font-bold font-serif tracking-wide border-b-2 border-gray-300 pb-1 mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4" /> EXPERIENCE</h2>
                <div className="space-y-3">
                {experience?.map((exp, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-[11px]">{exp.jobTitle}</h3>
                            <p className="text-muted-foreground text-[9px]">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="font-semibold italic text-[10px]">{exp.company}</p>
                        <ul className="list-disc list-outside pl-4 mt-1 space-y-1">
                            {exp.responsibilities.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}
                        </ul>
                    </div>
                ))}
                </div>
            </section>
            
            <Separator className="my-2 bg-gray-200" />

            <section className="mb-4">
                <h2 className="text-sm font-bold font-serif tracking-wide border-b-2 border-gray-300 pb-1 mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> EDUCATION</h2>
                <div className="space-y-2">
                {education?.map((edu, index) => (
                     <div key={index}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-[11px]">{edu.degree}</h3>
                            <p className="text-muted-foreground text-[9px]">{edu.graduationDate}</p>
                        </div>
                        <p className="font-semibold italic text-[10px]">{edu.institution}</p>
                    </div>
                ))}
                </div>
            </section>
            
            <Separator className="my-2 bg-gray-200" />

            <section>
                 <h2 className="text-sm font-bold font-serif tracking-wide border-b-2 border-gray-300 pb-1 mb-2 flex items-center gap-2"><Star className="w-4 h-4"/> SKILLS</h2>
                 <div className="flex flex-wrap gap-2 mt-2">
                    {skills?.map((skill, index) => (
                        skill.trim() && <span key={index} className="bg-gray-200 rounded-md px-2 py-1 text-[9px] font-medium">{skill}</span>
                    ))}
                 </div>
            </section>
        </div>
    );
}
