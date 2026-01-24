/**
 * Extracts initials from a name string.
 * - Single name: returns first 2 characters uppercase (e.g., "John" → "JO")
 * - Multiple names: returns first letter of first name + first letter of last name (e.g., "John Doe" → "JD")
 * - Handles edge cases like empty strings and extra spaces
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
