'use client'
import React from 'react';
import Image from "next/image";
import {useRouter} from "next/navigation";

const OrderItem = ({ order }) => (
    <div className="bg-[#F6F3F1]/50 font-serif rounded-lg p-4 mb-4">
        <div className="text-center  text-sm text-[#3B5345] font-bold mb-4">{order.date}</div>
        <div className="space-y-2 font-medium">
            <div className="flex justify-between items-center">
                <span className="font-semibold">Order ID</span>
                <span className="text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold">Status</span>
                <span className={`text-sm ${
                    order.status === 'On the way' ? 'text-[#E56F00]' :
                        order.status === 'Delivered' ? 'text-[#0EAC50]' :
                            'text-[#C91C1C]'
                }`}>{order.status}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold">Address</span>
                <span className="text-sm">{order.address}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold">Payment Status</span>
                <span className={`text-sm ${
                    order.paymentStatus === 'Pending' ? 'text-[#E56F00]' :
                        order.paymentStatus === 'Paid' ? 'text-[#0EAC50]' :
                            'text-[#C91C1C]'
                }`}>{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold">Cost</span>
                <span className="text-sm">{order.cost} IQD</span>
            </div>
        </div>
    </div>
);

const MyOrders = () => {
    const orders = [
        {
            id: '#1000000',
            date: '6/6/23 , 8:44PM',
            status: 'On the way',
            address: 'Baghdad,Arassat',
            paymentStatus: 'Pending',
            cost: '150,000',
        },
    ];
    const router = useRouter();
    return (
        <div className="mt-2">
            <div className="flex items-center mb-6">
                <button onClick={router.back}>
                    <Image src={"/arrow-left.svg"} width={40} height={40} alt={"left"}/>
                </button>
                <h1 className="text-3xl -z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-bold">My Orders</h1>
            </div>
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
};

export default MyOrders;