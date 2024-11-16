'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Twitter, Share2, Calendar, Star, MessageSquare } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const socialMediaLinks = {
  facebook: 'https://facebook.com/dentease',
  instagram: 'https://instagram.com/dentease',
  twitter: 'https://twitter.com/dentease',
}

const scheduledPosts = [
  { id: '1', content: 'Don't forget to floss daily for optimal dental health!', platform: 'all', date: '2023-07-15T10:00:00Z' },
  { id: '2', content: 'Summer special: 20% off teeth whitening treatments!', platform: 'facebook', date: '2023-07-20T14:00:00Z' },
]

const patientReviews = [
  { id: '1', content: 'Great experience! The staff was very friendly and professional.', rating: 5, approved: true },
  { id: '2', content: 'Dr. Smith explained everything clearly. Highly recommend!', rating: 5, approved: false },
]

const postTemplates = [
  { id: '1', title: 'Dental Health Tip', content: 'Did you know? [Insert dental fact here] #DentalHealth #DentEaseTip' },
  { id: '2', title: 'Appointment Reminder', content: 'Don't forget your dental check-up this week! A healthy smile is just a visit away. #DentEase' },
  { id: '3', title: 'Special Promotion', content: 'Limited time offer: [Insert promotion details] Book now! #DentalDeals #DentEase' },
]

export default function SocialMediaIntegration({ clinicId }: { clinicId: string }) {
  const [links, setLinks] = useState(socialMediaLinks)
  const [posts, setPosts] = useState(scheduledPosts)
  const [reviews, setReviews] = useState(patientReviews)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [newPost, setNewPost] = useState({ content: '', platform: 'all', date: '' })
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [appointmentToShare, setAppointmentToShare] = useState({ date: '', type: '' })

  useEffect(() => {
    // In a real application, fetch social media data from Supabase here
  }, [clinicId])

  const handleUpdateLinks = async () => {
    // Simulate updating social media links in Supabase
    toast({
      title: "Links Updated",
      description: "Your social media links have been updated successfully.",
    })
  }

  const handleSchedulePost = async () => {
    // Simulate scheduling a new post in Supabase
    const newScheduledPost = {
      id: (posts.length + 1).toString(),
      ...newPost,
    }
    setPosts([...posts, newScheduledPost])
    setShowPostDialog(false)
    setNewPost({ content: '', platform: 'all', date: '' })
    toast({
      title: "Post Scheduled",
      description: "Your social media post has been scheduled successfully.",
    })
  }

  const handleApproveReview = async (reviewId: string) => {
    // Simulate approving a review in Supabase
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, approved: true } : review
    ))
    toast({
      title: "Review Approved",
      description: "The patient review has been approved for sharing.",
    })
  }

  const handleShareAppointment = async () => {
    // Simulate sharing an appointment on social media
    setShowShareDialog(false)
    toast({
      title: "Appointment Shared",
      description: "Your appointment has been shared on social media.",
    })
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-6 w-6" />
          Social Media Integration
        </CardTitle>
        <CardDescription>Manage your clinic's social media presence and patient engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="links">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="links">
              <MessageSquare className="mr-2 h-4 w-4" />
              Social Links
            </TabsTrigger>
            <TabsTrigger value="posts">
              <Calendar className="mr-2 h-4 w-4" />
              Scheduled Posts
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="mr-2 h-4 w-4" />
              Patient Reviews
            </TabsTrigger>
            <TabsTrigger value="share">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={links.facebook}
                    onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={links.instagram}
                    onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={links.twitter}
                    onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                  />
                </div>
                <Button onClick={handleUpdateLinks}>Update Links</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>{post.content}</TableCell>
                        <TableCell>{post.platform}</TableCell>
                        <TableCell>{new Date(post.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button className="mt-4" onClick={() => setShowPostDialog(true)}>Schedule New Post</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Review</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.content}</TableCell>
                        <TableCell>{review.rating}/5</TableCell>
                        <TableCell>{review.approved ? 'Approved' : 'Pending'}</TableCell>
                        <TableCell>
                          {!review.approved && (
                            <Button onClick={() => handleApproveReview(review.id)}>Approve</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share">
            <Card>
              <CardHeader>
                <CardTitle>Share on Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowShareDialog(true)}>Share Upcoming Appointment</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Post</DialogTitle>
            <DialogDescription>
              Create a new post to share across your social media platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post-template" className="text-right">
                Template
              </Label>
              <Select
                value={selectedTemplate}
                onValueChange={(value) => {
                  setSelectedTemplate(value)
                  const template = postTemplates.find(t => t.id === value)
                  if (template) {
                    setNewPost({ ...newPost, content: template.content })
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {postTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>{template.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post-content" className="text-right">
                Content
              </Label>
              <Textarea
                id="post-content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post-platform" className="text-right">
                Platform
              </Label>
              <Select
                value={newPost.platform}
                onValueChange={(value) => setNewPost({ ...newPost, platform: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post-date" className="text-right">
                Date
              </Label>
              <Input
                id="post-date"
                type="datetime-local"
                value={newPost.date}
                onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSchedulePost}>Schedule Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Appointment</DialogTitle>
            <DialogDescription>
              Share your upcoming appointment on social media.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-date" className="text-right">
                Date
              </Label>
              <Input
                id="appointment-date"
                type="date"
                value={appointmentToShare.date}
                onChange={(e) => setAppointmentToShare({ ...appointmentToShare, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointment-type" className="text-right">
                Type
              </Label>
              <Input
                id="appointment-type"
                value={appointmentToShare.type}
                onChange={(e) => setAppointmentToShare({ ...appointmentToShare, type: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Dental Check-up"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="share-anonymous" />
              <Label htmlFor="share-anonymous">Share anonymously</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleShareAppointment}>Share Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => 
        window.open('/social-media-help', '_blank')}>
          Learn More About Social Media Integration
        </Button>
      </CardFooter>
    </Card>
  )
}