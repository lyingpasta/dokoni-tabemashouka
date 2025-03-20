import { useQuery } from "@tanstack/react-query";
import { getNearbyPlaces } from "@/server/api/places";
import { center } from "@/domain/value-objects/places";
import { DINING_AND_DRINKING_CATEGORY_ID } from "@/domain/value-objects/categories";

interface UsePlacesParams {
  query: string;
  categories: string[];
  enabled?: boolean;
}

export function usePlaces({
  query,
  categories,
  enabled = true,
}: UsePlacesParams) {
  return useQuery({
    queryKey: ["places", query, categories],
    queryFn: async () => {
      const activeCategories =
        categories.length > 0 ? categories : [DINING_AND_DRINKING_CATEGORY_ID];

      return getNearbyPlaces([center[0], center[1]], activeCategories, query);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
