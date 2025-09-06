import { FC, Fragment, memo, useState } from "react";

// Components
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../cards/CardStyle";

// Function
import { generateImgPath } from "../../StaticData/data";

// Import JSON directly
import specialsLatestMoviesData from "../../data/specialsLatestMovies.json";

// Define type for movies (optional, keeps things clean)
type Movie = {
  image: string;
  title: string;
  movieTime: string;
};

const SpecialsLatestMovies: FC = memo(() => {
  const [title] = useState("Specials & Latest Movies");

  // Map JSON -> resolve image paths
  const movies: Movie[] = (specialsLatestMoviesData as Movie[]).map((item) => ({
    ...item,
    image: generateImgPath(item.image), // apply path utility
  }));

  return (
    <Fragment>
      <SectionSlider
        title={title}
        list={movies}
        className="recommended-block streamit-block"
        slidesPerView={5}
      >
        {(data) => (
          <CardStyle
            image={data.image}
            title={data.title}
            movieTime={data.movieTime}
            watchlistLink="/play-list"
            link="/movies/detail"
          />
        )}
      </SectionSlider>
    </Fragment>
  );
});

SpecialsLatestMovies.displayName = "SpecialsLatestMovies";
export default SpecialsLatestMovies;
