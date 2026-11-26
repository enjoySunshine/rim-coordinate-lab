export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Whether a value is a complete pair of finite coordinates.
 *
 * `NaN`, `Infinity`, `-Infinity`, missing fields, and non-number values are all
 * rejected. This guard exists before state assignment because Colyseus
 * Schema's dynamic number codec encodes those values as `0` or
 * `±Number.MAX_SAFE_INTEGER`, which would make room state and decoded clients
 * disagree.
 */
export function hasFiniteCoordinates(value: unknown): value is Coordinates {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const { x, y } = value as Record<string, unknown>;
  return Number.isFinite(x) && Number.isFinite(y);
}

/**
 * Resolve one movement frame atomically.
 *
 * If either coordinate is invalid, neither coordinate from the candidate is
 * used: the previous finite pair is returned. Callers can assign the result to
 * schema state; assigning unchanged values leaves the schema patch empty,
 * which is equivalent to omitting the fields for that tick.
 */
export function resolveCoordinates(
  candidate: unknown,
  previous: Coordinates,
): Coordinates {
  if (hasFiniteCoordinates(candidate)) {
    return { x: candidate.x, y: candidate.y };
  }

  return { x: previous.x, y: previous.y };
}
