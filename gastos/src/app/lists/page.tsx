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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { ColumnDef } from "@tanstack/react-table"
  


const Lists = () => {
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
        <div className="container mx-auto p-4">
  
            <div className="grid grid-cols-1 gap-4">
                
                <div className="col-span-1 bg-white p-4 shadow rounded">
                <h2 className="text-lg font-bold">Lists</h2>
                <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
                    <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">Personal</h3>
                        <p className="text-sm text-gray-500">You spent $1,200 this month</p>
                    </div>
                    <div className="w-1/2">
                        <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: "60%"}}></div>
                        </div>
                    </div>
                    <button className="text-blue-500">Share</button>
                    </div>
                    
                </div>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add a new list</button>
                </div>

            </div>
        </div>
    );
};

export default Lists;
