
import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'
import { UserService } from '../services/user.service'
import { IsAuth } from '../middlewares/auth.middleware'
import { TransactionService } from '../services/transaction.service'
import { TransactionModel, TransactionResult } from '../models/transaction.model'
import { CreateTransactionInput, TransactionFiltersInput, UpdateTransactionInput } from '../dtos/input/transaction.input'
import { CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private categoryService = new CategoryService()
  private userService = new UserService()

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    await this.transactionService.deleteTransaction(id, user.id)
    return true
  }

  @Query(() => TransactionResult)
  async listTransactions(
    @GqlUser() user: UserModel,
    @Arg("filters", () => TransactionFiltersInput, { nullable: true }) filters?: TransactionFiltersInput,
    @Arg("limit", () => Int, { nullable: true, description: "Quantidade máxima de registros a retornar" }) limit?: number,
    @Arg("page", () => Int, { nullable: true, description: "Pagina solicitada" }) page?: number
  ): Promise<TransactionResult> {
    return await this.transactionService.listTransactions(user.id, filters, limit, page)
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.getTransaction(id, user.id)
  }

  @FieldResolver(() => UserModel)
  async user(@Root() transaction: TransactionModel): Promise<UserModel> {
    return this.userService.findUser(transaction.userId)
  }

  @FieldResolver(() => CategoryModel)
  async category(@Root() transaction: TransactionModel): Promise<CategoryModel> {
    return this.categoryService.findCategoryById(transaction.categoryId)
  }
}