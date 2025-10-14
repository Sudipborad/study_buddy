import { CvMaker } from "@/components/dashboard/cv-maker";

export default function CvMakerPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">CV/Resume Maker</h1>
                <p className="text-muted-foreground">
                    Fill in your details to generate a professional resume.
                </p>
            </div>
            <CvMaker />
        </div>
    )
}
