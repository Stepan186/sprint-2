import { CommentsInterface, CreateCommentInterface } from '../utilities/interfaces/comments/comments-interface';
import { jwtService } from '../application/jwt-service';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
import { postsQueryRepository } from '../repositories/posts/posts-query-repository';
import { PostsInterface } from '../utilities/interfaces/posts/posts-interface';
import { commentsDbRepository } from '../repositories/comments/comments-db-repository';

export const postsServices = {
  createCommentForPost: async (token: string | undefined, data: CreateCommentInterface, postId: string): Promise<CommentsInterface | null> => {
    if (token) {
      const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
      const post: PostsInterface | null = await postsQueryRepository.findPostById(postId)
      if (post) {
        return commentsDbRepository.createComment(data, payload)
      }
    }
    return null
  }
}
