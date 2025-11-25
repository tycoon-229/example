import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";
import { ModalProvider } from "@/context/ModalContext";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Music App",
  description: "Nghe nhạc trực tuyến",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ModalProvider>
          <Sidebar>
            {children}
          </Sidebar>
          <AuthModal />
        </ModalProvider>
      </body>
    </html>
  );
}