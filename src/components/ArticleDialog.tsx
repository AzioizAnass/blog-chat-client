import React, { useState } from 'react';
import { useArticle } from '../hooks/articles/useGetArticleById.ts';
import { useAddComment } from '../hooks/comments/useComment.ts';   
import type { Article } from '../types/article.d.ts';
import type { CommentRequest } from '../types/comment.d.ts'; 
import {useUserInfo} from '../services/auth/authService.ts';

interface ArticleDialogProps {
    articleId: number;
    onClose: () => void;
    isOpen: boolean;
}

const ArticleDialog: React.FC<ArticleDialogProps> = ({ articleId, onClose, isOpen }) => {
    const { data: article, isLoading, isError } = useArticle(articleId);
    const { mutate: postComment, isPending, error } = useAddComment();
    const [newComment, setNewComment] = useState<string>('');
    const token = localStorage.getItem('token');
    const currentUser = useUserInfo(token);

    if (!isOpen) return null;

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return      
        const commentData: CommentRequest = {
            content: newComment.trim(),
            article: { id: articleId },
            user: { id: parseInt(currentUser.data.id) }
        };

        postComment(commentData);
        article?.comments.push(commentData) ; 
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const commentCount = article?.comments?.length || 0;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                {isLoading ? (
                    <div className="loading">Loading article details...</div>
                ) : error ? (
                    <div className="error-message">Error loading article details</div>
                ) : article ? (
                    <>
                        <div className="dialog-header">
                            <h2>{article.title}</h2>
                            <button className="close-button" onClick={onClose}>&times;</button>
                        </div>
                        <div className="dialog-body">
                            <div className="article-content-section">
                                <div className="article-full-content">
                                    <p>{article.content}</p>
                                    <div className="article-date">
                                        Published on {formatDate(article.creationDate)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="comments-section">
                                <h3>
                                    Comments
                                    <span className="comments-count">{commentCount}</span>
                                </h3>
                                
                                {article.comments && article.comments.length > 0 ? (
                                    <div className="comments-list">
                                        {article.comments.map(comment => (
                                            <div key={comment.id} className="comment">
                                                <p>{comment.content}</p>
                                                <div className="comment-meta">
                                                    <span>{comment.author}</span>
                                                    <span>{formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-comments">No comments yet</p>
                                )}

                                <form onSubmit={handleSubmitComment} className="comment-form">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        rows={3}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isPending || !newComment.trim()}
                                        className="submit-comment"
                                    >
                                        {isPending ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default ArticleDialog;
