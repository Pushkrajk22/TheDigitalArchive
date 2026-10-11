import "./globals.css";
import Footer from "./components/Footer";

export const metadata = {
  title: "Upasana",
  description: "Generated to maintain the repository",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <div className="flex-1">{children}</div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
