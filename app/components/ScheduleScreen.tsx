

"use client"

import { useState } from "react"
import { ClipboardList } from "lucide-react"
import TaskHeader from "./TaskHeader"
import TaskCreateModal from "./TaskCreateModal"
import ScheduleTaskCard from "./ScheduleTaskCard"

export default function ScheduleScreen() {

  const [tasks, setTasks] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleCreateTask = (newTask: any) => {
    setTasks(prev => [...prev, newTask])
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Fixed Task Header */}
      <div className="fixed top-[70px] left-0 right-0 z-40 px-4 py-2 bg-[#0B0F1A] border-b border-gray-800">
        <TaskHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onCreateClick={() => setIsModalOpen(true)}
        />
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-center px-6">
            
            <div className="w-16 h-16 rounded-2xl bg-[#1F2937] flex items-center justify-center mb-4 shadow-inner">
              <ClipboardList className="text-green-400" size={28} />
            </div>

            <h3 className="text-white font-semibold text-lg">
              No Tasks Scheduled
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              You don't have any tasks for this date yet.  
              Tap <span className="text-green-400 font-medium">New Task</span> to get started.
            </p>

          </div>
        </div>
      ) : (
        <div className="pt-[150px] pb-20">
          <div className="relative">

            {/* Vertical Timeline Line */}
            <div className="absolute left-6 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-700" />

            <div className="flex flex-col gap-5">
              {[...tasks]
                .sort((a, b) =>
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                )
                .map(task => (
                  <ScheduleTaskCard key={task.id} task={task} />
              ))}
            </div>

          </div>
        </div>
      )}

      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={selectedDate}
        onCreate={handleCreateTask}
      />

    </div>
  )
}


