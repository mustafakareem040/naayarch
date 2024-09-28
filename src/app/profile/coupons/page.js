import MyCoupons from "@/components/Coupon";
import Footer from "@/components/Footer";

// Define a utility function to map coupon types to colors
const getCouponColors = (couponType) => {
    const colorMap = {
        "naayiraq": {
            bgColor: 'bg-[#f6e3dd]/40',
            buttonColor: 'bg-[#f6e3dd]/5 border-[#a98a85]',
        },
        "Free Delivery Coupons": {
            bgColor: 'bg-blue-50',
            buttonColor: 'bg-[#90CAF9]/5 border-[#90CAF9]',
        },
        // Add more mappings as needed
        // Default colors
        default: {
            bgColor: 'bg-gray-50',
            buttonColor: 'bg-gray-200 border-gray-400',
        },
    };

    return colorMap[couponType] || colorMap['default'];
};

export default async function CouponPage() {
    // Fetch data from the API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/coupons`, {
        // Optionally, add headers if needed
        headers: {
            'Content-Type': 'application/json',
        },
        // Revalidate the data every 60 seconds
        next: { revalidate: 60 },
    });

    // Handle errors
    if (!res.ok) {
        // You can handle errors more gracefully here
        throw new Error('Failed to fetch coupons');
    }

    const data = await res.json();

    // Map API data to match the props expected by CouponCard
    const coupons = data.map((coupon) => {
        // Determine the type based on the coupon name or other fields
        const type = coupon.name || "General Coupon";

        // Format the validTill date
        const validTill = new Date(coupon.end_date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        // Construct the image path
        const image = `https://storage.naayiq.com/resources/${coupon.coupon_image}`; // Adjusted the path

        // Get colors based on the type
        const { bgColor, buttonColor } = getCouponColors(type);

        return {
            type: coupon.description,
            code: coupon.code,
            validTill: `Valid Till - ${validTill}`,
            image,
            bgColor,
            buttonColor,
        };
    });

    return (
        <main className="h-screen flex flex-col justify-between">
            <MyCoupons coupons={coupons} />
            <Footer />
        </main>
    );
}