'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Star, StarHalf } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'

type Feedback = {
  id: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  status: 'New' | 'Reviewed' | 'Actioned';
  createdAt: string;
}

export default function FeedbackAndRating({ userId, userType }: { userId: string; userType: 'patient' | 'doctor' }) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'actioned'>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (userType === 'doctor') {
      fetchFeedback()
    }
  }, [userType, filter])

  const fetchFeedback = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .eq('doctorId', userId)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      setFeedback(data)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast({
        title: "Error",
        description: "Failed to fetch feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const submitFeedback = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          doctorId: userId, // Assuming the doctor's ID is passed when rendering for a patient
          patientId: userId,
          rating,
          comment,
          status: 'New'
        })
        .select()

      if (error) throw error

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      })

      setRating(0)
      setComment('')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFeedbackStatus = async (feedbackId: string, newStatus: 'Reviewed' | 'Actioned') => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', feedbackId)

      if (error) throw error

      setFeedback(feedback.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f))

      toast({
        title: "Status Updated",
        description: `Feedback status updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error('Error updating feedback status:', error)
      toast({
        title: "Error",
        description: "Failed to update feedback status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const averageRating = feedback.length > 0
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
    : 0

  const ratingCounts = feedback.reduce((counts, f) => {
    counts[f.rating] = (counts[f.rating] || 0) + 1
    return counts
  }, {} as Record<number, number>)

  const ratingData = [1, 2, 3, 4, 5].map(rating => ({
    rating: rating.toString(),
    count: ratingCounts[rating] || 0
  }))

  if (userType === 'patient') {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Rate Your Experience</CardTitle>
          <CardDescription>Please provide feedback on your recent appointment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} cursor-pointer`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={submitFeedback} disabled={isLoading || rating === 0}>
            Submit Feedback
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Patient Feedback</CardTitle>
        <CardDescription>Review and manage patient feedback and ratings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({feedback.length} ratings)</span>
            </div>
            <Select value={filter} onValueChange={(value: 'all' | 'new' | 'reviewed' | 'actioned') => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="actioned">Actioned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Recent Feedback</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{new Date(f.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= f.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{f.comment}</TableCell>
                    <TableCell>{f.status}</TableCell>
                    <TableCell>
                      {f.status === 'New' && (
                        <Button onClick={() => updateFeedbackStatus(f.id, 'Reviewed')} size="sm">
                          Mark as Reviewed
                        </Button>
                      )}
                      {f.status === 'Reviewed' && (
                        <Button onClick={() => updateFeedbackStatus(f.id, 'Actioned')} size="sm">
                          Mark as Actioned
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}