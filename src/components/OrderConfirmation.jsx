import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const OrderConfirmation = ({id}) => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-6"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                        <Check className="w-12 h-12 text-green-600" />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-sans font-medium mb-4">Order Submitted!</h1>
                <p className="text-xl font-serif mb-6">Thank you for your purchase.</p>

                <div className="bg-gray-100 font-serif rounded p-4 mb-6">
                    <p className="text-lg">Your invoice number is:</p>
                    <p className="text-3xl font-bold text-[#3B5345]">{id}</p>
                </div>

                <Link href="/">
                    <button className="bg-[#3B5345] font-serif text-white py-2 px-6 rounded-lg transition duration-300">
                        Go to home page
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default OrderConfirmation;