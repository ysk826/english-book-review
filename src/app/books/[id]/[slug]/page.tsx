import { Suspense } from 'react';
import type { Metadata } from 'next';
import BookDetailContent from './book-detail-content';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return {
        title: `${title} | Stride Log`,
        description: `「${title}」のレビュー・感想`,
    };
}

export default function BookDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            }
        >
            <BookDetailContent />
        </Suspense>
    );
}
