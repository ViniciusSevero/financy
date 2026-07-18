import { Field, Float, GraphQLISODateTime, InputType } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model'
import { GraphQLLocalDate } from 'graphql-scalars'
import { LocalDateScalar } from '../../graphql/decorators/LocalDateScalar'

@InputType()
export class CreateTransactionInput {
    @Field(() => TransactionType)
    transactionType!: TransactionType

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => LocalDateScalar)
    transactionDate!: Date

    @Field(() => Float)
    transactionValue!: number

    @Field(() => String)
    categoryId!: string
}

@InputType()
export class UpdateTransactionInput {
    @Field(() => TransactionType)
    transactionType!: TransactionType

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => LocalDateScalar)
    transactionDate!: Date

    @Field(() => Float)
    transactionValue!: number

    @Field(() => String)
    categoryId!: string
}

@InputType()
export class TransactionFiltersInput {
    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => TransactionType, { nullable: true })
    transactionType?: TransactionType;

    @Field(() => String, { nullable: true })
    categoryId?: string;

    @Field(() => String, { nullable: true, description: "Formato esperado: MM-YYYY (ex: 07-2026)" })
    period?: string;
}