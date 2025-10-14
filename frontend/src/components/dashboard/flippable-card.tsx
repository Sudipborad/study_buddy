'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

export function FlippableCard({ frontContent, backContent }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  return (
    <div className="group h-80 w-full [perspective:1000px]">
      <div
        className={cn(
          'relative h-full w-full rounded-lg shadow-md transition-transform duration-700 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
        onClick={handleFlip}
      >
        {/* Front of the card */}
        <Card className="absolute h-full w-full [backface-visibility:hidden] flex flex-col cursor-pointer">
          <CardContent className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="text-lg font-medium">{frontContent}</div>
            <div className="mt-auto pt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <RefreshCw className="mr-2 h-3 w-3" />
                Click to flip
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col cursor-pointer">
          <CardContent className="flex-grow flex flex-col items-center justify-center p-6 text-center">
             <div className="text-md">{backContent}</div>
             <div className="mt-auto pt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <RefreshCw className="mr-2 h-3 w-3" />
                Click to flip
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
