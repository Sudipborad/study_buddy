import { InterviewPrep } from "@/components/dashboard/interview-prep";

export default function InterviewPrepPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Interview Prep</h1>
                <p className="text-muted-foreground">
                    Generate interview questions based on the skills in your resume.
                </p>
            </div>
            <InterviewPrep />
        </div>
    )
}
