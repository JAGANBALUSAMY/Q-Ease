import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function getInitials(name) {
  if (!name || !name.trim()) return '?'
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'
}

export function getStatusColor(status) {
  const colors = {
    PENDING: 'warning',
    CALLED: 'destructive',
    SERVING: 'info',
    SERVED: 'success',
    CANCELLED: 'muted',
    SKIPPED: 'muted'
  }
  return colors[status] || 'muted'
}
