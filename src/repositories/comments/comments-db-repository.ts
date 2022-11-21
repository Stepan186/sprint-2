import { commentsColletion } from '../../db';
import { ObjectId } from 'mongodb';
import {
  CommentsFromDbInterface, CommentsInterface,
  CreateCommentInterface, ICommentDb,
  UpdateCommentInterface
} from '../../utilities/interfaces/comments/comments-interface';
import { commentsQueryRepository } from './comments-query-repository';
import { PostsInterface } from '../../utilities/interfaces/posts/posts-interface';
import { JwtPayloadInterface } from '../../utilities/interfaces/auth/jwt-payload-interface';

export const commentsDbRepository = {

  deleteComment: async (commentId: string): Promise<boolean> => {
    const result = await commentsColletion.deleteOne({_id: new ObjectId(commentId)})
    return result.deletedCount === 1
  },

  updateComment: async (commentId: string, data: UpdateCommentInterface) => {
    const result = await commentsColletion.updateOne({_id: new ObjectId(commentId)}, {$set: data})
    return result.matchedCount === 1
  },

  createComment: async (data: CreateCommentInterface, payload: JwtPayloadInterface) : Promise<CommentsInterface> => {
    const newComment: ICommentDb = {
      content: data.content,
      userId: payload._id,
      userLogin: payload.login,
      createdAt: new Date().toISOString()
    }
    const result = await commentsColletion.insertOne(newComment);
    return {
      id: result.insertedId.toString(),
      content: newComment.content,
      createdAt: newComment.createdAt,
      userLogin: newComment.userLogin,
      userId: newComment.userId.toString()
    };
  },
}
