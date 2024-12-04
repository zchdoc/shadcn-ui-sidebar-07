"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
}

const DateTimePicker = ({
  date,
  setDate,
  label = "Pick a date",
}: DateTimePickerProps) => {
  // Split the current time into hours, minutes, seconds
  const [hours, setHours] = React.useState(date ? date.getHours() : 0);
  const [minutes, setMinutes] = React.useState(date ? date.getMinutes() : 0);
  const [seconds, setSeconds] = React.useState(date ? date.getSeconds() : 0);

  // Update the main date when time changes
  React.useEffect(() => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(seconds);
      setDate(newDate);
    }
  }, [date, hours, minutes, seconds, setDate]);

  // Generate options for hours, minutes, and seconds
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i);
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i);
  const secondsOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm:ss") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              const updatedDate = new Date(newDate);
              updatedDate.setHours(hours);
              updatedDate.setMinutes(minutes);
              updatedDate.setSeconds(seconds);
              setDate(updatedDate);
            } else {
              setDate(undefined);
            }
          }}
          initialFocus
        />
        <div className="border-t p-3 flex gap-2">
          <Select
            value={hours.toString()}
            onValueChange={(value) => setHours(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent position="popper" className="h-48">
              {hoursOptions.map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={minutes.toString()}
            onValueChange={(value) => setMinutes(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent position="popper" className="h-48">
              {minutesOptions.map((minute) => (
                <SelectItem key={minute} value={minute.toString()}>
                  {minute.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={seconds.toString()}
            onValueChange={(value) => setSeconds(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="SS" />
            </SelectTrigger>
            <SelectContent position="popper" className="h-48">
              {secondsOptions.map((second) => (
                <SelectItem key={second} value={second.toString()}>
                  {second.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
