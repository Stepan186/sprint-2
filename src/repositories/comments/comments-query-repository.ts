import {
  CommentsFromDbInterface,
  CommentsInterface,
  CommentsResponseInterface
} from '../../utilities/interfaces/comments/comments-interface';
import { commentsColletion } from '../../db';
import { ObjectId } from 'mongodb';
import { orderByType, paginationType } from '../blogs/blogs-query-repository';
import { commentsMapping } from '../../mapping/comments-mapping';

export const commentsQueryRepository = {
  findComment: async(commentId: string): Promise<CommentsInterface|null> => {
    const comment = await commentsColletion.findOne({ _id: new ObjectId(commentId) });
    return comment ? {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
      createdAt: comment.createdAt
    } : null;
  },

  findComments: async (postId: string, pagination: paginationType, orderBy: orderByType): Promise<boolean | CommentsResponseInterface> => {
    const comments: CommentsFromDbInterface[] = await commentsColletion.find({postId: postId}).skip(pagination.pageNumber * pagination.pageSize - pagination.pageSize)
      .limit(pagination.pageSize).sort({ [orderBy.sortBy]: orderBy.sortDirection }).toArray()
    const totalCount = await commentsColletion.countDocuments({postId: postId})
    return commentsMapping(comments, pagination, totalCount)
  }
};
