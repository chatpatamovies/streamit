import React, { memo, Fragment, useEffect, useState } from "react";

// react-bootstrap
import { Row, Col, Container, Nav, Tab } from "react-bootstrap";

// next/link
import Link from "next/link";

// components
import MoviesRecommendedForYou from "@/components/sections/MoviesRecommendedForYou";
import RelatedVideos from "@/components/sections/RelatedVideos";
import UpcomingMovies from "@/components/sections/UpcomingMovies";
import RelatedMovies from "@/components/sections/RelatedMovies";
import FsLightBox from "@/components/fslight-box";
import RatingStar from "@/components/rating-star";

// utilities
import { useEnterExit } from "@/utilities/usePage";

// providers
import { ClientProvider } from "@/providers/client.provider";
import { useRouter } from "next/router";
import pb from "@/lib/pocketbase";
import { useMutation, useQuery } from "@tanstack/react-query";

import { formatTime } from "@/helper/ms-to-hs";

// ---- TYPES ----
export interface SeriesType {
  id: string;
  collectionId: string;
  title?: string;
  detail?: string;
  genres?: string;
  tags?: string;
  rating?: number;
  quality?: string;
  duration?: number;
  video_id?: string;
  library_id?: string;
  thumbnail?: string;
  trailer?: string;
  created?: string;
  [key: string]: any;
}

export interface SeasonType {
  id: string;
  collectionId: string;
  title?: string;
  season_no?: number;
  series_id: string;
  expand?: {
    episodes?: EpisodeType[];
  };
}

export interface EpisodeType {
  id: string;
  collectionId: string;
  title?: string;
  episode_number?: number;
  duration?: number;
  thumbnail?: string;
  video_id?: string;
  library_id?: string;
}

type StreamSource = {
  source: string;
  token: string;
  expires: string | number;
};

// helper to safely split comma string into array
const splitStringToArray = (value?: string): string[] =>
  value ? value.replaceAll(" ", "").split(",") : [];

