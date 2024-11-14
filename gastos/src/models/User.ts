import { List } from "./List";

export interface User{
    _id: string | null;
    email: string | null;
    password: string | null;
    sharedLists: List | null;
}