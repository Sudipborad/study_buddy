'use client';

import { useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CvDataContext } from '@/contexts/cv-data-context';
import { type CvData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, FileText, User, Briefcase, GraduationCap, Star, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResumeTemplate } from './resume-template';


const cvFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  personalStatement: z.string().min(1, 'Personal statement is required'),
  experience: z.array(z.object({
    jobTitle: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    responsibilities: z.string().min(1, 'Responsibilities are required'),
  })),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    graduationDate: z.string().min(1, 'Graduation date is required'),
  })),
  skills: z.array(z.string().min(1, "Skill cannot be empty")).min(1, "At least one skill is required"),
});


export function CvMaker() {
    const { cvData, setCvData } = useContext(CvDataContext);
    const { toast } = useToast();

    const form = useForm<CvData>({
        resolver: zodResolver(cvFormSchema),
        defaultValues: cvData || {
            fullName: '',
            email: '',
            phoneNumber: '',
            address: '',
            personalStatement: '',
            experience: [{ jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' }],
            education: [{ degree: '', institution: '', graduationDate: '' }],
            skills: [''],
        },
    });

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control: form.control,
        name: "education",
    });

    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    const onSubmit = (data: CvData) => {
        setCvData(data);
        toast({
            title: 'Resume Data Saved!',
            description: 'Your information has been updated and you can now see the preview.',
        });
    };

    return (
         <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Details</CardTitle>
                    <CardDescription>Fill out the form below to build your resume.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            
                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><User/>Personal Details</h3>
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                </div>
                                <FormField control={form.control} name="address" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="personalStatement" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Personal Statement</FormLabel>
                                        <FormControl><Textarea placeholder="A brief summary of your professional background..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>

                            <Separator />

                            {/* Work Experience */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Briefcase/>Work Experience</h3>
                                {experienceFields.map((field, index) => (
                                <Card key={field.id} className="mb-4 p-4 space-y-4 relative">
                                    <FormField control={form.control} name={`experience.${index}.jobTitle`} render={({ field }) => (
                                        <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Tech Corp" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                     <div className="grid sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                                            <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="Jan 2020" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (
                                            <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="Present" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    </div>
                                    <FormField control={form.control} name={`experience.${index}.responsibilities`} render={({ field }) => (
                                        <FormItem><FormLabel>Responsibilities</FormLabel><FormControl><Textarea placeholder="Describe your role and achievements..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4"/></Button>
                                </Card>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendExperience({ jobTitle: '', company: '', startDate: '', endDate: '', responsibilities: '' })}>
                                   <PlusCircle className="mr-2"/> Add Experience
                                </Button>
                            </div>

                            <Separator />
                            
                            {/* Education */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><GraduationCap/>Education</h3>
                                {educationFields.map((field, index) => (
                                <Card key={field.id} className="mb-4 p-4 space-y-4 relative">
                                    <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                                        <FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input placeholder="B.S. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                                        <FormItem><FormLabel>Institution</FormLabel><FormControl><Input placeholder="State University" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => (
                                        <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input placeholder="May 2019" {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4"/></Button>
                                </Card>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendEducation({ degree: '', institution: '', graduationDate: '' })}>
                                    <PlusCircle className="mr-2"/> Add Education
                                </Button>
                            </div>

                            <Separator />
                            
                            {/* Skills */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Star/>Skills</h3>
                                {skillFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2 mb-2">
                                         <FormField control={form.control} name={`skills.${index}`} render={({ field }) => (
                                            <FormItem className="flex-1"><FormControl><Input placeholder="JavaScript" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendSkill('')}>
                                    <PlusCircle className="mr-2"/> Add Skill
                                </Button>
                            </div>
                            
                            <Button type="submit" size="lg" className="w-full">
                                <FileText className="mr-2"/>
                                Save and Preview Resume
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="sticky top-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Resume Preview</CardTitle>
                        <CardDescription>This is how your generated resume will look.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="aspect-[8.5/11] w-full bg-background shadow-lg rounded-md border p-4">
                            <ResumeTemplate cvData={cvData} />
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
