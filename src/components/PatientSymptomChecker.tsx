'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle, HelpCircle, ThumbsUp } from 'lucide-react'

// Simulated symptom checker data (replace with actual data in production)
const symptomCheckerData = [
  {
    id: 'q1',
    question: 'Where is your pain located?',
    options: ['Upper teeth', 'Lower teeth', 'Gums', 'Jaw'],
    next: {
      'Upper teeth': 'q2',
      'Lower teeth': 'q2',
      'Gums': 'q3',
      'Jaw': 'q4'
    }
  },
  {
    id: 'q2',
    question: 'How would you describe the pain?',
    options: ['Sharp', 'Dull', 'Throbbing', 'Sensitive to hot/cold'],
    next: {
      'Sharp': 'q5',
      'Dull': 'q6',
      'Throbbing': 'q7',
      'Sensitive to hot/cold': 'q8'
    }
  },
  {
    id: 'q3',
    question: 'Are your gums bleeding?',
    options: ['Yes', 'No'],
    next: {
      'Yes': 'r1',
      'No': 'r2'
    }
  },
  {
    id: 'q4',
    question: 'Do you experience clicking or popping in your jaw?',
    options: ['Yes', 'No'],
    next: {
      'Yes': 'r3',
      'No': 'r4'
    }
  },
  {
    id: 'q5',
    question: 'How long have you been experiencing this pain?',
    options: ['Less than a day', '1-3 days', 'More than 3 days'],
    next: {
      'Less than a day': 'r5',
      '1-3 days': 'r6',
      'More than 3 days': 'r7'
    }
  },
  {
    id: 'q6',
    question: 'Is the pain constant or intermittent?',
    options: ['Constant', 'Intermittent'],
    next: {
      'Constant': 'r8',
      'Intermittent': 'r9'
    }
  },
  {
    id: 'q7',
    question: 'Is the pain worse when lying down?',
    options: ['Yes', 'No'],
    next: {
      'Yes': 'r10',
      'No': 'r11'
    }
  },
  {
    id: 'q8',
    question: 'Does the sensitivity linger after the hot/cold stimulus is removed?',
    options: ['Yes', 'No'],
    next: {
      'Yes': 'r12',
      'No': 'r13'
    }
  },
]

const results = {
  r1: {
    condition: 'Possible Gingivitis',
    urgency: 'moderate',
    advice: 'Your symptoms suggest possible gingivitis. Improve your oral hygiene routine and schedule an appointment with your dentist for a professional cleaning and assessment.',
    homeCare: 'Brush twice daily, floss regularly, and use an antiseptic mouthwash. Avoid smoking and maintain a healthy diet.'
  },
  r2: {
    condition: 'Gum Irritation',
    urgency: 'low',
    advice: 'Your gums may be irritated. Monitor the situation and improve your oral hygiene routine. If symptoms persist or worsen, schedule an appointment with your dentist.',
    homeCare: 'Gently brush your teeth and gums with a soft-bristled toothbrush. Use warm salt water rinses to soothe the gums.'
  },
  r3: {
    condition: 'Possible TMJ Disorder',
    urgency: 'moderate',
    advice: 'Your symptoms suggest a possible temporomandibular joint (TMJ) disorder. Schedule an appointment with your dentist for a proper evaluation.',
    homeCare: 'Apply ice or heat packs to the jaw area. Avoid hard or chewy foods. Practice relaxation techniques to reduce jaw tension.'
  },
  r4: {
    condition: 'Jaw Discomfort',
    urgency: 'low',
    advice: 'Your jaw discomfort may be due to stress or teeth grinding. Monitor the situation and schedule a check-up with your dentist if it persists.',
    homeCare: 'Practice jaw exercises and relaxation techniques. Consider using a night guard if you grind your teeth while sleeping.'
  },
  r5: {
    condition: 'Acute Tooth Pain',
    urgency: 'high',
    advice: 'Your symptoms suggest acute tooth pain, possibly due to decay or infection. Schedule an emergency appointment with your dentist as soon as possible.',
    homeCare: 'Rinse with warm salt water. Use over-the-counter pain relievers. Apply a cold compress to the outside of your cheek.'
  },
  r6: {
    condition: 'Possible Tooth Infection',
    urgency: 'high',
    advice: 'Your symptoms may indicate a tooth infection. Schedule an urgent appointment with your dentist for evaluation and treatment.',
    homeCare: 'Rinse with warm salt water. Use over-the-counter pain relievers. Avoid hot or cold foods and beverages.'
  },
  r7: {
    condition: 'Chronic Tooth Pain',
    urgency: 'moderate',
    advice: 'Your chronic tooth pain requires professional evaluation. Schedule an appointment with your dentist to determine the underlying cause and appropriate treatment.',
    homeCare: 'Use over-the-counter pain relievers. Avoid foods and beverages that trigger pain. Maintain good oral hygiene.'
  },
  r8: {
    condition: 'Possible Pulpitis',
    urgency: 'moderate',
    advice: 'Your symptoms suggest possible pulpitis (inflammation of the tooth pulp). Schedule an appointment with your dentist for evaluation and treatment.',
    homeCare: 'Use over-the-counter pain relievers. Avoid hot or cold foods and beverages. Gently brush and floss around the affected area.'
  },
  r9: {
    condition: 'Tooth Sensitivity',
    urgency: 'low',
    advice: 'Your symptoms indicate tooth sensitivity. Schedule a check-up with your dentist to determine the cause and discuss treatment options.',
    homeCare: 'Use a toothpaste designed for sensitive teeth. Avoid acidic foods and beverages. Maintain good oral hygiene.'
  },
  r10: {
    condition: 'Possible Abscess',
    urgency: 'high',
    advice: 'Your symptoms suggest a possible tooth abscess. Schedule an emergency appointment with your dentist for immediate evaluation and treatment.',
    homeCare: 'Rinse with warm salt water. Use over-the-counter pain relievers. Apply a cold compress to the outside of your cheek.'
  },
  r11: {
    condition: 'Tooth Inflammation',
    urgency: 'moderate',
    advice: 'Your symptoms indicate tooth inflammation. Schedule an appointment with your dentist for evaluation and treatment.',
    homeCare: 'Use over-the-counter pain relievers. Avoid foods and beverages that trigger pain. Maintain good oral hygiene.'
  },
  r12: {
    condition: 'Possible Pulp Damage',
    urgency: 'high',
    advice: 'Your symptoms suggest possible pulp damage. Schedule an urgent appointment with your dentist for evaluation and treatment.',
    homeCare: 'Use over-the-counter pain relievers. Avoid hot or cold foods and beverages. Gently brush and floss around the affected area.'
  },
  r13: {
    condition: 'Enamel Wear',
    urgency: 'low',
    advice: 'Your symptoms suggest enamel wear. Schedule a check-up with your dentist to discuss treatment options and preventive measures.',
    homeCare: 'Use a soft-bristled toothbrush and gentle brushing technique. Consider using a toothpaste for sensitive teeth. Avoid acidic foods and beverages.'
  },
}

