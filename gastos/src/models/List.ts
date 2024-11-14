import { Expense } from "./Expense";
import { User } from "./User";

export interface List{
    _id: string;
    name: string | null;
    createdBy: User | null;
    sharedWith: User[] | null;
    categories: string[] | null;
    expenses: Expense[] | null;
}