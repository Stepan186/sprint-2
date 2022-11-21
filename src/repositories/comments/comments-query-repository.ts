import { CommentsInterface } from '../../utilities/interfaces/comments/comments-interface';
import { commentsColletion } from '../../db';
import { ObjectId } from 'mongodb';

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
  }
};
