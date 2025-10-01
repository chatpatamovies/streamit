import { Fragment, memo, useEffect, useMemo, useState } from "react";
// Import Alert and Button for better UI
import { Row, Col, Container, Nav, Tab, Spinner, Alert, Button } from "react-bootstrap";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";

// Components
import RatingStar from "@/components/rating-star";
import FsLightBox from "@/components/fslight-box";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

// Redux
import { useSelector } from "react-redux";
import { theme_scheme_direction } from "@/store/setting/selectors";

// Utils & Libs
import pb from "@/lib/pocketbase";
import { useEnterExit } from "@/utilities/usePage";
import { generateImgPath } from "@/StaticData/data";
import { ClientProvider } from "@/providers/client.provider";
import { formatTime } from "@/helper/ms-to-hm";
import { fetchStreamSource } from "@/helper/fetch-stream-details";
import { TVShow, Season, Episode } from "@/types/pb.types"; // Assuming these types are defined

// Helper to get correct PocketBase file URL
const getPbImageUrl = (
    record: { collectionId: string, id: string },
    filename: string
) => {
    if (!record || !filename) return '';
    return `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${filename}`;
};

const EpisodePage = memo(() => {
    useEnterExit();
    const router = useRouter();

    const { slug: seriesSlug, 'season-slug': seasonSlug, 'episode-slug': episodeSlug } = router.query;
    const themeSchemeDirection = useSelector(theme_scheme_direction);

    // State to manage the loading of the iframe content itself
    const [isIframeLoading, setIsIframeLoading] = useState(true);

    const fetchSeriesData = async (slug: string) => {
        if (!slug) return;
        return pb.collection('tv_shows').getFirstListItem<TVShow>(`slug="${slug}"`, {
            expand: "seasons,seasons.episodes"
        });
    };

    const { data: series, isLoading, isError } = useQuery({
        queryKey: ["series", seriesSlug],
        queryFn: () => fetchSeriesData(String(seriesSlug)),
        enabled: !!seriesSlug,
    });

    const { currentSeason, currentEpisode, otherEpisodes, nextEpisode } = useMemo(() => {
        const defaultState = { currentSeason: null, currentEpisode: null, otherEpisodes: [], nextEpisode: null };
        if (!series?.expand?.seasons || !seasonSlug || !episodeSlug) {
            return defaultState;
        }

        const seasonNum = parseInt(String(seasonSlug), 10);
        const episodeNum = parseInt(String(episodeSlug), 10);

        const season = series.expand.seasons.find((s: Season) => s.season_no === seasonNum);
        if (!season || !season.expand?.episodes) return defaultState;

        const sortedEpisodes = [...season.expand.episodes].sort((a: Episode, b: Episode) => a.episode_no - b.episode_no);
        const currentEpisodeIndex = sortedEpisodes.findIndex((e: Episode) => e.episode_no === episodeNum);
        if (currentEpisodeIndex === -1) return defaultState;

        const episode = sortedEpisodes[currentEpisodeIndex];
        const next = sortedEpisodes[currentEpisodeIndex + 1] || null;
        const others = sortedEpisodes.filter((e: Episode) => e.episode_no !== episodeNum);

        return { currentSeason: season, currentEpisode: episode, otherEpisodes: others, nextEpisode: next };
    }, [series, seasonSlug, episodeSlug]);

    const { mutate, data: streamSource, error: streamSourceError, isPending: streamLoading } = useMutation({
        mutationFn: fetchStreamSource,
    });

    useEffect(() => {
        if (currentEpisode && currentEpisode.video_id && currentEpisode.library_id) {
            setIsIframeLoading(true);
            mutate({ video_id: currentEpisode.video_id, library_id: currentEpisode.library_id });
        }
    }, [currentEpisode, mutate]);


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
    
    if (isError) {
         return (
            <Container className="py-5">
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>Failed to Load Series Data</Alert.Heading>
                    <p>We couldn't find the TV series you're looking for. It might be unavailable or the link may be incorrect.</p>
                     <Button variant="primary" onClick={() => router.push("/tv-shows")}>
                        Back to Shows
                    </Button>
                </Alert>
            </Container>
        );
    }

    const renderStreamError = () => {
        if (!streamSourceError) return null;

        // @ts-ignore
        const status = streamSourceError?.status;
        const message = streamSourceError.message || "An unexpected error occurred.";

        if (status === 401) {
            return (
                <Alert variant="danger" className="text-center m-0">
                    <Alert.Heading>Session Expired</Alert.Heading>
                    <p>Your session has expired. Please log in again to continue.</p>
                    <Button variant="primary" onClick={() => router.push("/auth/login")}>
                        Go to Login
                    </Button>
                </Alert>
            );
        } else if (status === 403) {
            return (
                <Alert variant="warning" className="text-center m-0">
                    <Alert.Heading>Access Denied</Alert.Heading>
                    <p>{message}</p>
                    <Button variant="primary" onClick={() => router.push("/extra/pricing-plan")}>
                        View Subscription Plans
                    </Button>
                </Alert>
            );
        } else {
            return (
                <Alert variant="danger" className="text-center m-0">
                    <Alert.Heading>Error Loading Video</Alert.Heading>
                    <p>{message}</p>
                    <Button variant="primary" onClick={() => router.reload()}>
                        Retry Page
                    </Button>
                </Alert>
            );
        }
    };

    return (
        <Fragment>
            <div className="iq-main-slider site-video">
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <div className="video-container" style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>

                                {/* Loader Overlay */}
                                {(streamLoading || (isIframeLoading && !streamSourceError)) && (
                                    <div className="d-flex justify-content-center align-items-center"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            zIndex: 10
                                        }}>
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                )}

                                {/* Iframe */}
                                {streamSource?.source && !streamSourceError && (
                                    <iframe
                                        src={streamSource.source}
                                        onLoad={() => setIsIframeLoading(false)}
                                        loading="lazy"
                                        style={{
                                            border: 0,
                                            position: "absolute",
                                            top: 0,
                                            height: "100%",
                                            width: "100%",
                                            opacity: isIframeLoading ? 0 : 1,
                                            transition: 'opacity 0.3s ease-in-out'
                                        }}
                                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                        allowFullScreen
                                    ></iframe>
                                )}

                                {/* Error Display */}
                                {!streamLoading && streamSourceError && (
                                    <div className="d-flex justify-content-center align-items-center p-md-5 p-3"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%'
                                        }}>
                                        {renderStreamError()}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="details-part">
                <Container fluid>
                    <div className="trending-info mt-4 pt-0 pb-4">
                        <Row>
                            <Col md={9} className="col-12 mb-auto">
                                <div className="d-md-flex">
                                    <h2 className="trending-text fw-bold texture-text text-uppercase mt-0">
                                        {series?.title}
                                    </h2>
                                    <div className="slider-ratting d-flex align-items-center gap-2 ms-md-3 ms-0">
                                        {series?.rating && (
                                            <>
                                                <RatingStar count={Math.floor(series.rating)} count1={series.rating % 1 > 0 ? 1 : 0} starColor="text-primary" />
                                                <span className="text-white">
                                                    {series?.rating.toFixed(1)}
                                                    <img
                                                        src={generateImgPath("/assets/images/movies/imdb-logo.svg")}
                                                        alt="imdb-logo"
                                                        className="img-fluid ms-2"
                                                    />
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <ul className="p-0 mt-2 list-inline d-flex flex-wrap movie-tag">
                                    <li className="font-size-18">S{currentSeason?.season_no} E{currentEpisode?.episode_no}</li>
                                    <li className="font-size-18">{currentEpisode?.title}</li>
                                    <li className="font-size-18">{formatTime(currentEpisode?.duration || 0)}</li>
                                </ul>
                            </Col>
                            {series?.trailer && series.trailer.length > 0 &&
                                <FsLightBox sources={[series.trailer]} image={getPbImageUrl(series, series?.thumbnail)} />
                            }
                        </Row>
                    </div>
                    <div className="content-details trending-info">
                        <Tab.Container defaultActiveKey="first">
                            <Nav className="iq-custom-tab tab-bg-gredient-center d-flex nav nav-pills align-items-center text-center mb-5 justify-content-center list-inline">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Description</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane className=" fade show" eventKey="first">
                                    <p>{currentEpisode?.detail}</p>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </Container>
            </div>

            {nextEpisode && (
                <div className="next-episode-block">
                    <Container fluid>
                        <div className="d-flex align-items-center justify-content-between px-3 pt-2 my-4">
                            <h5 className="main-title text-capitalize mb-0">
                                Next Episode
                            </h5>
                        </div>
                        <div className="episode-block-wrapper" style={{ maxWidth: '400px', padding: '0 15px' }}>
                            <div className="episode-block">
                                <div className="block-image position-relative">
                                    <Link replace href={`/tv-shows/${seriesSlug}/season/${currentSeason?.season_no}/episode/${nextEpisode.episode_no}`}>
                                        <img
                                            src={getPbImageUrl(nextEpisode, nextEpisode.thumbnail)}
                                            alt="showImg"
                                            className="img-fluid img-zoom"
                                            loading="lazy"
                                        />
                                    </Link>
                                    <div className="episode-number">
                                        E{nextEpisode.episode_no}
                                    </div>
                                    <div className="episode-play">
                                        <Link replace href={`/tv-shows/${seriesSlug}/season/${currentSeason?.season_no}/episode/${nextEpisode.episode_no}`}>
                                            <i className="fa-solid fa-play"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="epi-desc p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <span className="border-gredient-left text-white rel-date">
                                            {new Date(nextEpisode.created).toLocaleDateString()}
                                        </span>
                                        <span className="text-primary run-time">
                                            {formatTime(nextEpisode.duration)}
                                        </span>
                                    </div>
                                    <Link replace href={`/tv-shows/${seriesSlug}/season/${currentSeason?.season_no}/episode/${nextEpisode.episode_no}`}>
                                        <h5 className="epi-name text-white mb-0">
                                            {nextEpisode.title}
                                        </h5>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            <div className="recommended-block">
                <Container fluid>
                    <div className="overflow-hidden">
                        <div className="d-flex align-items-center justify-content-between px-3 pt-2 my-4">
                            <h5 className="main-title text-capitalize mb-0">
                                More Episodes
                            </h5>
                        </div>
                        <div className="card-style-slider">
                            <Swiper
                                key={String(themeSchemeDirection)}
                                dir={String(themeSchemeDirection)}
                                className="position-relative swiper-card"
                                modules={[Navigation]}
                                loop={false}
                                spaceBetween={5}
                                navigation={{
                                    prevEl: ".swiper-button-prev",
                                    nextEl: ".swiper-button-next",
                                }}
                                breakpoints={{
                                    0: { slidesPerView: 1, spaceBetween: 10, },
                                    576: { slidesPerView: 2, spaceBetween: 10, },
                                    768: { slidesPerView: 3, spaceBetween: 15, },
                                    1025: { slidesPerView: 4, spaceBetween: 20, },
                                }}
                            >
                                {otherEpisodes.map((item: Episode, index: number) => (
                                    <SwiperSlide key={index}>
                                        <div className="episode-block">
                                            <div className="block-image position-relative">
                                                <Link replace href={`/tv-shows/${seriesSlug}/season/${currentSeason?.season_no}/episode/${item.episode_no}`}>
                                                    <img
                                                        src={getPbImageUrl(item, item.thumbnail)}
                                                        alt="showImg"
                                                        className="img-fluid img-zoom"
                                                        loading="lazy"
                                                    />
                                                </Link>
                                                <div className="episode-number">
                                                    E{item.episode_no}
                                                </div>
                                                <div className="episode-play">
                                                    <Link replace href={`/tv-shows/${seriesSlug}/season/${currentSeason?.season_no}/episode/${item.episode_no}`}>
                                                        <i className="fa-solid fa-play"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="epi-desc p-3">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <span className="border-gredient-left text-white rel-date">
                                                        {new Date(item.created).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-primary run-time">
                                                        {formatTime(item.duration)}
                                                    </span>
                                                </div>
                                                <Link replace href={`/tv-shows/${seriesSlug}/season/${currentSeason?.season_no}/episode/${item.episode_no}`}>
                                                    <h5 className="epi-name text-white mb-0">
                                                        {item.title}
                                                    </h5>
                                                </Link>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                                <div className="swiper-button swiper-button-next"></div>
                                <div className="swiper-button swiper-button-prev"></div>
                            </Swiper>
                        </div>
                    </div>
                </Container>
            </div>
        </Fragment>
    );
});

EpisodePage.displayName = "EpisodePage";

const RQEpisodePage = () => (
    <ClientProvider>
        <EpisodePage />
    </ClientProvider>
);

RQEpisodePage.displayName = "RQEpisodePage";
export default RQEpisodePage;