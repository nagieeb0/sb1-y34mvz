'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'
import { supabase } from '@/lib/supabaseClient'

type Review = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

type Doctor = {
  id: string;
  name: string;
  averageRating: number;
  totalReviews: number;
}

export default function DoctorReviewsManagement({ doctorId }: { doctorId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [newResponse, setNewResponse] = useState<string>('')
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all')
  const [sort, setSort] = useState<'date' | 'rating'>('date')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchDoctorInfo()
    fetchReviews()
  }, [])

  const fetchDoctorInfo = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single()

      if (error) throw error

      setDoctor(data)
    } catch (error) {
      console.error('Error fetching doctor info:', error)
      toast({
        title: "Error",
        description: "Failed to fetch doctor information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('doctorId', doctorId)

      if (filter === 'positive') {
        query = query.gte('rating', 4)
      } else if (filter === 'negative') {
        query = query.lte('rating', 2)
      }

      if (sort === 'date') {
        query = query.order('date', { ascending: false })
      } else {
        query = query.order('rating', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponseSubmit = async () => {
    if (!selectedReview) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ response: newResponse })
        .eq('id', selectedReview)

      if (error) throw error

      setReviews(reviews.map(review => 
        review.id === selectedReview ? { ...review, response: newResponse } : review
      ))

      setNewResponse('')
      setSelectedReview(null)

      toast({
        title: "Response Submitted",
        description: "Your response has been successfully submitted.",
      })
    } catch (error) {
      console.error('Error submitting response:', error)
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return Object.entries(distribution).map(([rating, count]) => ({ rating, count }))
  }

  const getCommonThemes = () => {
    const themes = {
      'Professionalism': 0,
      'Communication': 0,
      'Wait Time': 0,
      'Treatment Effectiveness': 0,
      'Cleanliness': 0
    }
    reviews.forEach(review => {
      if (review.comment.toLowerCase().includes('professional')) themes['Professionalism']++
      if (review.comment.toLowerCase().includes('communicat')) themes['Communication']++
      if (review.comment.toLowerCase().includes('wait')) themes['Wait Time']++
      if (review.comment.toLowerCase().includes('effect')) themes['Treatment Effectiveness']++
      if (review.comment.toLowerCase().includes('clean')) themes['Cleanliness']++
    })
    return Object.entries(themes).map(([theme, count]) => ({ theme, count }))
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle>Doctor Reviews Management</CardTitle>
        <CardDescription>View and respond to patient reviews, and gain insights into your performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reviews">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="respond">Respond</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
                <div className="flex justify-between items-center">
                  <Select value={filter} onValueChange={(value: 'all' | 'positive' | 'negative') => setFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter reviews" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reviews</SelectItem>
                      <SelectItem value="positive">Positive Reviews</SelectItem>
                      <SelectItem value="negative">Negative Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sort} onValueChange={(value: 'date' | 'rating') => setSort(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort reviews" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Sort by Date</SelectItem>
                      <SelectItem value="rating">Sort by Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage src={`/placeholder-avatar.jpg`} alt={review.patientName} />
                              <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle>{review.patientName}</CardTitle>
                              <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{review.comment}</p>
                        {review.response && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="font-semibold">Doctor's Response:</p>
                            <p>{review.response}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" onClick={() => setSelectedReview(review.id)}>
                          Respond
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-yellow-400 fill-current" />
                    <span className="text-3xl font-bold">{doctor?.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({doctor?.totalReviews} reviews)</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Rating Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={getRatingDistribution()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Common Themes</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={getCommonThemes()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="theme" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Top Rated Services</h3>
                    <ul className="list-disc list-inside">
                      <li>Dental Cleaning</li>
                      <li>Root Canal Treatment</li>
                      <li>Teeth Whitening</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                    <ul className="list-disc list-inside">
                      <li>Reducing wait times</li>
                      <li>Improving communication about treatment plans</li>
                      <li>Enhancing post-treatment follow-up</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="respond">
            <Card>
              <CardHeader>
                <CardTitle>Respond to Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedReview || ''} onValueChange={setSelectedReview}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a review to respond" />
                    </SelectTrigger>
                    <SelectContent>
                      {reviews.filter(review => !review.response).map((review) => (
                        <SelectItem key={review.id} value={review.id}>
                          {review.patientName} - {new Date(review.date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedReview && (
                    <div>
                      <Label htmlFor="response">Your Response</Label>
                      <Textarea
                        id="response"
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="Type your response here..."
                        rows={4}
                      />
                    </div>
                  )}
                  <Button onClick={handleResponseSubmit} disabled={!selectedReview || !newResponse}>
                    Submit Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}