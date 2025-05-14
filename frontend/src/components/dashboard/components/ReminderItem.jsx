import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Trash2 } from 'lucide-react'

function ReminderItem({reminderID, reminderText, reminderTime, onDelete}) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(reminderID);
    }
  };

  return (
    <div className='flex items-center justify-between py-3 bg-slate-100 rounded-sm shadow-md px-2'>
        <div className='flex items-center gap-4'>
            <Switch />
            <h1 className='font-medium'>{reminderText}</h1>
        </div>
        <div className='flex items-center gap-2'>
            <h1 className='font-medium'>{reminderTime}</h1>
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
        </div>
    </div>
  )
}

export default ReminderItem