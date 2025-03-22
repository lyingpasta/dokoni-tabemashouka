import { useQuery } from "@tanstack/react-query";
import { getNearbyPlaces } from "@/server/api/places";
import { center } from "@/domain/value-objects/places";

interface UsePlacesParams {
  query: string;
  categories: string[];
  rate?: number;
  enabled?: boolean;
}

export function usePlaces({
  query,
  categories,
  rate,
  enabled = true,
}: UsePlacesParams) {
  return useQuery({
    queryKey: ["places", query, categories, rate],
    queryFn: async () => {
      return getNearbyPlaces([center[0], center[1]], categories, query, rate);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
