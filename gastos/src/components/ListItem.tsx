import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { List } from '@/models/List';
import { useGetData } from "@/hooks/useApi";

interface Expense {
    _id: string;
    listId: string;
    name: string;
    amount: number;
    category: string;
    date: string;
    createdBy: string;
}

const ListItem: React.FC<{ list: List }> = ({list}) => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [percentage, setPercentage] = useState(0);

    const { data: expenses } = useGetData<Expense[]>(`list/expenses/${list._id}`);

    useEffect(() => {
        if (expenses) {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpenses(total);
        
        // This is a placeholder calculation. Adjust as needed.
        const calculatedPercentage = Math.min((total / 2000) * 100, 100);
        setPercentage(calculatedPercentage);
        }
    }, [expenses]);
    
    return (
        <div className="flex items-center justify-between p-4 mb-4 bg-white rounded shadow">
        <div>
            <h3 className="font-bold">{list.name}</h3>
            <p className="text-sm text-gray-500">You spent ${totalExpenses.toFixed(2)} this month</p>
        </div>
        <div className="w-1/2">
            <div className="bg-gray-200 rounded-full h-2">
            <div 
                className="bg-black h-2 rounded-full" 
                style={{width: `${percentage}%`}}
            ></div>
            </div>
        </div>
        <Button className="text-white">Share</Button>
        </div>
    );
};

export default ListItem;