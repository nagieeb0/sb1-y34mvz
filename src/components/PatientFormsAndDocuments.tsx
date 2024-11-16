'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { FileText, Plus, Edit, Trash2, Download, Send } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const formTemplates = [
  { id: '1', name: 'Medical History', fields: [
    { id: 'f1', type: 'text', label: 'Full Name' },
    { id: 'f2', type: 'checkbox', label: 'Do you have any allergies?' },
    { id: 'f3', type: 'textarea', label: 'Please list your current medications' },
  ]},
  { id: '2', name: 'Consent to Treat', fields: [
    { id: 'f4', type: 'text', label: 'Patient Name' },
    { id: 'f5', type: 'checkbox', label: 'I consent to dental treatment' },
    { id: 'f6', type: 'signature', label: 'Signature' },
  ]},
]

const patientForms = [
  { id: '1', name: 'Medical History - John Doe', status: 'Completed', date: '2023-07-15' },
  { id: '2', name: 'Consent to Treat - Jane Smith', status: 'Pending', date: '2023-07-20' },
]

export default function PatientFormsAndDocuments({ userId, userType }: { userId: string, userType: 'patient' | 'staff' }) {
  const [activeTab, setActiveTab] = useState('forms')
  const [formFields, setFormFields] = useState<any[]>([])
  const [formName, setFormName] = useState('')
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')

  useEffect(() => {
    // In a real application, fetch form templates and patient forms from Supabase here
  }, [userId])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(formFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setFormFields(items)
  }

  const addField = (type: string) => {
    setFormFields([...formFields, { id: `new-${Date.now()}`, type, label: `New ${type} field` }])
  }

  const updateField = (id: string, newLabel: string) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, label: newLabel } : field
    ))
  }

  const removeField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id))
  }

  const handleCreateForm = () => {
    // In a real application, save the new form to Supabase here
    toast({
      title: "Form Created",
      description: `${formName} has been created successfully.`,
    })
    setShowFormDialog(false)
    setFormName('')
    setFormFields([])
  }

  const handleUseTemplate = () => {
    const template = formTemplates.find(t => t.id === selectedTemplate)
    if (template) {
      setFormName(template.name)
      setFormFields(template.fields)
    }
  }

  const handleSendReminder = (formId: string) => {
    // In a real application, send a reminder to the patient here
    toast({
      title: "Reminder Sent",
      description: "A reminder has been sent to the patient to complete the form.",
    })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FileText className="mr-2 h-6 w-6" />
          Patient Forms and Documents
        </CardTitle>
        <CardDescription>Manage patient forms and documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="create" disabled={userType !== 'staff'}>Create Form</TabsTrigger>
          </TabsList>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>{userType === 'patient' ? 'My Forms' : 'Patient Forms'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell>{form.name}</TableCell>
                        <TableCell>{form.status}</TableCell>
                        <TableCell>{form.date}</TableCell>
                        <TableCell>
                          {userType === 'patient' && form.status === 'Pending' && (
                            <Button size="sm">Complete Form</Button>
                          )}
                          {userType === 'staff' && (
                            <>
                              <Button size="sm" variant="outline" className="mr-2">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                              {form.status === 'Pending' && (
                                <Button size="sm" onClick={() => handleSendReminder(form.id)}>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Reminder
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Form</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="form-name">Form Name</Label>
                    <Input
                      id="form-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter form name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template">Use Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {formTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="mt-2" onClick={handleUseTemplate}>Use Selected Template</Button>
                  </div>
                  <div>
                    <Label>Form Fields</Label>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="form-fields">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {formFields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center space-x-2 mb-2 p-2 bg-secondary rounded-md"
                                  >
                                    <Input
                                      value={field.label}
                                      onChange={(e) => updateField(field.id, e.target.value)}
                                      className="flex-grow"
                                    />
                                    <span className="text-sm text-muted-foreground">{field.type}</span>
                                    <Button size="sm" variant="destructive" onClick={() => removeField(field.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={() => addField('text')}>Add Text Field</Button>
                      <Button onClick={() => addField('checkbox')}>Add Checkbox</Button>
                      <Button onClick={() => addField('textarea')}>Add Text Area</Button>
                      <Button onClick={() => addField('signature')}>Add Signature</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateForm}>Create Form</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset
        </Button>
        <Button variant="link" onClick={() => window.open('/forms-help', '_blank')}>
          Learn More About Forms & Documents
        </Button>
      </CardFooter>

      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              Design your custom form by adding and arranging fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="form-name" className="text-right">
                Form Name
              </Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* Add form field creation interface here */}
          </div>
          <DialogFooter>
            <Button onClick={handleCreateForm}>Create Form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}