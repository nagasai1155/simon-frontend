"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[220px] h-9 justify-start text-left font-normal bg-background border-border hover:bg-accent hover:text-accent-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM dd")} - {format(date.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(date.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-xl border-2 border-border bg-card" align="start">
          <div className="p-4 border-b border-border bg-muted/30">
            <h4 className="font-semibold text-sm text-foreground">Select Date Range</h4>
            <p className="text-xs text-muted-foreground mt-1">Choose your custom date range</p>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="p-4"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
              month: "space-y-4 border border-border rounded-lg p-3 bg-muted/20",
              caption: "flex justify-center pt-1 relative items-center mb-2",
              caption_label: "text-sm font-semibold text-foreground",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex mb-1",
              head_cell: "text-muted-foreground rounded-md w-9 h-9 font-normal text-[0.8rem] flex items-center justify-center border border-transparent",
              row: "flex w-full mt-1",
              cell: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center border border-transparent rounded-md hover:border-border transition-colors [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent transition-colors",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground border-primary",
              day_today: "bg-accent text-accent-foreground border-accent-foreground/20",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
