'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen } from "lucide-react";


export default function MaterialsPage() {
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Materials</h1>
        <p className="text-muted-foreground">
          All your generated study sets in one place.
        </p>
      </div>
       <Card className="text-center p-10 bg-secondary/50 border-dashed">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold font-headline">Material Persistence Coming Soon</h3>
          <p className="text-muted-foreground mt-2">We are working on a way to save your materials without requiring an account.</p>
        </Card>
    </div>
  )
}
