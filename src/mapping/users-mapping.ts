import {
  UsersFromDbInterface,
  UsersResponseInterface
} from '../utilities/interfaces/users/user-interface';
import { paginationType } from '../repositories/blogs/blogs-query-repository';

export function usersMapping (users: UsersFromDbInterface[], pagination: paginationType, totalCount: number): UsersResponseInterface {
  const usersMap = users.map((v) => {
    return {
      id: v._id.toString(),
      login: v.login,
      email: v.email,
      createdAt: v.createdAt
    }
  })

  return {
    pagesCount: Math.ceil(totalCount / pagination.pageSize),
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    totalCount: totalCount,
    items: usersMap
  }
}
