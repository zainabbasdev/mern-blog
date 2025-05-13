export interface Response<T> {
  Message: string;
  data: T;
}

export interface Author {
  _id: string;
  username: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: Author;
  disabled: boolean;
  averageRating: number;
  keywords: string[];
  categories: string[];
  ratings: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

// export interface Feed {
//   data: Blog[];
// }
