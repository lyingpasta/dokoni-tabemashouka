import { rateLimit } from "../rate-limit";
import { logApiCall } from "@/utils/logger";
import { getPlaceDetails } from "./get-place-details";

jest.mock("../rate-limit");
jest.mock("@/utils/logger");
jest.mock("./index", () => ({
  getPlacesApiKey: jest.fn().mockResolvedValue("test-api-key"),
  getPlacesUrl: jest.fn().mockResolvedValue("https://api.test.com"),
  getRequestedFields: jest.fn().mockResolvedValue(["field1", "field2"]),
}));

describe("getPlaceDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (rateLimit as jest.Mock).mockReturnValue(true);
    global.fetch = jest.fn();
  });

  it("should fetch places details successfully", async () => {
    const mockResponse = {
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
      location: {
        formatted_address: "some-address",
      },
      description: "some-description",
      email: "some-email",
      tel: "001122003",
      hours: {
        display: "24/7",
        open_now: true,
      },
      verified: true,
      website: "some-web",
      menu: "some-menu",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getPlaceDetails("some-id");

    expect(result).toMatchObject({
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
      address: "some-address",
      description: "some-description",
      email: "some-email",
      tel: "001122003",
      hours: "24/7",
      isOpenNow: true,
      isVerified: true,
      website: "some-web",
      menu: "some-menu",
    });
  });

  describe("when rate limit exceeded", () => {
    it("should throw rate limit exceeded Error", async () => {
      (rateLimit as jest.Mock).mockReturnValue(false);

      await expect(getPlaceDetails("some-id")).rejects.toThrow(
        "Rate limit exceeded. Please try again later.",
      );
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

      await expect(getPlaceDetails("some-id")).rejects.toThrow(
        "Unexpected Error",
      );

      expect(logApiCall).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.test.com/some-id?fields=field1%2Cfield2",
        ),
        "GET",
        500,
        expect.any(Number),
        expect.any(Error),
      );
    });
  });
});
