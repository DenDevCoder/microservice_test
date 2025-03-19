export function handleError(error: unknown, defaultMessage: string) {
  const message = error instanceof Error ? error.message : defaultMessage;
  throw new Error(message);
}
