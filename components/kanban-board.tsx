"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

// Types
type KanbanTask = {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  status: string
  nextAction: string
  modifiedDate: string
  notes?: string
}

type KanbanColumn = {
  id: string
  title: string
  tasks: KanbanTask[]
}

type KanbanBoardProps = {
  initialColumns?: KanbanColumn[]
  onTaskMove?: (result: any) => void
  onAddTask?: (columnId: string) => void
  onTaskClick?: (task: KanbanTask) => void
}

// Sample data - this would come from your backend later
const sampleColumns: KanbanColumn[] = [
  {
    id: "contacted",
    title: "Contacted",
    tasks: [
      {
        id: "task-1",
        name: "Acme Corporation",
        contact: "John Smith",
        email: "john@acme.com",
        phone: "+1 (555) 123-4567",
        status: "contacted",
        nextAction: "Wait for reply",
        modifiedDate: "2025-05-24",
        notes: "Interested in our enterprise solution",
      },
    ],
  },
  {
    id: "replied",
    title: "Replied",
    tasks: [
      {
        id: "task-2",
        name: "Globex Industries",
        contact: "Sarah Johnson",
        email: "sarah@globex.com",
        phone: "+1 (555) 987-6543",
        status: "replied",
        nextAction: "Schedule demo call",
        modifiedDate: "2025-05-23",
        notes: "Asked about pricing and implementation timeline",
      },
    ],
  },
  {
    id: "booked",
    title: "Booked",
    tasks: [
      {
        id: "task-3",
        name: "Wayne Enterprises",
        contact: "Bruce Wayne",
        email: "bruce@wayne.com",
        phone: "+1 (555) 555-5555",
        status: "booked",
        nextAction: "Prepare for meeting on 5/30",
        modifiedDate: "2025-05-22",
        notes: "Demo call scheduled for May 30th at 2pm",
      },
    ],
  },
  {
    id: "followed-up",
    title: "Followed Up",
    tasks: [
      {
        id: "task-4",
        name: "Stark Industries",
        contact: "Tony Stark",
        email: "tony@stark.com",
        phone: "+1 (555) 111-2222",
        status: "followed-up",
        nextAction: "Follow up again in 2 days",
        modifiedDate: "2025-05-21",
        notes: "Sent follow-up email with additional information",
      },
    ],
  },
]

// Status color mapping
const statusColors = {
  contacted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  replied: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  booked: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "followed-up": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export default function KanbanBoard({
  initialColumns = sampleColumns,
  onTaskMove,
  onAddTask,
  onTaskClick,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns)

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Find source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [movedTask] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, movedTask)

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: newTasks }
        }
        return col
      })

      setColumns(newColumns)
    } else {
      // Moving to another column
      const sourceTasks = Array.from(sourceColumn.tasks)
      const [movedTask] = sourceTasks.splice(source.index, 1)

      // Update the task's status to match the new column
      const updatedTask = { ...movedTask, status: destColumn.id }

      const destTasks = Array.from(destColumn.tasks)
      destTasks.splice(destination.index, 0, updatedTask)

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: sourceTasks }
        }
        if (col.id === destColumn.id) {
          return { ...col, tasks: destTasks }
        }
        return col
      })

      setColumns(newColumns)
    }

    // Call the callback if provided
    if (onTaskMove) {
      onTaskMove(result)
    }
  }

  const handleAddTask = (columnId: string) => {
    if (onAddTask) {
      onAddTask(columnId)
    } else {
      // Default implementation for demo purposes
      const newTaskId = `task-${Date.now()}`
      const newTask: KanbanTask = {
        id: newTaskId,
        name: `New Lead ${newTaskId}`,
        contact: "Contact Name",
        email: "contact@example.com",
        phone: "+1 (555) 000-0000",
        status: columnId,
        nextAction: "Initial contact",
        modifiedDate: new Date().toISOString().split("T")[0],
      }

      const newColumns = columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, tasks: [...col.tasks, newTask] }
        }
        return col
      })

      setColumns(newColumns)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="bg-muted/30 dark:bg-muted/20 rounded-lg">
              <div className="p-3 font-medium flex items-center justify-between">
                <h3 className="text-sm">
                  {column.title} <span className="text-muted-foreground ml-1 text-xs">({column.tasks.length})</span>
                </h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleAddTask(column.id)}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="p-2 min-h-[200px]">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 cursor-pointer ${snapshot.isDragging ? "opacity-70" : ""}`}
                            onClick={() => onTaskClick && onTaskClick(task)}
                          >
                            <CardContent className="p-3">
                              <div className="text-sm font-medium mb-1">{task.name}</div>
                              <div className="text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="font-medium">{task.contact}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{task.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{task.phone}</span>
                                </div>
                              </div>
                              <div className="text-xs font-medium mt-2">Next: {task.nextAction}</div>
                              <div className="flex flex-wrap gap-1.5 mt-2 justify-between items-center">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.modifiedDate).toLocaleDateString()}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={statusColors[task.status as keyof typeof statusColors]}
                                >
                                  {column.title}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