const SeriesDetail: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  // ---- STATE ----
  const [selectedSeason, setSelectedSeason] = useState<SeasonType | null>(null);
  const [showEpisodesSlider, setShowEpisodesSlider] = useState(false);

  // ---- FETCH SERIES ----
  const fetchSeriesBySlug = async (slugParam: string | null): Promise<SeriesType | null> => {
    if (!slugParam) return null;
    try {
      const record = await pb.collection("series").getFirstListItem<SeriesType>(`slug="${slugParam}"`);
      return record;
    } catch (err) {
      console.error("Error fetching series:", err);
      throw new Error("Failed to fetch series");
    }
  };

  const {
    data: series,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<SeriesType | null, Error>({
    queryKey: ["series", slug],
    queryFn: () => fetchSeriesBySlug(String(slug)),
    enabled: !!slug,
  });

  useEnterExit();

  // ---- FETCH STREAM SOURCE ----
  const fetchStreamSource = async ({
    video_id,
    library_id,
  }: {
    video_id: string;
    library_id: string;
  }): Promise<StreamSource> => {
    const response = (await pb.send("/api/iframe-stream-source", {
      method: "POST",
      body: JSON.stringify({ video_id, library_id }),
      headers: {
        "Content-Type": "application/json",
      },
    })) as StreamSource;

    return {
      source: response.source,
      token: response.token,
      expires: response.expires,
    };
  };

  const useStreamSourceMutation = () =>
    useMutation<StreamSource, Error, { video_id: string; library_id: string }>({
      mutationFn: fetchStreamSource,
    });

  const {
    mutate,
    data: streamSource,
    isPending: isStreamLoading,
  } = useStreamSourceMutation();

  const [streamToken, setStreamToken] = useState<string>("");

  useEffect(() => {
    if (series && series.video_id && series.library_id) {
      mutate(
        { video_id: series.video_id, library_id: series.library_id },
        {
          onSuccess: (data) => {
            setStreamToken(data.token ?? "");
            console.log("Stream source fetched successfully:", data);
          },
          onError: (err) => {
            console.error("Error fetching stream source:", err);
          },
        }
      );
    }
  }, [series, mutate]);

  // ---- FETCH SEASONS ----
  const fetchSeasonsBySeries = async (): Promise<SeasonType[]> => {
    try {
      const result = await pb.collection("seasons").getFullList<SeasonType>({
        expand: "episodes",
        sort: "season_no",
      });
      return result;
    } catch (err) {
      console.error("Error fetching seasons:", err);
      throw new Error("Failed to fetch seasons");
    }
  };

  const {
    data: seasons,
    isLoading: isSeasonsLoading,
    isError: isSeasonsError,
  } = useQuery<SeasonType[], Error>({
    queryKey: ["seasons"],
    queryFn: fetchSeasonsBySeries,
  });

  return (
    <Fragment>
      <div className="iq-main-slider site-video">
        <Container fluid>
          <Row>
            <Col lg="12">
              <div className="pt-0">
                {(isLoading || isRefetching || isStreamLoading) && (
                  <div style={{ paddingTop: "20.25%" }}>
                    <div className="d-flex justify-content-center text-primary">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ paddingTop: "56.25%", position: "relative" }}>
                  {series?.video_id && streamSource?.source && streamSource?.token ? (
                    <iframe
                      src={streamSource.source}
                      loading="lazy"
                      style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
                      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                      allowFullScreen
                    ></iframe>
                  ) : null}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="details-part">
        <Container fluid>
          <Row>
            <Col lg="12">
              <div className="trending-info mt-4 pt-0 pb-4">
                <Row>
                  <Col md="9" className="mb-auto">
                    <div className="d-block d-lg-flex align-items-center">
                      <h2 className="trending-text fw-bold texture-text text-uppercase my-0">
                        {series?.title}
                      </h2>
                      <div className="slider-ratting d-flex align-items-center ms-lg-3 ms-0">
                        <RatingStar
                          count={series ? Math.floor(series.rating ?? 0) : 0}
                          count1={series ? 5 - Math.floor(series.rating ?? 0) : 0}
                          starColor="text-warning"
                        />
                        <span className="text-white ms-2">{series?.rating} (IMDB)</span>
                      </div>
                    </div>

                    <ul className="p-0 mt-2 list-inline d-flex flex-wrap movie-tag">
                      {splitStringToArray(series?.genres).map((item, index) => (
                        <li key={index} className="trending-list">
                          <div className="text-primary text-capitalize">{item}</div>
                        </li>
                      ))}
                    </ul>

                    <div className="d-flex flex-wrap align-items-center text-white text-detail flex-wrap mb-4">
                      <span className="badge bg-secondary">{series?.quality?.toUpperCase()}</span>
                      <span className="ms-3 font-Weight-500 genres-info me-2">
                        {formatTime(series?.duration ?? 0)}
                      </span>
                      <span className="trending-year trending-year-list font-Weight-500 genres-info">
                        {new Date(series?.created || "").toLocaleDateString()}
                      </span>
                    </div>
                  </Col>

                  {series?.thumbnail && (
                    <FsLightBox
                      sources={[series.trailer ?? ""]}
                      image={`${pb.baseURL}/api/files/${series.collectionId}/${series.id}/${series.thumbnail}`}
                    />
                  )}
                </Row>
              </div>

              <div className="content-details trending-info">
                <Tab.Container defaultActiveKey="description">
                  <Nav className="iq-custom-tab tab-bg-grdient-center d-flex nav nav-pills align-items-center text-center mb-5 justify-content-center list-inline">
                    <Nav.Item>
                      <Nav.Link eventKey="description">Description</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="seasons">Seasons</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="description">
                      <p>{series?.detail}</p>
                    </Tab.Pane>

                    <Tab.Pane eventKey="seasons">
                      {isSeasonsLoading && <p>Loading seasons...</p>}
                      {isSeasonsError && <p>Failed to load seasons</p>}
                      <Row>
                        {seasons?.map((season) => (
                          <Col md="3" key={season.id} className="mb-4">
                            <div className="card bg-dark text-white h-100">
                              {season.expand?.episodes?.[0]?.thumbnail ? (
                                <img
                                  src={`${pb.baseURL}/api/files/${season.expand.episodes[0].collectionId}/${season.expand.episodes[0].id}/${season.expand.episodes[0].thumbnail}`}
                                  className="card-img-top"
                                  alt={season.title}
                                />
                              ) : (
                                <img
                                  src="/placeholder.png"
                                  className="card-img-top"
                                  alt="Placeholder"
                                />
                              )}
                              <div className="card-body text-center">
                                <h5 className="card-title">
                                  Season {season.season_no}
                                </h5>
                                <p className="card-text">{season.title}</p>
                                <Link 
                                  href="#" 
                                  className="btn btn-primary btn-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedSeason(season);
                                    setShowEpisodesSlider(true);
                                  }}
                                >
                                  View Episodes
                                </Link>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>

                      {/* Episode Slider */}
                      {showEpisodesSlider && selectedSeason && (
                        <div className="episodes-slider mt-4 p-4 bg-dark rounded">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-white">
                              {selectedSeason.title} - Episodes
                            </h4>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => setShowEpisodesSlider(false)}
                            >
                              Close
                            </button>
                          </div>
                          
                          {selectedSeason.expand?.episodes && selectedSeason.expand.episodes.length > 0 ? (
                            <Row>
                              {selectedSeason.expand.episodes.map((episode) => (
                                <Col md="3" key={episode.id} className="mb-3">
                                  <div className="card bg-secondary text-white h-100">
                                    {episode.thumbnail ? (
                                      <img
                                        src={`${pb.baseURL}/api/files/${episode.collectionId}/${episode.id}/${episode.thumbnail}`}
                                        className="card-img-top"
                                        alt={episode.title}
                                        style={{ height: '150px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div className="bg-dark" style={{ height: '150px' }}></div>
                                    )}
                                    <div className="card-body">
                                      <h6 className="card-title">Episode {episode.episode_number}</h6>
                                      <p className="card-text small">{episode.title}</p>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <small>{formatTime(episode.duration ?? 0)}</small>
                                        <button className="btn btn-sm btn-outline-light">
                                          Play
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <p className="text-white">No episodes available for this season</p>
                          )}
                        </div>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <MoviesRecommendedForYou />
      <RelatedMovies />
      <RelatedVideos />
      <UpcomingMovies />
    </Fragment>
  );
};

SeriesDetail.displayName = "SeriesDetail";

const RQSeriesDetail: React.FC = () => {
  return (
    <ClientProvider>
      <SeriesDetail />
    </ClientProvider>
  );
};

RQSeriesDetail.displayName = "RQSeriesDetail";

export default RQSeriesDetail;