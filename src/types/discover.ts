export type Gym = {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  newRoutesCount: number;
  rating: number;
  imageUrl: string;
  tags: readonly string[];
};

export type RouteStyleTags = readonly [string] | readonly [string, string];

export type RecommendedRoute = {
  id: string;
  grade: string;
  name: string;
  gymName: string;
  sector: string;
  climbingType: string;
  imageUrl: string;
  styleTags: RouteStyleTags;
  recommendationReason: string;
  badge?: string;
};
