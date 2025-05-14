import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserIDContext } from '@/contexts/loginContext'

function AddReminderDialog({ onAddReminder }) {
  const [reminderText, setReminderText] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { userID } = React.useContext(UserIDContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!reminderText || !reminderTime) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // API call to save reminder to the database
      const response = await fetch('/api/account/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
          reminderText,
          timeToRemind: reminderTime // Using the same format as expected by the backend
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save reminder');
      }

      const data = await response.json();
      
      // Call the onAddReminder callback with the formatted time and reminderID from response
      onAddReminder({
        reminderID: data.reminderID,
        reminderText,
        reminderTime, // Pass the original 24-hour format time, let MainScreen handle formatting
        success: true // Add a success flag to indicate successful add
      });
      
      // Reset form and close dialog
      setReminderText('')
      setReminderTime('')
      setIsOpen(false)
    } catch (err) {
      console.error('Error creating reminder:', err)
      setError('Failed to create reminder. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // For debugging - log when component is rendered
  console.log('AddReminderDialog rendered, isOpen:', isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-900 text-white hover:bg-indigo-800 shadow-sm">
          Add Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Reminder</DialogTitle>
          <DialogDescription>
            Create a new reminder. Fill in the details and click save.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="reminderText" className="text-right font-medium">
              Reminder
            </label>
            <Input
              id="reminderText"
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              className="col-span-3"
              placeholder="Enter reminder text"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="reminderTime" className="text-right font-medium">
              Time
            </label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            onClick={handleSubmit}
            className="bg-indigo-900 text-white hover:bg-indigo-800 shadow-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save Reminder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddReminderDialog