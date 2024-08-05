import "./globals.css";
import localFont from "next/font/local";
import {Figtree} from "next/font/google";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
export const figtree = Figtree({subsets: ["latin"], variable: "--fig", display: "auto"})
const nnFont = localFont({
    src: [
        {
            path: "./fonts/nn-regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/nn-medium.woff2",
            weight: "500",
            style: "normal",
        },
    ],
    variable: "--nn-font",
    display: "auto"
});

export const metadata = {
  title: "Nay Store",
  description: "An iraqi store for makeups",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`m-4 ${nnFont.variable} ${figtree.variable}`}>
        {children}
      </body>
    </html>
  );
}
