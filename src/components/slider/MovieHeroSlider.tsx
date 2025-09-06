import React, { memo, Fragment, useState } from "react";

//react-bootstrap
import { Col, Row } from "react-bootstrap";

// Next-Link
import Link from "next/link";

// Next-Image
import Image from 'next/image'

//react fslight-box
import FsLightbox from "fslightbox-react";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

// Redux Selector / Action
import { useSelector } from "react-redux";
import { theme_scheme_direction } from "../../store/setting/selectors";

// Import JSON data
import moviesData from "../../data/movieHeroSlider.json";

const MovieHeroSlider = memo(() => {
  const themeSchemeDirection = useSelector(theme_scheme_direction);
  const [toggler, setToggler] = useState(false);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <li key={i}>
          <i className="fas fa-star" aria-hidden="true"></i>
        </li>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <li key="half">
          <i className="fa fa-star-half" aria-hidden="true"></i>
        </li>
      );
    }

    return stars;
  };

  return (
    <Fragment>
      <section className="banner-container section-padding-bottom">
        <div className="movie-banner">
          <div id="banner-detail-slider" className="banner-container">
            <div className="movie-banner tvshows-slider">
              <Swiper
                key={String(themeSchemeDirection)}
                dir={String(themeSchemeDirection)}
                navigation={{
                  prevEl: ".swiper-banner-button-prev",
                  nextEl: ".swiper-banner-button-next",
                }}
                slidesPerView={1.2}
                modules={[Navigation]}
                loop={true}
                centeredSlides={true}
                className="swiper-banner-container mb-0"
              >
                {moviesData.map((movie, index) => (
                  <SwiperSlide key={index}>
                    <div className="movie-banner-image">
                      <Image 
                        src={movie.image} 
                        alt="movie-banner-image" 
                        width={1920}
                        height={1080}
                        priority
                      />
                    </div>
                    <div className="shows-content h-100">
                      <Row className="align-items-center h-100">
                        <Col lg="7" md="12">
                          <h1
                            className="texture-text big-font letter-spacing-1 line-count-1 text-uppercase RightAnimate-two"
                            data-animation-in="fadeInLeft"
                            data-delay-in="0.6"
                          >
                            {movie.title}
                          </h1>
                          <div
                            className="flex-wrap align-items-center fadeInLeft animated"
                            data-animation-in="fadeInLeft"
                            style={{ opacity: 1 }}
                          >
                            <div className="slider-ratting d-flex align-items-center gap-3">
                              <ul className="ratting-start p-0 m-0 list-inline text-primary d-flex align-items-center justify-content-left">
                                {renderStars(movie.rating)}
                              </ul>
                              <span className="text-white">{movie.ratingText}</span>
                            </div>
                            <div className="d-flex flex-wrap align-items-center gap-3 movie-banner-time">
                              <span className="badge bg-secondary p-2">
                                <i className="fa fa-eye"></i>
                                {movie.badge}
                              </span>
                              <span className="font-size-6">
                                <i className="fa-solid fa-circle"></i>
                              </span>
                              <span className="trending-time font-normal">
                                {movie.time}
                              </span>
                              <span className="font-size-6">
                                <i className="fa-solid fa-circle"></i>
                              </span>
                              <span className="trending-year font-normal">
                                {movie.year}
                              </span>
                            </div>
                            <p
                              className="movie-banner-text line-count-3"
                              data-animation-in="fadeInUp"
                              data-delay-in="1.2"
                            >
                              {movie.description}
                            </p>
                          </div>
                          <div
                            className="iq-button"
                            data-animation-in="fadeInUp"
                            data-delay-in="1.2"
                          >
                            <Link
                              href="/movies/detail"
                              className="btn text-uppercase position-relative"
                            >
                              <span className="button-text">Play Now</span>
                              <i className="fa-solid fa-play"></i>
                            </Link>
                          </div>
                        </Col>
                        <Col
                          lg="5"
                          md="12"
                          className="trailor-video iq-slider d-none d-lg-block"
                        >
                          <Link href="#" className="video-open playbtn" tabIndex={0}>
                            <svg
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="80px"
                              height="80px"
                              viewBox="0 0 213.7 213.7"
                              enableBackground="new 0 0 213.7 213.7"
                              xmlSpace="preserve"
                              onClick={() => setToggler(!toggler)}
                            >
                              <polygon
                                className="triangle"
                                fill="none"
                                strokeWidth="7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                points="73.5,62.5 148.5,105.8 73.5,149.1 "
                              ></polygon>
                              <circle
                                className="circle"
                                fill="none"
                                strokeWidth="7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                cx="106.8"
                                cy="106.8"
                                r="103.3"
                              ></circle>
                            </svg>
                            <span
                              className="w-trailor text-uppercase"
                              onClick={() => setToggler(!toggler)}
                            >
                              Watch Trailer
                            </span>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </SwiperSlide>
                ))}
                <div className="swiper-banner-button-next">
                  <i className="iconly-Arrow-Right-2 icli arrow-icon"></i>
                </div>
                <div className="swiper-banner-button-prev">
                  <i className="iconly-Arrow-Left-2 icli arrow-icon"></i>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
      {/* @ts-ignore */}
      <FsLightbox
        toggler={toggler}
        sources={["/assets/images/video/trailer.mp4"]}
      />
    </Fragment>
  );
});

MovieHeroSlider.displayName = "MovieHeroSlider";
export default MovieHeroSlider;