export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    readingTime: number;
    thumbnail?: string | null;
    content: string;
}

export interface BlogFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    thumbnail?: string;
}
