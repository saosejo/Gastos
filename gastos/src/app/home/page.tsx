"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { usePostData, useGetData } from "../../hooks/useApi";
import { List } from "../../models/List";
import { Expense } from '@/models/Expense';
import { User } from '@/models/User';

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
   
    const createdBy = selectedList?.createdBy;
    const sharedUsers = selectedList?.sharedWith?.concat((selectedList?.createdBy ?? []) as User[]);
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

    return (
        <div className="">
            <Button onClick={() => setListModalOpen(true)} className=''>Create a new list +</Button>

            {/* List Creation Dialog */}
            <Dialog open={isListModalOpen} onOpenChange={setListModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New List</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Enter list title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Enter category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <Button onClick={handleAddCategory}>Add Category</Button>
                        </div>

                        <div className="space-y-1">
                            {categories.map((category, index) => (
                                <div key={index} className="p-2 border rounded bg-gray-100">
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setListModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateList} disabled={creatingList}>Create List</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Expense Creation Dialog */}
            <Dialog open={isExpenseModalOpen} onOpenChange={setExpenseModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Expense</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Expense Name"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="Amount"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(Number(e.target.value))}
                        />

                            <select
                            className="w-full border rounded p-2"
                            value={expenseBy?._id ?? ""} 
                            onChange={(e) => setExpenseBy(sharedUsers?.find((user) => user._id === e.target.value) ?? null)}
                            >
                            <option disabled hidden>Select user</option>
                            {sharedUsers?.map((user, index) => (
                                <option key={index} value={user._id ?? ""}>
                                {user.email}
                                </option>
                            ))}
                            </select>
                        
                        {/* Category dropdown populated with the selected list's categories */}
                        <select
                            className="w-full border rounded p-2"
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                        >
                            <option disabled hidden>Select category</option>
                            {selectedList?.categories?.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <Input
                            type="date"
                            value={expenseDate ? expenseDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setExpenseDate(new Date(e.target.value))}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setExpenseModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitExpense}>Submit Expense</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {creatingList ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : error ? (
                <div>
                    <p>Error encountered:</p>
                    <pre>{error}</pre>
                </div>
            ) : data && (
                <div>
                <div>
                    <p>Response from API:</p>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
                 <div>
                 <p>Response from API:</p>
                 <pre>{JSON.stringify(sharedUsers, null, 2)}</pre>
             </div>
                </div>
            )}

            <div className="mt-4">
                <select
                    className="w-full border rounded p-2"
                    value={selectedList?._id}
                    onChange={(e) => setSelectedList(listsData?.find((list) => list._id === e.target.value) ?? null)}
                >
                    {listsData?.length ? (
                        listsData.map((list) => (
                            <option key={list._id} value={list._id}>
                                {list.name}
                            </option>
                        ))
                    ) : (
                        <option disabled hidden>Select a list</option>
                    )}
                </select>
                <Button className="mt-2" onClick={handleOpenExpenseModal}>Create Expense</Button>
            </div>
            <div className="mt-4">
                { (
                    <div className="mt-4">
                        <h2>Expenses for {selectedList?.name}</h2>
                        <div>
                            <pre>{JSON.stringify(expensesData, null, 2)}</pre>
                        </div>
                        
                        <table className="w-full border-collapse border border-gray-200">
            <thead>
                <tr>
                    <th className="border border-gray-200 p-2">Name</th>
                    <th className="border border-gray-200 p-2">Amount</th>
                    <th className="border border-gray-200 p-2">Category</th>
                    <th className="border border-gray-200 p-2">Date</th>
                    <th className="border border-gray-200 p-2">By</th>
                </tr>
            </thead>
            <tbody>
                {expensesData?.map((expense, index) => (
                    <tr key={index}>
                        <td className="border border-gray-200 p-2">{expense.name}</td>
                        <td className="border border-gray-200 p-2">{expense.amount}</td>
                        <td className="border border-gray-200 p-2">{expense.category}</td>
                        <td className="border border-gray-200 p-2">
                            {expense.date ? new Date(expense.date).toLocaleDateString() : ""}
                        </td>
                        <td className="border border-gray-200 p-2">{sharedUsers?.find((user) => user._id === expense.createdBy)?.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
            </div>
        </div>
    );
};

export default HomePage;
