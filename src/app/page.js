import Image from "next/image";
import {NavBar} from "@/components/NavBar";
import Hero from "@/components/Hero";
import CustomProduct from "@/components/CustomProduct";

export default function Home() {
  return (
    <>
        <NavBar />
        <Hero />
        <CustomProduct
            title="Special Offer"
            subtitle="Don't Miss The Chance!"
            description="Glow Up & Save! 20% off all products"
            bigimg="/face.png"
            flower="/pingwing.png"
            hideFlower={true}
        />
    </>
  );
}
