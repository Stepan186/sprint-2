import {
  CommentsFromDbInterface,
  CommentsResponseInterface,
  ICommentDb
} from '../utilities/interfaces/comments/comments-interface';
import { paginationType } from '../repositories/blogs/blogs-query-repository';

export function commentsMapping(comments: CommentsFromDbInterface[], pagination: paginationType, totalCount: number): CommentsResponseInterface {
  const mapComments = comments.map(v => {
    return {
      id: v._id.toString(),
      content: v.content,
      userId: v.userId.toString(),
      userLogin: v.userLogin,
      createdAt: v.createdAt
    };
  });

  return {
    pagesCount: Math.ceil(totalCount / pagination.pageSize),
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    totalCount: totalCount,
    items: mapComments
  }
}
