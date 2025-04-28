import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import API from '../../services/api';

const statusColors = {
  'Order Received': 'bg-blue-100 text-blue-800',
  'Preparing': 'bg-yellow-100 text-yellow-800',
  'On the Way': 'bg-purple-100 text-purple-800',
  'Pick-up Ready': 'bg-green-100 text-green-800',
  'Delivered': 'bg-gray-100 text-gray-800',
  'Picked Up': 'bg-gray-100 text-gray-800',
  'Cancelled' : 'bg-red-100 text-white-800'
};

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    let filteredOrders = [];
    //const [filteredOrders, setFilterOrders] = useState([]);
    const [filter, setFilter] = useState('Order Received');
    const [error, setError] = useState('');
    const { restaurantId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get(`/restaurants/${restaurantId}/orders`);
            if(data)
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch orders');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, orderStatus: newStatus } : order
            ));
        } catch (err) {
            setError('Failed to update order status');
            console.error('Error updating order status:', err);
        }
    };

    if(orders.length > 0) {
         filteredOrders = filter === 'All' ? orders : orders.filter(order => order.orderStatus === filter);
        //setFilterOrders(filteredOrders);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(`/restaurant/${restaurantId}/dashboard`)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="ml-1">Back to Dashboard</span>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter Orders by Status
                    </label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="Order Received">Order Received</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On the Way">On the Way</option>
                        <option value="Pick-up Ready">Pick-up Ready</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Update Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.User.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="Order Received">Order Received</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="On the Way">On the Way</option>
                                                <option value="Pick-up Ready">Pick-up Ready</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Picked Up">Picked Up</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantOrders;