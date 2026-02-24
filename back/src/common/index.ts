import { BadRequestException } from "@nestjs/common";

export function mergeIntervals(intervals: { start: Date; end: Date }[]): { start: Date; end: Date }[] {
    if (intervals.length === 0) return [];
  
    intervals.sort((a, b) => a.start.getTime() - b.start.getTime());
  
    const merged: { start: Date; end: Date }[] = [intervals[0]];
  
    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const last = merged[merged.length - 1];
  
      if (current.start.getTime() <= last.end.getTime()) {
        last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
      } else {
        merged.push(current);
      }
    }
  
    return merged;
  }

  export function formatDateToISO(date: string, time: string): Date {
    if (!date || !time || typeof date !== 'string' || typeof time !== 'string') {
      throw new BadRequestException('Date and time must be non-empty strings');
    }

    // Ожидаем формат даты YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
    }
 
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const testDate = new Date(year, month - 1, day, hours, minutes);
    if (
      isNaN(testDate.getTime()) ||
      testDate.getFullYear() !== year ||
      testDate.getMonth() + 1 !== month ||
      testDate.getDate() !== day
    ) {
      throw new BadRequestException('Invalid date or time values');
    }

    const dateTimeStr = `${date}T${time}:00`;
    const result = new Date(dateTimeStr);
    if (isNaN(result.getTime())) {
      throw new BadRequestException('Failed to parse date or time');
    }

    return result;
  }

  export function addMinutesToTime(time: string, minutesToAdd: number): string {
 
    const [hours, minutes] = time.split(':').map(Number);
    const total = hours * 60 + minutes + minutesToAdd;
    const normalized = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(normalized / 60)).padStart(2, '0');
    const mm = String(normalized % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  // Новые функции для работы с ISO форматом
  export function addMinutesToISO(isoString: string, minutesToAdd: number): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid ISO string format');
    }
    const newDate = new Date(date.getTime() + minutesToAdd * 60000);
    return newDate.toISOString().slice(0, 16); // Возвращаем yyyy-mm-ddThh:mm
  }

  export function parseISOToDate(isoString: string): Date {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid ISO string format');
    }
    return date;
  }

  export function formatISOToTime(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid ISO string format');
    }
    return date.toTimeString().slice(0, 5); // Возвращаем HH:MM
  }

export function formatISOToDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new BadRequestException('Invalid ISO string format');
  }
  return date.toISOString().slice(0, 10); // Возвращаем YYYY-MM-DD
}
