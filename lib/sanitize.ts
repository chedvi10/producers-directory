/**
 * עוזרים להסרת שדות רגישים לפני החזרת נתונים ללקוח.
 * לעולם אין להחזיר את `passwordHash` של מפיקה ב-response.
 */

type WithPasswordHash = { passwordHash?: unknown };

/** מסיר את השדה passwordHash מאובייקט מפיקה בודד. */
export function stripProducerSecret<T extends WithPasswordHash>(
  producer: T
): Omit<T, 'passwordHash'> {
  const { passwordHash: _passwordHash, ...safe } = producer;
  return safe;
}

/** מסיר את passwordHash מהמפיקה המקוננת בתוך אובייקט (למשל תוכנית עם include producer). */
export function stripNestedProducerSecret<
  T extends { producer: WithPasswordHash }
>(entity: T): Omit<T, 'producer'> & { producer: Omit<T['producer'], 'passwordHash'> } {
  return {
    ...entity,
    producer: stripProducerSecret(entity.producer),
  };
}
