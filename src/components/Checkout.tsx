import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, CreditCard, Leaf, Package, ChevronRight } from 'lucide-react';
import { SellerCart } from '../App';

interface CheckoutProps {
  sellerCarts: SellerCart[];
  waitlistedCarts: SellerCart[];
  totalAmount: number;
  onBack: () => void;
  onProceedToPayment: (checkoutData: any) => void;
  onToggleWaitlist: (sellerId: string) => void;
  ecoFriendlyDelivery: boolean;
  onToggleEcoDelivery: (enabled: boolean) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ 
  sellerCarts,
  waitlistedCarts,
  totalAmount, 
  onBack, 
  onProceedToPayment,
  onToggleWaitlist,
  ecoFriendlyDelivery,
  onToggleEcoDelivery
}) => {
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [paymentMethod, setPaymentMethod] = useState('online');

  const addresses = [
    {
      id: 'home',
      type: 'Home',
      address: '123, MG Road, Bengaluru 560001',
      landmark: 'Near Metro Station'
    },
    {
      id: 'office',
      type: 'Office',
      address: '456, Brigade Road, Bengaluru 560025',
      landmark: 'Opposite Coffee Shop'
    }
  ];

  const getDeliveryFee = (cart: SellerCart) => {
    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return cartTotal > 99 ? 0 : 30;
  };

  const getTotalDeliveryFee = () => {
    if (ecoFriendlyDelivery) return 25; // Single delivery fee for eco-friendly
    return sellerCarts.reduce((total, cart) => total + getDeliveryFee(cart), 0);
  };

  const getEcoDeliveryTime = () => {
    if (!ecoFriendlyDelivery) return '';
    // Calculate eco delivery time as max individual time + 15 minutes
    const maxTime = Math.max(...sellerCarts.map(cart => {
      const timeStr = cart.deliveryTime;
      const timeNum = parseInt(timeStr.split('-')[1] || timeStr.split(' ')[0]);
      return timeNum;
    }));
    return `${maxTime + 10}-${maxTime + 20} mins`;
  };

  const finalAmount = totalAmount + getTotalDeliveryFee();

  const handleProceedToPayment = () => {
    const checkoutData = {
      sellerCarts,
      address: addresses.find(addr => addr.id === selectedAddress),
      paymentMethod,
      totalAmount: finalAmount,
      ecoFriendlyDelivery,
      orderId: `ORD${Date.now()}`
    };
    onProceedToPayment(checkoutData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              amazon <span className="text-blue-600 font-normal italic">now</span>
            </h1>
            <p className="text-sm text-gray-600">Checkout ({sellerCarts.length} sellers)</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Eco-Friendly Delivery Option */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-800">Eco-Friendly Delivery</h3>
                <p className="text-sm text-green-600">
                  Single delivery partner picks up from all stores {getEcoDeliveryTime() && `(${getEcoDeliveryTime()})`}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ecoFriendlyDelivery}
                onChange={(e) => onToggleEcoDelivery(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Your Orders</h3>
          <div className="space-y-4">
            {sellerCarts.map((cart) => (
              <div key={cart.sellerId} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">{cart.sellerName}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      {ecoFriendlyDelivery ? getEcoDeliveryTime() : cart.deliveryTime}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {cart.items.length} items • ₹{cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)}
                </div>
                <button
                  onClick={() => onToggleWaitlist(cart.sellerId)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Move to Waitlist
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlisted Items */}
        {waitlistedCarts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-4">Waitlisted Orders</h3>
            <div className="space-y-3">
              {waitlistedCarts.map((cart) => (
                <div key={cart.sellerId} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-yellow-800">{cart.sellerName}</h4>
                    <p className="text-sm text-yellow-600">{cart.items.length} items</p>
                  </div>
                  <button
                    onClick={() => onToggleWaitlist(cart.sellerId)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Add Back
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Delivery Address</h3>
          </div>
          <div className="space-y-3">
            {addresses.map((address) => (
              <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddress === address.id}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">{address.type}</div>
                  <div className="text-sm text-gray-600">{address.address}</div>
                  <div className="text-xs text-gray-500">{address.landmark}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Payment Method</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-gray-900">Pay Online (UPI/Card/Wallet)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-gray-900">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({sellerCarts.reduce((total, cart) => total + cart.items.length, 0)})</span>
              <span className="font-medium">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Delivery Fee {ecoFriendlyDelivery && <span className="text-green-600">(Eco-friendly)</span>}
              </span>
              <span className={`font-medium ${getTotalDeliveryFee() === 0 ? 'text-green-600' : ''}`}>
                {getTotalDeliveryFee() === 0 ? 'FREE' : `₹${getTotalDeliveryFee()}`}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₹{finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handleProceedToPayment}
          disabled={sellerCarts.length === 0}
          className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Proceed to Payment (₹{finalAmount})
        </button>
      </div>
    </div>
  );
};