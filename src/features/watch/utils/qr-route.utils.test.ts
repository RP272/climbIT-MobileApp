import {
  parseGymIdFromQrData,
  parseQrNavigationTarget,
  parseRouteIdFromQrData,
} from "@/src/features/watch/utils/qr-route.utils";

describe("qr-route utils", () => {
  const routeId = "2b56c444-a892-43ff-8f44-e3341db889e3";
  const gymId = "550e8400-e29b-41d4-a716-446655440000";

  it("parses raw route uuid", () => {
    expect(parseRouteIdFromQrData(routeId)).toBe(routeId);
  });

  it("parses route uuid from path without leading slash", () => {
    expect(parseRouteIdFromQrData(`routes/${routeId}`)).toBe(routeId);
  });

  it("parses gym uuid from url", () => {
    expect(parseGymIdFromQrData(`https://example.com/gyms/${gymId}`)).toBe(gymId);
    expect(parseGymIdFromQrData(`https://example.com/facilities/${gymId}`)).toBe(gymId);
  });

  it("prefers gym target when gym path is present", () => {
    expect(parseQrNavigationTarget(`https://example.com/gyms/${gymId}`)).toEqual({
      type: "gym",
      id: gymId,
    });
  });

  it("returns route target for route urls and raw uuids", () => {
    expect(parseQrNavigationTarget(`https://example.com/routes/${routeId}`)).toEqual({
      type: "route",
      id: routeId,
    });
    expect(parseQrNavigationTarget(routeId)).toEqual({
      type: "route",
      id: routeId,
    });
  });
});
