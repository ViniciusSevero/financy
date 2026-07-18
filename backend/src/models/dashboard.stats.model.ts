import { ObjectType, Field, Float, Int } from "type-graphql";

@ObjectType()
class CategoryUsage {
    @Field(() => String)
    title: string;

    @Field(() => Int)
    count: number;

    @Field(() => String)
    icon: string;

    @Field(() => String)
    color: string;
}

@ObjectType()
export class DashboardStats {
    @Field(() => Float)
    monthlyBalance: number;

    @Field(() => Float)
    monthlyIncome: number;

    @Field(() => Float)
    monthlyOutcome: number;

    @Field(() => Int)
    totalCategories: number;

    @Field(() => Int)
    totalTransactions: number;

    @Field(() => CategoryUsage, { nullable: true })
    mostUsedCategory?: CategoryUsage;
}