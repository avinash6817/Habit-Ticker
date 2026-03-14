

"use client"

import { useState } from "react"
import { ClipboardList } from "lucide-react"

import TaskHeader from "./TaskHeader"
import TaskCreateModal from "./TaskCreateModal"
import TaskCard from "./TaskCard"
import ConfirmActionModal from "../ConfirmActionModal"

import { Task, TaskInput } from "@/app/types/task"
import { playCompleteSound } from "@/lib/sound/playSound"

import { createTaskAction, deleteTaskAction, toggleTaskCompletionAction } from "@/app/actions/task"

export default function TasksScreen({tasks, setTasks, loading} : {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  loading: boolean
}) {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)


  const handleCreateTask = async (newTask: TaskInput) => {

    const createdTask = await createTaskAction({
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      taskScheduledTime: newTask.taskScheduledTime,
      reminderOffsetMinutes: newTask.reminderOffsetMinutes,
      priority: newTask.priority,
      category: newTask.category,
      completed: newTask.completed
    })

    const task = createdTask as Task

    setTasks(prev => [...prev, task])

  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    )
  }

  const handleRequestDelete = (task: Task) => {
    setTaskToDelete(task)
    setIsDeleteOpen(true)
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await deleteTaskAction(taskToDelete.id)

      // await cancelReminder(taskToDelete.id)

      setTasks(prev =>
        prev.filter(task => task.id !== taskToDelete.id)
      )

      setTaskToDelete(null)

    } 
    catch (error) {
      console.error("Delete failed", error)
    }
  }

  const handleToggleComplete = async (task: Task) => {
    const willBeCompleted = !task.completed

    setTasks(prev =>
      prev.map(t =>
        t.id === task.id
          ? { ...t, completed: !t.completed }
          : t
      )
    )

   if (willBeCompleted) {
      playCompleteSound()
    }

    await toggleTaskCompletionAction(task.id)
  }

  const sortedTasks = [...tasks].sort(
    (a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  const groupedTasks = sortedTasks.reduce((acc: any, task) => {
    const dateKey = new Date(task.dueDate).toDateString()

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }

    acc[dateKey].push(task)

    return acc
  }, {})

  return (
    <div className="min-h-screen flex flex-col">

      {/* Fixed Task Header */}
      <div className="fixed top-[70px] left-0 right-0 z-40 px-4 py-2 bg-[#0B0F1A]">
        <TaskHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onCreateClick={() => setIsModalOpen(true)}
        />
      </div>

      {loading ? (
          <div className="flex flex-col gap-5 px-4 pt-[170px] pb-20">
            {[...Array(6)].map((_, i) => (
              <div className="flex items-center gap-4 bg-[#1F2937] rounded-2xl p-4 animate-pulse"
                key={i}
                >
  
                <div className="w-10 h-10 rounded-full bg-gray-700" />

                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-32 bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-700 rounded" />
                </div>

              </div>
            ))}
          </div>
          ) : tasks.length === 0 ? (
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
        <div className="pt-[170px] pb-20">
          <div className="relative">

            {/* Vertical Timeline Line */}
            <div className="absolute left-6 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-700" />

            <div className="flex flex-col gap-5">
              
              {Object.entries(groupedTasks).map(([date, tasksForDate]: any) => (
                <div key={date} className="flex flex-col">

                  {tasksForDate.map((task: any, index: number) => (
                    <div key={task.id} className="relative">

                      {/* Nested connector (only for second+ tasks) */}
                      {index > 0 && (
                        <div
                          className="
                            absolute
                            left-[70px]
                            -top-5
                            w-[2px]
                            h-10
                            bg-gray-700
                          "
                        />
                      )}

                      <div className={index > 0 ? "ml-12 mt-4" : ""}>
                        <TaskCard
                          task={task}
                          onEdit={(task) => {
                            setEditingTask(task)
                            setIsModalOpen(true)
                          }}
                          onToggleComplete={handleToggleComplete}
                          onDelete={(task) => handleRequestDelete(task)}
                        />
                      </div>

                    </div>
                  ))}

                </div>
              ))}

            </div>

          </div>
        </div>
      )}

      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        defaultDate={selectedDate}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />


      <ConfirmActionModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setTaskToDelete(null)
        }}
        onConfirm={handleDeleteTask}
        title="Delete Task ?"
        description={
          <>
            This action will permanently delete{" "}
            <span className="text-white font-medium">
              {taskToDelete?.title}
            </span>.
          </>
        }
        confirmText="Delete"
        confirmColor="red"
      />

    </div>
  )
}