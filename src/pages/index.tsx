import { memo, useState, useEffect } from "react";

// hero slider
import MovieHeroSlider from "@/components/slider/MovieHeroSlider";

// section
import PopularMovies from "@/components/sections/PopularMovies";
import SpecialsLatestMovies from "@/components/sections/Specials&LatestMovies";
import MoviesRecommendedForYou from "@/components/sections/MoviesRecommendedForYou";

import { useEnterExit } from "@/utilities/usePage";
import Link from "next/link";

// Import the CSS file you will create in the next step

const Movies = memo(() => {
    useEnterExit();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Your existing page content */}
            <div className="main-content">
                <MovieHeroSlider />
                <PopularMovies />
                <SpecialsLatestMovies />
                <MoviesRecommendedForYou />
            </div>

            {/* The new floating buttons container */}
            <div className="floating-buttons-container">
                <Link href={"/extra/pricing-plan"} className={`floating-button subscribe-btn ${isScrolled ? 'scrolled' : ''}`}>
                    <i className="fa-solid fa-crown"></i>
                    {!isScrolled && <span>Subscribe</span>}
                </Link>
                {!isScrolled && (
                    <button className="floating-button support-btn">
                        <i className="fa-solid fa-headset"></i>
                        <span>Support Chat</span>
                    </button>
                )}
            </div>
        </>
    );
});

Movies.displayName = "Movies";
export default Movies;