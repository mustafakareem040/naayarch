'use client'
import Image from "next/image";
import React from "react";
import {useRouter} from "next/navigation";

export default function OrderDetails({orderID}) {
    const orderSteps = [
        { label: 'Order Confirm', date: '6/6/23, 8:44PM', isCompleted: true },
        { label: 'Shipped', date: '6/6/23, 10:54PM', isCompleted: true },
        { label: 'Delivered', date: '7/6/23, 11:33AM', isCompleted: true },
    ];
    const orderDetails = {
        id: '#1000000',
        total: '125,000 IQD',
        date: '6/6/23, 8:44PM',
        status: 'Order Confirm',
        products: [
            {
                image: '/water.png',
                title: 'Rare Beauty Blush Liquid',
                color: 'Happy',
                size: '25 ml',
                qty: 1,
                price: '50,000 IQD'
            },
            {
                image: '/cream.png',
                title: 'GISOU - Mini Honey Infused Hair Oil',
                size: '25 ml',
                qty: 1,
                price: '43,000 IQD'
            },
            {
                image: '/korean.png',
                title: 'Hairburst Shampoo & conditioner',
                color: 'Happy',
                qty: 1,
                price: '50,000 IQD'
            }
        ],
        shippingAddress: {
            city: 'Baghdad',
            area: 'Arassat',
            details: 'Near the International Bank',
            phone: '077000000'
        },
        priceDetails: {
            price: '143,000 IQD',
            deliveryCost: '5,000 IQD',
            discount: '8,000 IQD',
            totalPrice: '140,000 IQD'
        }
    }
    const router = useRouter()
    return (
        <>
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1
                    className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Order Details
                </h1>
            </header>
            <div className="border-t border-[#695C5C]/30 border-solid w-full absolute left-0 right-0"></div>
            <div className="grid mt-12 mx-4 grid-cols-2">
                <div className="mb-6">
                    <p className="font-sans font-medium text-base">Order ID</p>
                    <p className="font-serif text-[0.775rem]">{orderDetails.id}</p>
                </div>
                <div className="justify-self-end">
                    <p className="font-sans font-medium text-base">Total</p>
                    <p className="font-serif text-[0.775rem]">{orderDetails.total}</p>
                </div>
                <div>
                    <p className="font-sans font-medium text-base">Date</p>
                    <p className="font-serif text-[0.775rem]">{orderDetails.date}</p>
                </div>
            </div>
            <div className="border-t border-[#695C5C]/30 border-solid w-full absolute mt-4 left-0 right-0"></div>
            <div className="mt-7 mb-6">
                <p className="font-sans font-medium text-xl">Track Orders</p>
                <OrderTracking steps={orderSteps}/>
            </div>
            <div className="border-t border-[#695C5C]/30 border-solid w-full absolute left-0 right-0"></div>
            <OrderedProducts products={[{
                image: '/water.png',
                name: 'Rare Beauty Blush Liquid',
                details: ['Color: Happy', 'Size: 25 ml'],
                price: '50,000',
            }, {
                image: '/cream.png',
                name: 'Cream',
                details: ['Color: Happy', 'Size: 25 ml'],
                price: '50,000'
            }]}/>

            <div>
                <p className="font-sans font-medium mb-6 text-xl">Shipping Address</p>
                <div
                    className="bg-skintone font-medium border border-[#695C5C]/30 space-y-5 border-solid font-serif p-4">
                    <p>{orderDetails.shippingAddress.city}</p>
                    <p>{orderDetails.shippingAddress.area}</p>
                    <p>{orderDetails.shippingAddress.details}</p>
                    <p>{orderDetails.shippingAddress.phone}</p>
                </div>
                <p className="font-sans font-medium text-xl">Price Details</p>
                <div
                    className="bg-skintone font-medium border border-[#695C5C]/30 space-y-5 border-solid font-serif p-4">
                    <p>{orderDetails.priceDetails.price}</p>
                    <p>{orderDetails.priceDetails.deliveryCost}</p>
                    <p>{orderDetails.priceDetails.discount}</p>
                    <p className="font-semibold text-xl">{orderDetails.priceDetails.totalPrice}</p>
                </div>
                <button className="bg-[#C91C1C] py-3 text-white font-sans text-xl font-bold w-full rounded-xl">Cancel
                    Order
                </button>
            </div>
        </>
    )
}

const OrderTrackingStep = ({label, date, isCompleted, isLast}) => (
    <div className="flex font-serif items-center">
        <div className="relative">
            <div
                className={`w-8 h-8 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                {isCompleted && (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
            </div>
            {!isLast && <div className={`absolute top-8 left-1/2 w-0.5 h-full -translate-x-1/2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
        </div>
        <div className="ml-4">
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-gray-500">{date || 'Not Yet'}</p>
        </div>
    </div>
);

const OrderTracking = ({ steps }) => (
    <div className="space-y-6">
        {steps.map((step, index) => (
            <OrderTrackingStep
                key={step.label}
                label={step.label}
                date={step.date}
                isCompleted={step.isCompleted}
                isLast={index === steps.length - 1}
            />
        ))}
    </div>
);


const ProductItem = ({ image, name, details, price }) => (
    <div className="flex font-sans w-full items-start space-x-4 bg-white rounded-lg mb-4">
        <Image width={154} height={169} src={image} alt={name} className="object-cover rounded-lg" />
        <div className="flex-grow font-serif space-y-2">
            <h3 className="font-sans text-base">{name}</h3>
            {details.map((detail, index) => (
                <p key={index} className="text-sm text-[#695C5C]">{detail}</p>
            ))}
                <div className="bg-gray-100 w-fit px-5 py-0.5 rounded-md">
                    <span className="text-sm">Qty:1</span>
                    <span className="ml-1">▼</span>
                </div>
                <p className="font-serif font-semibold">{price} IQD</p>
        </div>
    </div>
);

const OrderedProducts = ({products}) => (
    <>
        <h2 className="text-2xl mt-12 font-sans font-bold mb-8">Ordered Product</h2>
        {products.map((product, index) => (
            <ProductItem key={index} {...product} />
        ))}
    </>
);

