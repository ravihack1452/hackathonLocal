import React from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { SellerCart } from '../App';

interface CartProps {
  sellerCarts: SellerCart[];
  onUpdateQuantity: (sellerId: string, itemId: string, quantity: number) => void;
  onBack: () => void;
  onCheckout: () => void;
  getTotalAmount: (sellerId?: string) => number;
}

export const Cart: React.FC<CartProps> = ({ 
  sellerCarts, 
  onUpdateQuantity, 
  onBack, 
  onCheckout, 
  getTotalAmount 
}) => {
  if (sellerCarts.length === 0) {
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
              <p className="text-sm text-gray-600">Your Cart</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="h-20 w-20 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to get started</p>
          <button
            onClick={onBack}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

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
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {sellerCarts.map((sellerCart) => {
          const deliveryFee = getTotalAmount(sellerCart.sellerId) > 99 ? 0 : 30;
          const finalAmount = getTotalAmount(sellerCart.sellerId) + deliveryFee;

          return (
            <div key={sellerCart.sellerId} className="bg-white rounded-lg border border-gray-200">
              {/* Seller Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="font-bold text-gray-900">{sellerCart.sellerName}</h3>
                <p className="text-sm text-gray-600">
                  {sellerCart.items.length} item{sellerCart.items.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Items */}
              <div className="p-4 space-y-4">
                {sellerCart.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.weight}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center bg-yellow-400 rounded-full">
                            <button 
                              className="p-1"
                              onClick={() => onUpdateQuantity(sellerCart.sellerId, item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4 text-black" />
                            </button>
                            <span className="px-3 py-1 text-black font-bold">{item.quantity}</span>
                            <button 
                              className="p-1"
                              onClick={() => onUpdateQuantity(sellerCart.sellerId, item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4 text-black" />
                            </button>
                          </div>
                          <button
                            onClick={() => onUpdateQuantity(sellerCart.sellerId, item.id, 0)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Summary */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{getTotalAmount(sellerCart.sellerId)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">₹{finalAmount}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        
        {/* Single Checkout Button */}
        <div className="mt-6">
          <button
            onClick={onCheckout}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700"
          >
            Checkout All Items (₹{sellerCarts.reduce((total, cart) => total + getTotalAmount(cart.sellerId), 0)})
          </button>
        </div>
      </div>
    </div>
  );
};