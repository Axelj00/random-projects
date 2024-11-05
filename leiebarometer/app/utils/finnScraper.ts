// app/utils/finnScraper.ts

import axios from "axios";
import * as cheerio from "cheerio";

// Constants
const BASE_BUY_URL = "https://www.finn.no/realestate/homes/search.html";
const BASE_RENTAL_URL = "https://www.finn.no/realestate/lettings/search.html";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/58.0.3029.110 Safari/537.3",
};

// Define and export interfaces
export interface BuyListing {
  title: string;
  listing_url: string;
  address: string;
  size_m2: string;
  price_kr: string;
  total_price_kr: number | string;
  fellesutgifter_kr: number | string;
  ownership_type: string;
  number_of_rooms: string;
  viewing_info: string;
  estimated_rent_kr?: string;
  annual_rent_kr?: string;
  yield_percentage?: string;
}

export interface RentalListing {
  title: string;
  listing_url: string;
  address: string;
  size_m2: string;
  rental_price_kr: string;
  ownership_type: string;
  number_of_rooms: string;
  price_per_sqm?: string;
}

// Unwanted keywords to filter out
const UNWANTED_KEYWORDS = ["hybel", "rom i bofelleskap", "bofelleskap", "ledig rom"];

// Helper function to check if a listing is unwanted
const isUnwanted = (title: string): boolean => {
  const lowerTitle = title.toLowerCase();
  return UNWANTED_KEYWORDS.some((keyword) => lowerTitle.includes(keyword));
};

// Generalized function to fetch listings
const fetchListings = async <T>(
  url: string,
  params: Record<string, string>,
  maxListings: number,
  parseListing: (element: cheerio.Element, $: cheerio.Root) => T | null
): Promise<T[]> => {
  const listings: T[] = [];
  let page = 1;

  while (listings.length < maxListings) {
    const searchParams = new URLSearchParams({
      ...params,
      page: page.toString(),
    });

    try {
      const response = await axios.get(`${url}?${searchParams.toString()}`, {
        headers: HEADERS,
      });

      if (response.status !== 200) {
        console.error(`Failed to retrieve page ${page} (Status Code: ${response.status})`);
        break;
      }

      const $ = cheerio.load(response.data);
      const articles = $("article.sf-search-ad");

      if (articles.length === 0) {
        console.log(`No articles found on page ${page}. Ending pagination.`);
        break;
      }

      articles.each((_, element) => {
        if (listings.length >= maxListings) return;
        const listing = parseListing(element, $);
        if (listing) {
          listings.push(listing);
        }
      });

      console.log(`Processed page ${page} with ${articles.length} listings.`);
      page += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    } catch (error) {
      console.error(`Error fetching listings: ${error}`);
      break;
    }
  }

  return listings;
};

// Updated getBuyListings function
export const getBuyListings = async (
  params: Record<string, string>,
  maxListings: number = 200
): Promise<BuyListing[]> => {
  return fetchListings<BuyListing>(
    BASE_BUY_URL,
    params,
    maxListings,
    (element, $) => {
      try {
        const titleTag = $(element).find("h2.sf-realestate-heading a");
        const title = titleTag.text().trim() || "N/A";

        // Filter out unwanted listings
        if (isUnwanted(title)) return null;

        const listingUrl = titleTag.attr("href")
          ? `https://www.finn.no${titleTag.attr("href")}`
          : "N/A";

        const address = $(element)
          .find("div.sf-realestate-location span.text-s")
          .text()
          .trim() || "N/A";

        const sizePriceDiv = $(element).find("div.flex.justify-between");
        const size = sizePriceDiv
          .find("span")
          .first()
          .text()
          .replace(/\s/g, "")
          .replace("m²", "")
          .trim() || "N/A";
        const price = sizePriceDiv
          .find("span")
          .last()
          .text()
          .replace(/\s/g, "")
          .replace("kr", "")
          .trim() || "N/A";

        const detailsDiv = $(element).find("div.text-xs.s-text-subtle");
        let total_price_kr: number | string = "N/A";
        let fellesutgifter_kr: number | string = "N/A";

        const detailsText = detailsDiv.text().replace(/\xa0/g, " ").replace(/\u202f/g, " ");
        const totalPriceMatch = detailsText.match(/Totalpris:\s*([\d\s]+) kr/);
        if (totalPriceMatch) {
          const totalPriceStr = totalPriceMatch[1].replace(/\s/g, "");
          total_price_kr = parseInt(totalPriceStr) || "N/A";
        }

        const fellesutgifterMatch = detailsText.match(/Fellesutgifter:\s*([\d\s]+) kr/);
        if (fellesutgifterMatch) {
          const fellesutgifterStr = fellesutgifterMatch[1].replace(/\s/g, "");
          fellesutgifter_kr = parseInt(fellesutgifterStr) || "N/A";
        }

        const ownershipMatch = detailsText.match(/Eier\s*\(Selveier\)/);
        const ownership_type = ownershipMatch ? "Eier (Selveier)" : "N/A";

        const roomsMatch = detailsText.match(/(\d+)\s+soverom/);
        const rooms = roomsMatch ? roomsMatch[1] : "N/A";

        const viewingDiv = $(element).find("div.mt-8.sm\\:ml-16 span");
        const viewing_info = viewingDiv.text().trim() || "N/A";

        return {
          title,
          listing_url: listingUrl,
          address,
          size_m2: size,
          price_kr: price,
          total_price_kr,
          fellesutgifter_kr,
          ownership_type,
          number_of_rooms: rooms,
          viewing_info,
        };
      } catch (err) {
        console.error(`Error parsing buy listing: ${err}`);
        return null;
      }
    }
  );
};

