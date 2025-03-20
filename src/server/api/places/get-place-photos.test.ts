import { rateLimit } from "../rate-limit";
import { logApiCall } from "@/utils/logger";
import { getPlacePhotos } from "./get-place-photos";

jest.mock("../rate-limit");
jest.mock("@/utils/logger");
jest.mock("./index", () => ({
  getPlacesApiKey: jest.fn().mockResolvedValue("test-api-key"),
  getPlacesUrl: jest.fn().mockResolvedValue("https://api.test.com"),
  getRequestedFields: jest.fn().mockResolvedValue(["field1", "field2"]),
}));

describe("getPlacePhotos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (rateLimit as jest.Mock).mockReturnValue(true);
    global.fetch = jest.fn();
  });

  it("should fetch places photos successfully", async () => {
    const mockResponse = [
      {
        id: "photo1",
        prefix: "some-prefix/",
        suffix: "/some-suffix",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getPlacePhotos("some-id");

    expect(result).toHaveLength(1);
    expect(result).toMatchObject(
      expect.arrayContaining([
        {
          id: "photo1",
          url: "some-prefix/800x600/some-suffix",
        },
      ]),
    );
  });

  describe("when rate limit exceeded", () => {
    it("should throw rate limit exceeded Error", async () => {
      (rateLimit as jest.Mock).mockReturnValue(false);

      await expect(getPlacePhotos("some-id")).rejects.toThrow(
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

      await expect(getPlacePhotos("some-id")).rejects.toThrow(
        "Unexpected Error",
      );

      expect(logApiCall).toHaveBeenCalledWith(
        expect.stringContaining("https://api.test.com/some-id/photos"),
        "GET",
        500,
        expect.any(Number),
        expect.any(Error),
      );
    });
  });
});
