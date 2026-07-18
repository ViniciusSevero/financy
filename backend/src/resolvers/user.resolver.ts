import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { UserModel } from '../models/user.model'
import { UserService } from '../services/user.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { CreateUserInput, UpdateUserInput } from '../dtos/input/user.input'
import { GraphqlContext } from '../graphql/context'

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
    private userService = new UserService()

    @Query(() => UserModel)
    async getUser(@Arg('id', () => String) id: string): Promise<UserModel> {
        return this.userService.findUser(id)
    }

    @Mutation(() => UserModel)
    async updateUser(
        @Arg('id', () => String) id: string,
        @Arg('data', () => UpdateUserInput) data: UpdateUserInput
    ): Promise<UserModel> {
        return this.userService.updateUser(id, data)
    }
}