import Image from "next/image";
import Link from 'next/link';
import Navbar from "./components/Navbar";
import CategoryGrid from "./components/Categorygrid";
export default function Home() {
  return (
    <div>
      <Navbar />
      <CategoryGrid />
    </div>
  );
}
