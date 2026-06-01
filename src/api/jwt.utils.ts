export function getUserIdFromAccessToken(accessToken: string | null | undefined): string | null {
  if (!accessToken) {
    return null;
  }

  const [, payloadSegment] = accessToken.split(".");

  if (!payloadSegment) {
    return null;
  }

  try {
    const normalizedPayload = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalizedPayload.length % 4;
    const paddedPayload =
      padding === 0
        ? normalizedPayload
        : normalizedPayload.padEnd(normalizedPayload.length + 4 - padding, "=");
    const payload = JSON.parse(atob(paddedPayload)) as { sub?: string };

    return typeof payload.sub === "string" && payload.sub.length > 0 ? payload.sub : null;
  } catch {
    return null;
  }
}
