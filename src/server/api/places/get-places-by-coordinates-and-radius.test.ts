import { getNearbyPlaces } from "./get-places-by-coordinates-and-radius";
import { rateLimit } from "../rate-limit";
import { logApiCall } from "@/utils/logger";

jest.mock("../rate-limit");
jest.mock("@/utils/logger");
jest.mock("./index", () => ({
  getPlacesApiKey: jest.fn().mockResolvedValue("test-api-key"),
  getPlacesUrl: jest.fn().mockResolvedValue("https://api.test.com"),
  getRequestedFields: jest.fn().mockResolvedValue(["field1", "field2"]),
}));

describe("getNearbyPlaces", () => {
  const mockCoordinates = [35.6594, 139.7005];
  const mockCategories = ["food"];
  const mockQuery = "test";

  beforeEach(() => {
    jest.clearAllMocks();
    (rateLimit as jest.Mock).mockReturnValue(true);
    global.fetch = jest.fn();
  });

  it("should fetch places successfully", async () => {
    const mockResponse = {
      results: [
        {
          fsq_id: "123",
          name: "Test Place",
          geocodes: {
            main: {
              latitude: 35.6594,
              longitude: 139.7005,
            },
          },
          categories: [
            {
              id: "cat1",
              name: "Category 1",
            },
          ],
          distance: 100,
          price: 2,
          link: "https://test.com",
          rating: 4.5,
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getNearbyPlaces(
      mockCoordinates,
      mockCategories,
      mockQuery,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "123",
      name: "Test Place",
      coordinates: [35.6594, 139.7005],
      category: {
        id: "cat1",
        label: "Category 1",
      },
      distance: 100,
      price: 2,
      link: "https://test.com",
      rating: 4.5,
    });

    expect(logApiCall).toHaveBeenCalledWith(
      expect.stringContaining("https://api.test.com/search"),
      "GET",
      200,
      expect.any(Number),
    );
  });

  describe("when rate limit exceeded", () => {
    it("should throw rate limit exceeded Error", async () => {
      (rateLimit as jest.Mock).mockReturnValue(false);

      await expect(
        getNearbyPlaces(mockCoordinates, mockCategories, mockQuery),
      ).rejects.toThrow("Rate limit exceeded. Please try again later.");
    });
  });

  describe("when API error response", () => {
    it("should throw an Unexpected Error and log the original", async () => {
      const errorResponse = {
        message: "API Error",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 500,
        json: () => Promise.resolve(errorResponse),
        statusText: "Internal Server Error",
      });

      await expect(
        getNearbyPlaces(mockCoordinates, mockCategories, mockQuery),
      ).rejects.toThrow("Unexpected Error");

      expect(logApiCall).toHaveBeenCalledWith(
        expect.stringContaining("https://api.test.com/search"),
        "GET",
        500,
        expect.any(Number),
        expect.any(Error),
      );
    });
  });
});
