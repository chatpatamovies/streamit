import { FC, Fragment, memo, useState } from "react";

// Components
import SectionSlider from "../slider/SectionSlider";
import CardStyle from "../cards/CardStyle";

// Function
import { generateImgPath } from "../../StaticData/data";

// Import JSON directly
import popularMoviesData from "../../data/popularMovies.json";

const PopularMovies: FC = memo(() => {
  const [title] = useState("Popular Movies");

  // Map JSON -> apply image path
  const movies = popularMoviesData.map((item) => ({
    ...item,
    image: generateImgPath(item.image),
  }));

  return (
    <Fragment>
      <SectionSlider
        title={title}
        list={movies}
        className="popular-movies-block streamit-block"
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

PopularMovies.displayName = "PopularMovies";
export default PopularMovies;
