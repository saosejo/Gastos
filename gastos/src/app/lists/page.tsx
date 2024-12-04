"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { usePostData, useGetData } from "../../hooks/useApi";
import { List } from "../../models/List";
import ListItem from '@/components/ListItem';

const Lists = () => {
    const [listsData, setListsData] = useState<List[] | null>(null);

    const { data: listsDataResponse } = useGetData<List[]>('list/getlists');
 
    useEffect(() => {
        if (listsDataResponse) {
            setListsData(listsDataResponse);
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
                        <ListItem list={list} />
                    </div>
                ))}
            </div>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add a new list</button>
        </div>
    );
};

export default Lists;
