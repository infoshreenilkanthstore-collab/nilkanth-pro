import React from "react";
import { Star, StarHalf } from "lucide-react";

export default function ProductRating({ averageRating = 0, totalReviews = 0, sizeClass = "w-3 h-3 md:w-4 md:h-4", hideCount = false }) {
    const numericRating = Number(averageRating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.1;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                    // Full Star
                    if (star <= fullStars) {
                        return (
                            <Star
                                key={star}
                                className={`${sizeClass} fill-[#700b10] text-[#700b10]`}
                            />
                        );
                    }

                    // Half Star
                    if (star === fullStars + 1 && hasHalfStar) {
                        return (
                            <div key={star} className={`relative ${sizeClass}`}>
                                {/* Gray Empty Star (Background) */}
                                <Star className={`absolute inset-0 w-full h-full fill-[#d1d5db] text-[#d1d5db]`} />
                                {/* Red Half Star (Foreground) */}
                                <StarHalf className={`absolute inset-0 w-full h-full fill-[#700b10] text-[#700b10]`} />
                            </div>
                        );
                    }

                    // Empty Star
                    return (
                        <Star
                            key={star}
                            className={`${sizeClass} fill-[#d1d5db] text-[#d1d5db]`}
                        />
                    );
                })}
            </div>

            {!hideCount && totalReviews > 0 && (
                <span className="text-[10px] md:text-sm font-bold text-gray-500 font-nunito">
                    ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
            )}
        </div>
    );
}
