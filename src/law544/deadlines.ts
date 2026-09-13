const DAY_MS = 24 * 60 * 60 * 1000;

export function calculateLaw544Deadline(createdAt: string, days = 30): string {
  return new Date(new Date(createdAt).getTime() + days * DAY_MS).toISOString();
}

export function isOverdue(deadlineAt: string, now = new Date()): boolean {
  return now.getTime() > new Date(deadlineAt).getTime();
}