// Updated getRentalListings function
export const getRentalListings = async (
  params: Record<string, string>,
  maxListings: number = 200
): Promise<RentalListing[]> => {
  return fetchListings<RentalListing>(
    BASE_RENTAL_URL,
    params,
    maxListings,
    (element, $) => {
      try {
        const titleTag = $(element).find("h2.sf-realestate-heading a");
        const title = titleTag.text().trim() || "N/A";

        // Filter out unwanted listings
        if (isUnwanted(title)) return null;

        const listingUrl = titleTag.attr("href")
          ? `https://www.finn.no${titleTag.attr("href")}`
          : "N/A";

        const address = $(element)
          .find("div.sf-realestate-location span.text-s")
          .text()
          .trim() || "N/A";

        const sizePriceDiv = $(element).find("div.flex.justify-between");
        const size = sizePriceDiv
          .find("span")
          .first()
          .text()
          .replace(/\s/g, "")
          .replace("m²", "")
          .trim() || "N/A";
        const rental_price = sizePriceDiv
          .find("span")
          .last()
          .text()
          .replace(/\s/g, "")
          .replace("kr", "")
          .trim() || "N/A";

        const detailsDiv = $(element).find("div.text-xs.s-text-subtle");
        let ownership_type = "N/A";
        let rooms = "N/A";

        const detailsText = detailsDiv.text().replace(/\xa0/g, " ").replace(/\u202f/g, " ");
        if (detailsText.includes("Leilighet")) {
          ownership_type = "Leilighet";
        }

        const roomsMatch = detailsText.match(/(\d+)\s+soverom/);
        rooms = roomsMatch ? roomsMatch[1] : "N/A";

        return {
          title,
          listing_url: listingUrl,
          address,
          size_m2: size,
          rental_price_kr: rental_price,
          ownership_type,
          number_of_rooms: rooms,
        };
      } catch (err) {
        console.error(`Error parsing rental listing: ${err}`);
        return null;
      }
    }
  );
};

export const createRentalParams = (buyParams: Record<string, string>): Record<string, string> => {
  const rentalParams = { ...buyParams };

  // Update the parameters for rental
  rentalParams["radius"] = rentalParams["radius"] || "1000"; // Use provided radius or default
  rentalParams["property_type"] = "3"; // Adjust if needed

  // Remove parameters not relevant to rental
  const keysToRemove = ["ownership_type", "rent_to", "lifecycle", "total_price_kr", "fellesutgifter_kr"];
  keysToRemove.forEach((key) => {
    delete rentalParams[key];
  });

  return rentalParams;
};

export const calculateRentPerSqm = (rentalListings: RentalListing[]): RentalListing[] => {
  return rentalListings.map((listing) => {
    // Extract numeric values
    const rentalPriceStr = listing.rental_price_kr.replace(/\D/g, "");
    const sizeStr = listing.size_m2.replace(/\D/g, "");

    const rentalPrice = parseInt(rentalPriceStr) || 0;
    const size = parseInt(sizeStr) || 0;

    const price_per_sqm = size > 0 ? rentalPrice / size : 0;

    return {
      ...listing,
      rental_price_kr: rentalPrice.toString(),
      size_m2: size.toString(),
      price_per_sqm: price_per_sqm.toFixed(2), // Adding this field
    };
  });
};

export const estimateRentAndYield = (
  buyListings: BuyListing[],
  rentalListings: RentalListing[]
): { buyWithYield: BuyListing[]; bestOption: BuyListing | null } => {
  // Calculate average rent per sqm from rental listings
  const validRentalListings = rentalListings.filter(
    (r) => r.price_per_sqm && parseFloat(r.price_per_sqm) > 0
  );
  const avg_rent_per_sqm =
    validRentalListings.reduce((sum, r) => sum + parseFloat(r.price_per_sqm!), 0) /
      validRentalListings.length || 0;

  console.log(`Average Rent per m² from Rental Listings: ${avg_rent_per_sqm.toFixed(2)} kr/m²`);

  // Estimate rent and calculate yield for buy listings
  const buyWithYield = buyListings.map((buy) => {
    const sizeStr = buy.size_m2.replace(/\D/g, "");
    const size = parseInt(sizeStr) || 0;
    const totalPrice =
      typeof buy.total_price_kr === "number" ? buy.total_price_kr : parseInt(buy.total_price_kr) || 0;

    const estimated_rent_kr = size * avg_rent_per_sqm;
    const annual_rent_kr = estimated_rent_kr * 12;
    const yield_percentage = totalPrice > 0 ? (annual_rent_kr / totalPrice) * 100 : 0;

    return {
      ...buy,
      estimated_rent_kr: estimated_rent_kr.toFixed(2),
      annual_rent_kr: annual_rent_kr.toFixed(2),
      yield_percentage: yield_percentage.toFixed(2),
    };
  });

  // Identify the buy listing with the highest yield
  const bestOption = buyWithYield.reduce<BuyListing | null>((prev, current) => {
    if (!prev) return current;
    return parseFloat(current.yield_percentage!) > parseFloat(prev.yield_percentage!) ? current : prev;
  }, null);

  return { buyWithYield, bestOption };
};
