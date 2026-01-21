import type { ReactNode } from "react";

import Navbar from "../../../../components/navbar";
import Footer from "../../../../components/footer";
import Background from "../../../../components/background";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <Background />
    </>
  );
}
