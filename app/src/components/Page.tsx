import { Footer } from "./Footer";
import { Header } from "./Header";

export const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-gray-900 h-full">
      <Header />
      <main className="pt-36 lg:pt-32 flex min-h-screen flex-col max-h-screen max-w-7xl mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
};
