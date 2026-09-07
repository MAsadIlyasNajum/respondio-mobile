export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  category: string;
  createdAt: string;
  clientMessageId?: string;
  _optimistic?: true;
  _failed?: true;
}
