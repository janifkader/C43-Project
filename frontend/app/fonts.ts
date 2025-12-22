import { Krona_One, Tomorrow } from "next/font/google";

export const krona = Krona_One({
  subsets: ["latin"],
  weight: "400",
});

export const tomorrow = Tomorrow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});