"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { usePostData, useGetData } from "../../hooks/useApi";
import { List } from "../../models/List";

const Lists = () => {
    const [listsData, setListsData] = useState<List[] | null>(null);
    const [expenseTotals, setExpenseTotals] = useState<{ [listId: string]: number }>({});

    const { data: listsDataResponse } = useGetData<List[]>('list/getlists');

    // Fetch expenses for each list
    useEffect(() => {
        if (listsDataResponse) {
            setListsData(listsDataResponse);

            // Fetch all expenses in parallel
            const fetchExpensesPromises = listsDataResponse.map(async (list) => {
                const { data: expenses } = await useGetData<{ _id: string, listId: string, name: string, amount: number, category: string, date: string, createdBy: string }[]>(
                    `list/expenses/${list._id}`
                );
                console.log(`Expenses for list ${list._id}:`, expenses);
                const total = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

                return { listId: list._id, total };
            });

            // Wait for all expense data and update totals
            Promise.all(fetchExpensesPromises).then((totals) => {
                const expenseTotalsMap = totals.reduce((acc, { listId, total }) => {
                    acc[listId] = total;
                    return acc;
                }, {} as Record<string, number>);
                setExpenseTotals(expenseTotalsMap);
            });
        }
    }, [listsDataResponse]);

    return (
        <div className="container mx-auto p-4">  
            <h2 className="text-lg font-bold mb-4">Lists</h2>
            {/* Render a div for each list in listsData */}
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">Personal</h3>
                        <p className="text-sm text-gray-500">You spent $1,200 this month</p>
                    </div>
                    <div className="w-1/2">
                        <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{width: "60%"}}></div>
                        </div>
                    </div>
                    <Button className="text-white">Share</Button>
                </div>
                {listsData?.map((list) => (
                    <div key={list._id} className="p-4 mb-4 bg-white rounded shadow">
                        <h3 className="font-bold">{list.name}</h3>
                        <p>Total Expenses: ${expenseTotals[list._id] || 0}</p>
                    </div>
                ))}
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add a new list</button>
        </div>
    );
};

export default Lists;
