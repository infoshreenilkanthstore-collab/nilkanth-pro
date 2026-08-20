import LinkPage from "../../components/LinkPage";
import BestSeller from "../../components/BestSeller";

export const metadata = {
    title: "Links | Nilkanth Store",
    description: "Explore our social media, brochures, about us, contact details and location map.",
};

export default function Page() {
    return (
        <div className="bg-white">
            <LinkPage />
            <BestSeller />
        </div>
    );
}
