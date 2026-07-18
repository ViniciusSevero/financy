import { Field, Float, GraphQLISODateTime, ID, ObjectType, registerEnumType } from 'type-graphql'
import { UserModel } from './user.model'
import { CategoryModel } from './category.model'
import { LocalDateScalar } from '../graphql/decorators/LocalDateScalar'

export enum TransactionType {
    income = 'income',
    outcome = 'outcome',
}

registerEnumType(TransactionType, {
    name: 'TransactionType',
    description: 'Transaction Type',
})


@ObjectType()
export class TransactionModel {
    @Field(() => ID)
    id!: string

    @Field(() => TransactionType)
    transactionType!: string

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => LocalDateScalar)
    transactionDate!: Date

    @Field(() => Float)
    transactionValue!: number

    @Field(() => String)
    userId!: string

    @Field(() => String)
    categoryId!: string

    @Field(() => UserModel, { nullable: true })
    user?: UserModel

    @Field(() => CategoryModel, { nullable: true })
    category?: CategoryModel

    @Field(() => GraphQLISODateTime)
    createdAt!: Date

    @Field(() => GraphQLISODateTime)
    updatedAt!: Date
}