import React from 'react'
import { Switch } from '@/components/ui/switch'

function ReminderItem({reminderText, reminderTime}) {
  return (
    <div className='flex items-center justify-between py-3 bg-slate-100 rounded-sm shadow-md px-2'>
        <div className='flex items-center gap-4'>
            <Switch />
            <h1 className='font-medium'>{reminderText}</h1>
        </div>
        <div>
            <h1 className='font-medium'>{reminderTime}</h1>
        </div>
    </div>
  )
}

export default ReminderItem