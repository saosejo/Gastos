"use client";

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { usePostData, useGetData } from "../../hooks/useApi";
import { List } from "../../models/List";
import { Expense } from '@/models/Expense';
import { User } from '@/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { ColumnDef } from "@tanstack/react-table"

interface ExpenseTable {
    _id: string;
    name: string;
    amount: number;
    category: string;  // Just a string, not an array
    date: string;
    createdBy: string;
    list: string;
  }

const HomePage: React.FC = () => {
    const router = useRouter();
    const [isListModalOpen, setListModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<List | null>(null);
    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [listsData, setListsData] = useState<List[] | null>(null);
    const [createListData, setCreateListData] = useState<List | null>(null);
    const [createExpenseData, setCreateExpenseData] = useState<Expense | null>(null);
    
    // New state variables for expense input
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState<number>(0);
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    const [expenseDate, setExpenseDate] = useState<Date | null>(null);
    const [expenseBy, setExpenseBy] = useState<User | null>(null);
    const [shareEmails, setShareEmails] = useState<string>("");
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    
    // Custom hooks
    const { data: listsDataResponse } = useGetData<List[]>('list/getlists');
    const { data: createdList, loading: creatingList, error: createListError } = usePostData<List>(
        'list/lists',
        createListData,
        true
    );
    const { data: createdExpense, error: createExpenseError } = usePostData<Expense>(
        'list/expenses',
        createExpenseData,
        true
    );

    // Fetch expenses data
    const { data: expensesData } = useGetData<{ _id: string, listId: string, name: string, amount: number, category: string, date: string, createdBy: string }[]>('list/expenses/' + selectedList?._id);
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const createdBy = selectedList?.createdBy;
    const sharedUsers = selectedList?.sharedWith?.concat((selectedList?.createdBy ?? []) as User[]);

    const columns: ColumnDef<ExpenseTable>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "createdBy",
            header: "By",
        },
    ];

    const mappedExpenses: ExpenseTable[] = expensesData?.map(expense => ({
        _id: expense._id,
        name: expense.name,
        amount: expense.amount,
        category: expense.category,  // Just use the string category
        date: expense.date,
        createdBy: sharedUsers?.find((user) => user._id === expense.createdBy)?.email ?? "",
        list: expense.listId,  // Ensure the 'list' property is passed correctly
    })) ?? [];

    const totalSpending = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
    const totalExpenses = expensesData?.length || 0;
    const averageExpense = totalExpenses ? totalSpending / totalExpenses : 0;

    // Sync lists data when response changes
    useEffect(() => {
        if (listsDataResponse) {
            setListsData(listsDataResponse);
        }
    }, [listsDataResponse]);

    // Set the first list as the default selected list on initial load
    useEffect(() => {
        if (listsData && listsData.length > 0 && !selectedList) {
            setSelectedList(listsData[0]);
        }
    }, [listsData]);

    // Sync created list when createdList changes
    useEffect(() => {
        if (createdList) {
            setData(createdList);
        }
    }, [createdList]);

    // Sync error states for error display
    useEffect(() => {
        setError(createListError || createExpenseError || null);
    }, [createListError, createExpenseError]);

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        }
    };

    const handleOpenExpenseModal = () => {
        if (!selectedList) return;
        // Set the first category as the default selected category if it exists
        if (selectedList.categories && selectedList.categories.length > 0) {
            setExpenseCategory(selectedList.categories[0]);
        }
        setExpenseModalOpen(true);
    };
    

    const handleCreateList = () => {
        const list: List = {
            _id: '',
            name: title,
            sharedWith: [],
            categories,
            expenses: [],
            createdBy: null
        };
        setCreateListData(list); // Setting this will trigger the API call in usePostData
    };


    const handleSubmitExpense = () => {
        if (!selectedList || !expenseName || expenseAmount <= 0 || !expenseDate) return;

        const expense: Expense = {
            name: expenseName,
            amount: expenseAmount,
            date: expenseDate,
            list: selectedList,
            categories: expenseCategory,
            createdBy: expenseBy
        };
        console.log(expense);
        setCreateExpenseData(expense);
        setExpenseModalOpen(false); // Close the expense dialog after submitting
    };

    const handleShareList = () => {
        if (!selectedList || !shareEmails.trim()) return;

        const emails = shareEmails.split(",").map(email => email.trim());

        // Call your API to update the list with shared emails
        // Example API call:
        usePostData<List>(
            `list/share/${selectedList._id}`,
            { sharedWith: emails },
            true
        );

        setShareModalOpen(false);
        setShareEmails("");
    };


    return (

        <div className="space-y-8">
        {/* List Actions */}
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Expense Tracker</h1>
                <Button onClick={() => setListModalOpen(true)}>+ Create New List</Button>
            </div>



            <div className="flex gap-4">
                <select
                    className="w-full border rounded p-2"
                    value={selectedList?._id}
                    onChange={(e) =>
                        setSelectedList(listsData?.find((list) => list._id === e.target.value) ?? null)
                    }
                >
                    <option hidden>Select a list</option>
                    {listsData?.map((list) => (
                        <option key={list._id} value={list._id}>
                            {list.name}
                        </option>
                    ))}
                </select>
                <Button onClick={handleOpenExpenseModal}>+ Add Expense</Button>
                <Button onClick={() => setShareModalOpen(true)}>Share List</Button>
            </div>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Total Spending</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalSpending.toFixed(2)}</div>
                    <p className="text-xs">Total spent on expenses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalExpenses}</div>
                    <p className="text-xs">Number of expenses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex justify-between pb-2">
                    <CardTitle>Average Expense</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${averageExpense.toFixed(2)}</div>
                    <p className="text-xs">Average per expense</p>
                </CardContent>
            </Card>
        </section>

        {/* Calendar */}
        <section>
            <Card>
                <CardContent>
                    <Label htmlFor="date">Pick a Date</Label>
                    <Calendar
                        mode="single"
                        className="rounded-md border"
                    />
                </CardContent>
            </Card>
        </section>

        {/* Expense Table */}
        <section>
            <h2 className="text-xl font-semibold">Expenses for {selectedList?.name || "Selected List"}</h2>
            <DataTable columns={columns} data={mappedExpenses} />
        </section>

        {/* Modals */}
        <Dialog open={isListModalOpen} onOpenChange={setListModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New List</DialogTitle>
                </DialogHeader>
                <Input placeholder="List title" />
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setListModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateList}>Create List</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isShareModalOpen} onOpenChange={setShareModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share List</DialogTitle>
                </DialogHeader>
                <Input placeholder="Enter emails, separated by commas" />
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setShareModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleShareList}>Share</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isExpenseModalOpen} onOpenChange={setExpenseModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Expense</DialogTitle>
                </DialogHeader>
                <Input placeholder="Expense Name" />
                <Input placeholder="Amount" type="number" />
                <Input placeholder="Date" type="date" />
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setExpenseModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button>Submit Expense</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>







        // <div className="">
        //     <Button onClick={() => setListModalOpen(true)} className=''>Create a new list +</Button>

        //     {/* List Creation Dialog */}
        //     <Dialog open={isListModalOpen} onOpenChange={setListModalOpen}>
        //         <DialogContent>
        //             <DialogHeader>
        //                 <DialogTitle>Create a New List</DialogTitle>
        //             </DialogHeader>

        //             <div className="space-y-4">
        //                 <Input
        //                     placeholder="Enter list title"
        //                     value={title}
        //                     onChange={(e) => setTitle(e.target.value)}
        //                 />

        //                 <div className="flex items-center space-x-2">
        //                     <Input
        //                         placeholder="Enter category name"
        //                         value={newCategory}
        //                         onChange={(e) => setNewCategory(e.target.value)}
        //                     />
        //                     <Button onClick={handleAddCategory}>Add Category</Button>
        //                 </div>

        //                 <div className="space-y-1">
        //                     {categories.map((category, index) => (
        //                         <div key={index} className="p-2 border rounded bg-gray-100">
        //                             {category}
        //                         </div>
        //                     ))}
        //                 </div>
        //             </div>

        //             <DialogFooter>
        //                 <Button variant="secondary" onClick={() => setListModalOpen(false)}>
        //                     Cancel
        //                 </Button>
        //                 <Button onClick={handleCreateList} disabled={creatingList}>Create List</Button>
        //             </DialogFooter>
        //         </DialogContent>
        //     </Dialog>

        //     <Dialog open={isShareModalOpen} onOpenChange={setShareModalOpen}>
        //         <DialogContent>
        //             <DialogHeader>
        //                 <DialogTitle>Share List</DialogTitle>
        //             </DialogHeader>

        //             <div className="space-y-4">
        //                 <Input
        //                     placeholder="Enter emails, separated by commas"
        //                     value={shareEmails}
        //                     onChange={(e) => setShareEmails(e.target.value)}
        //                 />
        //             </div>

        //             <DialogFooter>
        //                 <Button variant="secondary" onClick={() => setShareModalOpen(false)}>
        //                     Cancel
        //                 </Button>
        //                 <Button onClick={handleShareList}>Share</Button>
        //             </DialogFooter>
        //         </DialogContent>
        //     </Dialog>
        //     {/* Expense Creation Dialog */}
        //     <Dialog open={isExpenseModalOpen} onOpenChange={setExpenseModalOpen}>
        //         <DialogContent>
        //             <DialogHeader>
        //                 <DialogTitle>Create a New Expense</DialogTitle>
        //             </DialogHeader>

        //             <div className="space-y-4">
        //                 <Input
        //                     placeholder="Expense Name"
        //                     value={expenseName}
        //                     onChange={(e) => setExpenseName(e.target.value)}
        //                 />
        //                 <Input
        //                     type="number"
        //                     placeholder="Amount"
        //                     value={expenseAmount}
        //                     onChange={(e) => setExpenseAmount(Number(e.target.value))}
        //                 />

        //                     <select
        //                     className="w-full border rounded p-2"
        //                     value={expenseBy?._id ?? ""} 
        //                     onChange={(e) => setExpenseBy(sharedUsers?.find((user) => user._id === e.target.value) ?? null)}
        //                     >
        //                     <option disabled hidden>Select user</option>
        //                     {sharedUsers?.map((user, index) => (
        //                         <option key={index} value={user._id ?? ""}>
        //                         {user.email}
        //                         </option>
        //                     ))}
        //                     </select>
                        
        //                 {/* Category dropdown populated with the selected list's categories */}
        //                 <select
        //                     className="w-full border rounded p-2"
        //                     value={expenseCategory}
        //                     onChange={(e) => setExpenseCategory(e.target.value)}
        //                 >
        //                     <option disabled hidden>Select category</option>
        //                     {selectedList?.categories?.map((category, index) => (
        //                         <option key={index} value={category}>
        //                             {category}
        //                         </option>
        //                     ))}
        //                 </select>

        //                 <Input
        //                     type="date"
        //                     value={expenseDate ? expenseDate.toISOString().split("T")[0] : ""}
        //                     onChange={(e) => setExpenseDate(new Date(e.target.value))}
        //                 />
        //             </div>

        //             <DialogFooter>
        //                 <Button variant="secondary" onClick={() => setExpenseModalOpen(false)}>
        //                     Cancel
        //                 </Button>
        //                 <Button onClick={handleSubmitExpense}>Submit Expense</Button>
        //             </DialogFooter>
        //         </DialogContent>
        //     </Dialog>

        //     {creatingList ? (
        //         <div>
        //             <p>Loading...</p>
        //         </div>
        //     ) : error ? (
        //         <div>
        //             <p>Error encountered:</p>
        //             <pre>{error}</pre>
        //         </div>
        //     ) : data && (
        //         <div>
        //         <div>
        //             <p>Response from API:</p>
        //             <pre>{JSON.stringify(data, null, 2)}</pre>
        //         </div>
        //          <div>
        //          <p>Response from API:</p>
        //          <pre>{JSON.stringify(sharedUsers, null, 2)}</pre>
        //      </div>
        //         </div>
        //     )}

        //     <div className="mt-4">
        //         <select
        //             className="w-full border rounded p-2"
        //             value={selectedList?._id}
        //             onChange={(e) => setSelectedList(listsData?.find((list) => list._id === e.target.value) ?? null)}
        //         >
        //             {listsData?.length ? (
        //                 listsData.map((list) => (
        //                     <option key={list._id} value={list._id}>
        //                         {list.name}
        //                     </option>
        //                 ))
        //             ) : (
        //                 <option disabled hidden>Select a list</option>
        //             )}
        //         </select>
        //         <Button className="mt-2" onClick={handleOpenExpenseModal}>Create Expense</Button>
        //         <Button className="mt-2" onClick={() => setShareModalOpen(true)}>Share List</Button>
        //     </div>
        //     <div>
        //         <Card>
        //             <CardContent className="pt-6">
        //                 <div className="space-y-2">
        //                 <Label htmlFor="date" className="shrink-0">
        //                     Pick a date
        //                 </Label>
        //                 <Calendar
        //                     mode="single"
        //                     selected={date}
        //                     onSelect={setDate}
        //                     className="rounded-md border"
        //                 />
        //                 </div>
        //             </CardContent>
        //         </Card>
        //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        //         <Card>
        //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        //                 <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
        //                 <svg
        //                     xmlns="http://www.w3.org/2000/svg"
        //                     viewBox="0 0 24 24"
        //                     fill="none"
        //                     stroke="currentColor"
        //                     strokeLinecap="round"
        //                     strokeLinejoin="round"
        //                     strokeWidth="2"
        //                     className="h-4 w-4 text-muted-foreground"
        //                 >
        //                     <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        //                 </svg>
        //             </CardHeader>
        //             <CardContent>
        //                 <div className="text-2xl font-bold">${totalSpending.toFixed(2)}</div>
        //                 <p className="text-xs text-muted-foreground">Total spent on expenses</p>
        //             </CardContent>
        //         </Card>

        //         <Card>
        //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        //                 <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        //                 <svg
        //                     xmlns="http://www.w3.org/2000/svg"
        //                     viewBox="0 0 24 24"
        //                     fill="none"
        //                     stroke="currentColor"
        //                     strokeLinecap="round"
        //                     strokeLinejoin="round"
        //                     strokeWidth="2"
        //                     className="h-4 w-4 text-muted-foreground"
        //                 >
        //                     <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        //                 </svg>
        //             </CardHeader>
        //             <CardContent>
        //                 <div className="text-2xl font-bold">{totalExpenses}</div>
        //                 <p className="text-xs text-muted-foreground">Number of expenses</p>
        //             </CardContent>
        //         </Card>

        //         <Card>
        //             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        //                 <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
        //                 <svg
        //                     xmlns="http://www.w3.org/2000/svg"
        //                     viewBox="0 0 24 24"
        //                     fill="none"
        //                     stroke="currentColor"
        //                     strokeLinecap="round"
        //                     strokeLinejoin="round"
        //                     strokeWidth="2"
        //                     className="h-4 w-4 text-muted-foreground"
        //                 >
        //                     <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        //                 </svg>
        //             </CardHeader>
        //             <CardContent>
        //                 <div className="text-2xl font-bold">${averageExpense.toFixed(2)}</div>
        //                 <p className="text-xs text-muted-foreground">Average per expense</p>
        //             </CardContent>
        //         </Card>
        //     </div>

        //     </div>
        //     <div className="mt-4">
        //         { (
        //             <div className="mt-4">
        //                 <h2>Expenses for {selectedList?.name}</h2>
        //                 <div>
        //                     <pre>{JSON.stringify(expensesData, null, 2)}</pre>
        //                 </div>
        //                 <DataTable columns={columns} data={mappedExpenses} />
        //             </div>
        //         )}
        //     </div>
        // </div>
    );
};

export default HomePage;
