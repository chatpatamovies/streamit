export interface MovieType {
    id: string;
    title: string;
    detail: string;
    rating: number;
    duration: number;
    quality: string;
    tags: string;
    genres: string;
    thumbnail: string;
    collectionId: string;
    trailer: string;
    video_id: string;
    library_id: string;
    created: string;
    updated: string;
}

// series

export type Episode = {
    collectionId: string;
    collectionName: string;
    created: string;
    detail: string;
    duration: number;
    episode_no: number;
    id: string;
    library_id: string;
    season_no: number;
    slug: string;
    thumbnail: string;
    title: string;
    updated: string;
    video_id: string;
};

export type Season = {
    collectionId: string;
    collectionName: string;
    created: string;
    detail: string;
    episodes: string[];
    expand: {
        episodes: Episode[];
    };
    hide: boolean;
    id: string;
    season_no: number;
    slug: string;
    thumbnail: string;
    title: string;
    trailer: string;
    updated: string;
};

export type TVShow = {
    collectionId: string;
    collectionName: string;
    created: string;
    detail: string;
    duration: number;
    expand: {
        seasons: Season[];
    };
    genres: string;
    id: string;
    quality: string;
    rating: number;
    seasons: string[];
    slug: string;
    tags: string;
    thumbnail: string;
    title: string;
    trailer: string;
    updated: string;
};

// export type TVShowResponse = {
//     items: TVShow[];
//     page: number;
//     perPage: number;
//     totalItems: number;
//     totalPages: number;
// };