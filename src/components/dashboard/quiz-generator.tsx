'use client';

import { useState, useEffect, useContext } from 'react';
import { generateQuiz } from '@/ai/flows/generate-quiz';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { useToast } from '@/hooks/use-toast';
import { type QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function QuizGenerator() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const { studyMaterial } = useContext(StudyMaterialContext);
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!studyMaterial) {
      toast({ variant: 'destructive', title: 'Error', description: 'No study material available.' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    resetQuiz();

    try {
      const result = await generateQuiz({ studyMaterial });
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not generate quiz from the material.' });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate quiz.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMaterial]);

  const handleAnswerSubmit = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };
  
  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  }

  const handleRestartQuiz = () => {
    resetQuiz();
    handleGenerateQuiz();
  }

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">The AI is generating your quiz...</p>
      </div>
    );
  }

  if (questions.length === 0 && !isLoading) {
     return (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold font-headline">Could Not Generate Quiz</h3>
            <p className="text-muted-foreground mt-2">The AI was unable to create a quiz from the provided material. Try uploading something different.</p>
        </Card>
      );
  }

  if (quizFinished) {
    return (
       <Card className="w-full max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>You've finished the quiz. Here's how you did.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-5xl font-bold text-primary">
                {Math.round((score / questions.length) * 100)}%
            </p>
            <p className="text-muted-foreground">You answered {score} out of {questions.length} questions correctly.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={handleRestartQuiz}>
            <Wand2 className="mr-2" />
            Generate a New Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
       <CardHeader>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="font-headline text-2xl">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
            value={selectedOption ?? ''}
            onValueChange={setSelectedOption}
            disabled={isAnswered}
        >
            {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.answer;
                const isSelected = option === selectedOption;
                return (
                     <Label
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                            isAnswered && isCorrect ? 'border-green-500 bg-green-500/10' : ''
                        } ${
                            isAnswered && isSelected && !isCorrect ? 'border-red-500 bg-red-500/10' : ''
                        } ${
                           !isAnswered && isSelected ? 'border-primary' : ''
                        } ${
                            !isAnswered ? 'cursor-pointer hover:bg-muted/50' : ''
                        }`}
                        htmlFor={`option-${index}`}
                    >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <span>{option}</span>
                         {isAnswered && isCorrect && <CheckCircle className="ml-auto text-green-500" />}
                         {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto text-red-500" />}
                    </Label>
                )
            })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isAnswered ? (
            <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
        ) : (
            <Button onClick={handleAnswerSubmit} disabled={!selectedOption}>
                Submit Answer
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
