import {
  CommentsInterface,
  CommentsResponseInterface,
  CreateCommentInterface
} from '../utilities/interfaces/comments/comments-interface';
import { jwtService } from '../application/jwt-service';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
import { postsQueryRepository } from '../repositories/posts/posts-query-repository';
import { PostsInterface } from '../utilities/interfaces/posts/posts-interface';
import { commentsDbRepository } from '../repositories/comments/comments-db-repository';
import { orderByType, paginationType } from '../repositories/blogs/blogs-query-repository';
import { commentsQueryRepository } from '../repositories/comments/comments-query-repository';

export const postsServices = {
  createCommentForPost: async (token: string | undefined, data: CreateCommentInterface, postId: string): Promise<CommentsInterface | null> => {
    if (token) {
      const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
      const post: PostsInterface | null = await postsQueryRepository.findPostById(postId)
      if (post) {
        return commentsDbRepository.createComment(data, payload, postId)
      }
    }
    return null
  },

  findCommentsFromPost: async (postId: string, pagination: paginationType, orderBy: orderByType): Promise<boolean | CommentsResponseInterface > => {
    const post = await postsQueryRepository.findPostById(postId)
    return post ? await commentsQueryRepository.findComments(postId, pagination, orderBy) : false
  }
}

