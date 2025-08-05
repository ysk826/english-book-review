
export interface GoogleBooksItem {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
        };
        industryIdentifiers?: {
            type: string;
            identifier: string;
        }[];
        publishedDate?: string;
        language?: string;
    };
}

export interface GoogleBooksResponse {
    items?: GoogleBooksItem[];
}