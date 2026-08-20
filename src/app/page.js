"use client"

import { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import ProductMarquee from "@/components/ProductMarquee";
import DoubleImageBanner from "@/components/DoubleImageBanner";
import HomeProductList from "@/components/HomeProductList";
import ShopByCategories from "@/components/ShopByCategories";
import CollectionTabsSlider from "@/components/CollectionTabsSlider";
import BestSeller from "@/components/BestSeller";
import FAQSection from "@/components/FAQSection";
import ImageGallery from "@/components/ImageGallery";
import TrustAndStorySection from "../components/TrustAndStorySection";

export default function Home() {
  useEffect(() => {
    console.log("Home page rendered", process.env.NEXT_PUBLIC_CHECKOUT_STORE_ID);
  }, []);
  return (
    <>
      <HeroSlider />
      <ProductMarquee />
      <ShopByCategories />
      <CollectionTabsSlider sectionName="Collections" />
      <DoubleImageBanner />
      <BestSeller />
      <HomeProductList />
      <FAQSection />
      <ImageGallery />
      <TrustAndStorySection />
    </>
  );
}
