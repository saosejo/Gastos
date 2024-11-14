import { List } from "./List";
import { User } from "./User";

export interface Expense{
    list: List | null;
    name: string | null;
    amount: number;
    categories: string | null;
    date: Date | null;
    createdBy: User | null;
}