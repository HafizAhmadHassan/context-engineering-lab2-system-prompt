import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MotionWrapper from "./MotionWrapper";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MotionWrapper>
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
      </MotionWrapper>
      <Footer />
    </div>
  );
}
