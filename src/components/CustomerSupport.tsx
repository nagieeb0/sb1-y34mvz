'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { MessageSquare, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type SupportInteraction = {
  id: string;
  userId: string;
  type: 'chat' | 'faq' | 'escalation';
  content: string;
  createdAt: string;
  resolved: boolean;
}

type FAQ = {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you instructions to reset your password.'
  },
  {
    id: '2',
    question: 'How can I schedule an appointment?',
    answer: 'To schedule an appointment, go to the "Appointments" tab in your dashboard. Click on "New Appointment", select your preferred date and time, and follow the prompts to complete the booking.'
  },
  {
    id: '3',
    question: 'How do I update my clinic information?',
    answer: 'To update your clinic information, navigate to the "Settings" page from your dashboard. Click on "Clinic Details" and you\'ll be able to edit your clinic\'s name, address, contact information, and other details.'
  }
]

export default function CustomerSupport({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('faq')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<SupportInteraction[]>([])
  const [escalationReason, setEscalationReason] = useState('')
  const [supportRating, setSupportRating] = useState<'positive' | 'negative' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const fetchChatHistory = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('support_interactions')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })

      if (error) throw error

      setChatHistory(data)
    } catch (error) {
      console.error('Error fetching chat history:', error)
      toast({
        title: "Error",
        description: "Failed to fetch support history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('support_interactions')
        .insert({
          userId,
          type: 'chat',
          content: chatMessage,
          resolved: false
        })
        .select()

      if (error) throw error

      setChatHistory([data[0], ...chatHistory])
      setChatMessage('')

      // Simulate automated response
      setTimeout(() => {
        const automatedResponse: SupportInteraction = {
          id: Date.now().toString(),
          userId,
          type: 'chat',
          content: "Thank you for your message. A support agent will respond shortly. In the meantime, you might find an answer to your question in our FAQ section.",
          createdAt: new Date().toISOString(),
          resolved: false
        }
        setChatHistory(prev => [automatedResponse, ...prev])
      }, 1000)

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEscalation = async () => {
    if (!escalationReason.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('support_interactions')
        .insert({
          userId,
          type: 'escalation',
          content: escalationReason,
          resolved: false
        })
        .select()

      if (error) throw error

      setChatHistory([data[0], ...chatHistory])
      setEscalationReason('')
      setActiveTab('chat')

      toast({
        title: "Issue Escalated",
        description: "Your issue has been escalated to our support team. We'll get back to you as soon as possible.",
      })

    } catch (error) {
      console.error('Error escalating issue:', error)
      toast({
        title: "Error",
        description: "Failed to escalate issue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupportRating = async (rating: 'positive' | 'negative') => {
    setSupportRating(rating)
    try {
      const { error } = await supabase
        .from('support_feedback')
        .insert({
          userId,
          rating
        })

      if (error) throw error

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback. We appreciate your input!",
      })

    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Customer Support</CardTitle>
        <CardDescription>Get help, find answers, and resolve issues.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="chat">Support Chat</TabsTrigger>
            <TabsTrigger value="escalate">Escalate Issue</TabsTrigger>
          </TabsList>
          <TabsContent value="faq">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="chat">
            <div className="space-y-4">
              <div className="h-[300px] overflow-y-auto border rounded p-2">
                {chatHistory.map((interaction) => (
                  <div key={interaction.id} className={`mb-2 p-2 rounded ${interaction.userId === userId ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <p>{interaction.content}</p>
                    <small className="text-xs opacity-50">{new Date(interaction.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>Send</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="escalate">
            <div className="space-y-4">
              <div>
                <Label htmlFor="escalationReason">Reason for Escalation</Label>
                <Textarea
                  id="escalationReason"
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                />
              </div>
              <Button onClick={handleEscalation} disabled={isLoading}>Submit for Escalation</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <span>Was this helpful?</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSupportRating('positive')}
            disabled={supportRating !== null}
          >
            <ThumbsUp className={supportRating === 'positive' ? 'text-green-500' : ''} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSupportRating('negative')}
            disabled={supportRating !== null}
          >
            <ThumbsDown className={supportRating === 'negative' ? 'text-red-500' : ''} />
          </Button>
        </div>
        <Button variant="link" onClick={() => window.open('https://dentease.com/support', '_blank')}>
          Visit Help Center
        </Button>
      </CardFooter>
    </Card>
  )
}