import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";

const deafultFont = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Com Amor, IF",
  description: "Incentivando a Organização e Cooperação no IFRN - Campus Lajes",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en" className="scroll-smooth">
        <body className={deafultFont.className}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
