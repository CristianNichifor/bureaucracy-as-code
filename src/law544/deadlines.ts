const DAY_MS = 24 * 60 * 60 * 1000;

// Law 544/2001 art. 7(1): answer within 10 days of registration, or at most 30 days when the
// applicant is told in writing within those 10 days. Art. 7(2): a refusal within 5 days.
export const LAW544_RESPONSE_DAYS = 10;
export const LAW544_EXTENDED_RESPONSE_DAYS = 30;
export const LAW544_REFUSAL_DAYS = 5;

export function calculateLaw544Deadline(createdAt: string, days = LAW544_RESPONSE_DAYS): string {
  return new Date(new Date(createdAt).getTime() + days * DAY_MS).toISOString();
}

export function calculateExtendedLaw544Deadline(createdAt: string): string {
  return calculateLaw544Deadline(createdAt, LAW544_EXTENDED_RESPONSE_DAYS);
}

export function isOverdue(deadlineAt: string, now = new Date()): boolean {
  return now.getTime() > new Date(deadlineAt).getTime();
}
