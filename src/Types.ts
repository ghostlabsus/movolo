export interface SearchResult {
    title: string;
    year: number;
    slug: string;
    poster?: string;
    provider: string;
    type: "movie" | "series";
};

export interface Subtitle {
    label: string;
    url: string;
    type: "subtitles" | "captions";
    default: boolean;
    hearingImpaired?: boolean;
};

export interface Episode {
    title: string;
    season: number;
    episode: number;
    slug: string;
    provider: string;
}

export interface ScraperResult {
    url: string;
    subtitles?: Subtitle[];
    episodes?: Episode[];
};