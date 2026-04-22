/**
 * Placeholder client wordmarks for the featured-clients marquee.
 *
 * Every name here is invented — Nordic-flavoured but fictional — so no
 * trademark claims exist. Swap to Sanity-managed `client` documents
 * (with logos + permission flag) once real clients are cleared.
 */

export interface ClientMock {
  name: string;
  /** Short tagline shown underneath on larger displays */
  category: string;
}

export const featuredClients: ClientMock[] = [
  { name: "Meridian Spirits", category: "Premium spirits" },
  { name: "Atelier Veka", category: "Fashion" },
  { name: "Lund & Berg", category: "Hospitality" },
  { name: "Studio Nordisk", category: "Beauty" },
  { name: "Hamnens", category: "Food" },
  { name: "Ostkust", category: "Wine" },
  { name: "Fjordhus", category: "Home" },
  { name: "Kvalitet Foods", category: "Grocery" },
  { name: "Vinkällaren", category: "Wine" },
  { name: "Norrlands", category: "Beverage" },
];
