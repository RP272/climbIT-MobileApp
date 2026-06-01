const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const UUID_IN_TEXT_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export type QrNavigationTarget =
  | {
      type: "route";
      id: string;
    }
  | {
      type: "gym";
      id: string;
    };

function extractUuid(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (UUID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const uuidMatch = trimmed.match(UUID_IN_TEXT_PATTERN);

  return uuidMatch?.[0] ?? null;
}

function extractPathSegment(value: string, segment: "routes" | "gyms" | "facilities") {
  const match = value.match(new RegExp(`(?:^|/)${segment}/([^/?#]+)`, "i"));

  if (!match?.[1]) {
    return null;
  }

  return extractUuid(match[1]) ?? match[1];
}

export function parseRouteIdFromQrData(data: string): string | null {
  const trimmed = data.trim();

  if (!trimmed) {
    return null;
  }

  const routeFromPath = extractPathSegment(trimmed, "routes");

  if (routeFromPath) {
    return routeFromPath;
  }

  return extractUuid(trimmed);
}

export function parseGymIdFromQrData(data: string): string | null {
  const trimmed = data.trim();

  if (!trimmed) {
    return null;
  }

  return extractPathSegment(trimmed, "gyms") ?? extractPathSegment(trimmed, "facilities");
}

export function parseQrNavigationTarget(data: string): QrNavigationTarget | null {
  const gymId = parseGymIdFromQrData(data);

  if (gymId) {
    return { type: "gym", id: gymId };
  }

  const routeId = parseRouteIdFromQrData(data);

  if (routeId) {
    return { type: "route", id: routeId };
  }

  return null;
}
