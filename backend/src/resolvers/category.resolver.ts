
import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'
import { UserService } from '../services/user.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { CategoryService } from '../services/category.service'
import { CategoryModel } from '../models/category.model'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { TransactionService } from '../services/transaction.service'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()
  private userService = new UserService()
  private transactionService = new TransactionService()

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    await this.categoryService.deleteCategory(id, user.id)
    return true
  }

  @Query(() => [CategoryModel])
  async listCategories(
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id)
  }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.getCategory(id, user.id)
  }

  @FieldResolver(() => UserModel)
  async user(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.findUser(category.userId)
  }

  @FieldResolver(() => Number)
  async transactionsCount(@Root() category: CategoryModel): Promise<Number> {
    return this.transactionService.countByCategory(category.id, category.userId)
  }

  @FieldResolver(() => Number)
  async transactionsTotal(@Root() category: CategoryModel): Promise<Number> {
    return this.transactionService.sumValueByCategory(category.id, category.userId)
  }
  
}