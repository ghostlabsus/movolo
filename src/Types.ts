export interface SearchResult {
    title: string;
    year: number;
    slug: string;
    poster?: string;
    provider: string;
    type: "movie" | "tv";
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

export interface Quality {
    quality: string;
    url: string;
}

export interface ScraperResult {
    url: string;
    qualities?: Quality[];
    subtitles?: Subtitle[];
    episodes?: Episode[];
};

export interface VidEmbedResult {
    source:      Source[];
    source_bk:   Source[];
    track:       VidEmbedResultTrack;
    advertising: any[];
    linkiframe:  string;
}

export interface Source {
    file:     string;
    label:    string;
    type:     string;
    default?: string;
}

export interface VidEmbedResultTrack {
    tracks: TrackElement[];
}

export interface TrackElement {
    file: string;
    kind: string;
}
