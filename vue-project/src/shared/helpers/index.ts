import type { ILessonSlotEvent } from "@/features/mentor-availability/types";
import type { IMessage } from "@/features/messages/types";
import { notifyError, notifySuccess } from "../config/notifications";
import {format} from "date-fns";

export function parseToDto(slot: ILessonSlotEvent) {
  return {
    date: slot._.startFormatted,
    start: dateToHHmm(slot.start),
    end: dateToHHmm(slot.end),
  }
}


function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function dateToHHmm(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function dateToISOS(date: Date): string  {
  // Создаём строку в формате локального времени
  return format(date, 'yyyy-MM-dd');
}

export function createMessageTime(aDate: Date) {
  const localDate = new Date(aDate)
  const date = localDate.toISOString().slice(0, 10)
  const time = localDate.toTimeString().split(' ')[0]

  return `${date} ${time}`
}


export function scrollToBottom(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  el.scrollTop = el.scrollHeight

}


export function normalizeMessage(userId: number, message: IMessage) {
  const newMessage = {
    ...message,
    messageId: message.id,
    position: userId === message.sender.id ? 'right' : 'left',
    subText: message.sender.fullname,
    avatar: "https://placehold.jp/30/336633/ffffff/64x64.png?text=SD",
    time: createMessageTime(message.createdAt),
    status: message.readAt ? 'read' : 'sent',
    readAt: message.readAt,
  };

  console.log(newMessage)
  return newMessage;
}

export function generateImageUrl(imageUrl: string | undefined | null) {
  if (!imageUrl) {
    return;
  }

  return `http://mentmind.ru/api/${imageUrl}`
}



export function tagsFromBackend(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
}

export function tagsToBackend(tags: string[]): string {
  return tags.join(', ')
}

export function saveClipboard(text: string | undefined) {
  if (!text) {
    return;
  }

  navigator.clipboard.writeText(text).then(() => notifySuccess('Ссылка скопирована')).catch(() => notifyError('Произошла ошибка'))
}


export function getWeekStartMonday(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 (Вс) - 6 (Сб)

  // Вычисляем разницу до понедельника
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  const weekStart = new Date(date.setDate(diff));
  return weekStart.toISOString().split('T')[0]; // Формат YYYY-MM-DD
}
export function getWeekSunday(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 (Вс) - 6 (Сб)

  // Вычисляем разницу до воскресенья
  const diff = date.getDate() + (7 - day);

  const sunday = new Date(date.setDate(diff));
  return sunday.toISOString().split('T')[0]; // Формат YYYY-MM-DD
}