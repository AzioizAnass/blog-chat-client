export interface Article {
    id: number;
    content: string;
    creationDate: string;
    title: string;
    comments: any[];
  }
  
  export interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  }
  
  export interface ArticlesResponse {
    content: Article[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }
  