import { orderByType, paginationType } from '../blogs/blogs-query-repository';
import { IUserDb, UsersFromDbInterface, UsersResponseInterface } from '../../utilities/interfaces/users/user-interface';
import { userColletion } from '../../db';
import { usersMapping } from '../../mapping/users-mapping';
import { ObjectId } from 'mongodb';
import { finished } from 'stream';

export const usersQueryRepository = {
  findUsers: async (pagination: paginationType, orderBy: orderByType, searchLoginTerm: string | null, searchEmailTerm: string | null): Promise<UsersResponseInterface> => {

    let query = {$or: []}

    if (searchLoginTerm) {
      query.$or.push( { login:  {$regex: searchLoginTerm, $options: 'i'} } as never);
    }

    if (searchEmailTerm) {
      query.$or.push( { email:  {$regex: searchEmailTerm, $options: 'i'} } as never);
    }

    const users = await userColletion.find(query.$or.length? query : {}).skip(pagination.pageNumber * pagination.pageSize - pagination.pageSize)
      .limit(pagination.pageSize).sort({ [orderBy.sortBy]: orderBy.sortDirection }).toArray();
    const totalCount = await userColletion.countDocuments(query.$or.length? query : {});

    return usersMapping(users, pagination, totalCount);

  },

  checkUserByLoginAndPas: async(hashPassword: string, loginOrEmail: string): Promise<UsersFromDbInterface|null> => {
    const user = await userColletion.findOne({
      $or: [{
        password: hashPassword,
        login: loginOrEmail
      }, { password: hashPassword, email: loginOrEmail }]
    });
    return user? user : null;
  },

  findUserById: async (userId: ObjectId): Promise<IUserDb | null> => {
    return await userColletion.findOne({_id: new ObjectId(userId)})
  }
}
