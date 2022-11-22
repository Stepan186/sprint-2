import { commentsDbRepository } from '../repositories/comments/comments-db-repository';
import { commentsQueryRepository } from '../repositories/comments/comments-query-repository';
import { jwtService } from '../application/jwt-service';
import { UpdateCommentInterface } from '../utilities/interfaces/comments/comments-interface';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';

export const commentsServices = {

  deleteComment: async(commentId: string, token: string): Promise<boolean | number> => {
    const comment = await commentsQueryRepository.findComment(commentId);
    const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface;
    if (!comment) {
      return 404
    }
    if (!(payload._id.toString() === comment.userId)) {
      return 403
    }
    return await commentsDbRepository.deleteComment(commentId);

  },

  updateComment: async(commentId: string, data: UpdateCommentInterface, token: string): Promise<boolean | number> => {
    const comment = await commentsQueryRepository.findComment(commentId);
    const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface;
    if (!comment) {
      return 404
    }
    if (!(payload._id.toString() === comment.userId)) {
      return 403
    }
    return await commentsDbRepository.updateComment(commentId, data);
  },
};
