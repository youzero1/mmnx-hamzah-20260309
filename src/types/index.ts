export interface CalculationData {
  id: number;
  expression: string;
  result: string;
  username: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export interface CommentData {
  id: number;
  calculationId: number;
  content: string;
  username: string;
  createdAt: string;
}

export interface LikeData {
  id: number;
  calculationId: number;
  username: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
