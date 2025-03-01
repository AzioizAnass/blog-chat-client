import { React, useEffect, useState, useRef } from 'react';
import NavBar from '../components/NavBar.tsx';
import { useArticles } from '../hooks/articles/useGetArticlesByPage.ts';
import type { Article } from '../types/article.d.ts';
import ArticleDialog from '../components/ArticleDialog.tsx';

const Blog = () => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useArticles();
    const observerTarget = useRef<HTMLDivElement>(null);
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    
    const allArticles = data?.pages.flatMap(page => page.content) || [];

    return (
        <div>
            <NavBar />
            <div className="blog-container">
                <div className="articles-grid">
                    {status === 'pending' ? (
                        <div className="loading">Loading articles...</div>
                    ) : status === 'error' ? (
                        <div className="error-message">Error loading articles</div>
                    ) : (
                        <>
                            {allArticles.map((article: Article) => (
                                <article key={article.id} className="article-card">
                                    <div className="article-content">
                                        <h2>{article.title}</h2>
                                        <p className="article-excerpt">
                                            {article.content.substring(0, 150)}...
                                        </p>
                                        <button
                                            className="read-more"
                                            onClick={() => setSelectedArticleId(article.id)}
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </article>
                            ))}
                            <div ref={observerTarget} className="load-more">
                                {isFetchingNextPage && <div className="loading">Loading more articles...</div>}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ArticleDialog
                articleId={selectedArticleId!}
                isOpen={selectedArticleId !== null}
                onClose={() => setSelectedArticleId(null)}
            />
        </div>);
}

export default Blog;
