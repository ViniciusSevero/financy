import { Resolver, Query, Arg } from "type-graphql";
import { DashboardStats } from "../models/dashboard.stats.model";
import { CategoryService } from "../services/category.service";
import { TransactionService } from "../services/transaction.service";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { UserModel } from "../models/user.model";

@Resolver()
export class DashboardResolver {
    private categoryService = new CategoryService()
    private transactionService = new TransactionService()

    @Query(() => DashboardStats)
    async getDashboardStats(
        @GqlUser() user: UserModel
    ): Promise<DashboardStats> {

        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));

        const [
            allTransactions,
            monthlyTransactions,
            totalCategories,
            categoryGroups
        ] = await Promise.all([
            this.transactionService.listTransactions(user.id),
            this.transactionService.getMontlyTransactions(startOfMonth, endOfMonth, user.id),
            this.categoryService.countCategories(user.id),
            this.categoryService.getMostUsedCategory(user.id)
        ]);

        let monthlyBalance = 0;
        let monthlyIncome = 0;
        let monthlyOutcome = 0;
        monthlyTransactions.forEach(t => {
            if (t.transactionType === "income") {
                monthlyBalance += t.transactionValue;
                monthlyIncome += t.transactionValue;
            } else if (t.transactionType === "outcome") {
                monthlyOutcome += t.transactionValue;
                monthlyBalance -= t.transactionValue;
            }
        });

        let mostUsedCategory = undefined;
        if (categoryGroups.length > 0) {
            const topCategory = categoryGroups[0];
            const categoryInfo = await this.categoryService.findCategoryById(topCategory.categoryId)

            if (categoryInfo) {
                mostUsedCategory = {
                    title: categoryInfo.title,
                    count: topCategory._count.categoryId,
                    icon: categoryInfo.icon,
                    color: categoryInfo.color
                };
            }
        }

        return {
            monthlyBalance,
            monthlyIncome,
            monthlyOutcome,
            totalCategories,
            totalTransactions: allTransactions.data.length,
            mostUsedCategory
        };
    }
}