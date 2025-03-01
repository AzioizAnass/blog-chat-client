import { Article } from './article'; 
import { User } from './auth';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: string;
}

export interface CommentRequest {
  content: string;
  article: { id: number };
  user: { id: number };
}

export interface CommentResponse {
  id: number;
  content: string;
  date: string;
  article: Article | null;
  user: User;
}