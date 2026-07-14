export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  createdAt: string;
}
export interface Tag {
  _id: string;
  name: string;
}
export interface Comment {
  _id: string;
  postId: { _id: string; title: string; slug: string } | string;
  nickname: string;
  content: string;
  visible: boolean;
  createdAt: string;
}