export default function PatientSymptomChecker() {
  const [currentQuestion, setCurrentQuestion] = useState(symptomCheckerData[0])
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState<typeof results[keyof typeof results] | null>(null)
  const [progress, setProgress] = useState(0)
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch the symptom checker data from Supabase here
  }, [])

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    const nextQuestionId = currentQuestion.next[selectedAnswer as keyof typeof currentQuestion.next]
    
    if (nextQuestionId.startsWith('r')) {
      setResult(results[nextQuestionId as keyof typeof results])
      setProgress(100)
      if (results[nextQuestionId as keyof typeof results].urgency === 'high') {
        setShowEmergencyDialog(true)
      }
    } else {
      const nextQuestion = symptomCheckerData.find(q => q.id === nextQuestionId)
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion)
        setSelectedAnswer('')
        setProgress(prev => Math.min(prev + 100 / symptomCheckerData.length, 100))
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(symptomCheckerData[0])
    setSelectedAnswer('')
    setResult(null)
    setProgress(0)
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return <Badge className="bg-green-500"><ThumbsUp className="mr-1 h-3 w-3" /> Low Urgency</Badge>
      case 'moderate':
        return <Badge className="bg-yellow-500"><AlertCircle className="mr-1 h-3 w-3" /> Moderate Urgency</Badge>
      case 'high':
        return <Badge className="bg-red-500"><AlertCircle className="mr-1 h-3 w-3" /> High Urgency</Badge>
      default:
        return null
    }
  }

  const handleScheduleAppointment = () => {
    // In a real application, this would integrate with your appointment scheduling system
    toast({
      title: "Appointment Request Sent",
      description: "We'll contact you shortly to confirm your appointment.",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <HelpCircle className="mr-2 h-6 w-6" />
          Dental Symptom Checker
        </CardTitle>
        <CardDescription>Assess your dental health and get preliminary guidance</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-4" />
        {!result ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              {currentQuestion.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{result.condition}</h3>
                {getUrgencyBadge(result.urgency)}
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Advice</AlertTitle>
                <AlertDescription>{result.advice}</AlertDescription>
              </Alert>
              <div>
                <h4 className="font-semibold mb-2">Home Care Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {result.homeCare.split('. ').map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!result ? (
          <Button onClick={handleNext} disabled={!selectedAnswer}>Next</Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleRestart}>Start Over</Button>
            <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
          </>
        )}
      </CardFooter>

      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Urgent Care Needed</DialogTitle>
            <DialogDescription>
              Based on your symptoms, we recommend seeking immediate dental care.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Please contact our emergency dental service or visit an emergency dental clinic as soon as possible.</p>
            <p className="mt-2 font-semibold">Emergency Contact: (555) 123-4567</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEmergencyDialog(false)}>I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}