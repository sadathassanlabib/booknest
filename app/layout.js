import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "BookNest",
  description: "A community-powered book sharing platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}