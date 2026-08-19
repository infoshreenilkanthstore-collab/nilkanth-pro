import FAQSection from "@/components/FAQSection";
import BestSeller from "@/components/BestSeller";

export const metadata = {
    title: "FAQ – Nilkanth Store",
    description: "Frequently asked questions about Nilkanth Store – purity, products, delivery and more.",
};

export default function FAQPage() {
    return (
        <>
            <FAQSection />
            <BestSeller />
        </>
    );
}
