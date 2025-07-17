import React from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { CartItem } from '../App';

interface ProductGridProps {
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  getItemQuantity: (id: string) => number;
  updateQuantity: (id: string, quantity: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  addToCart, 
  getItemQuantity, 
  updateQuantity 
}) => {
  const products = [
    {
      id: '1',
      name: 'Tata I-Shakti Cooking Soda',
      store: 'amazon',
      rating: 4.2,
      weight: '100 g',
      price: 20,
      originalPrice: null,
      discount: null,
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      name: 'Aashirvaad Iodized Salt',
      store: 'amazon',
      rating: 4.5,
      weight: '1 kg',
      price: 24,
      originalPrice: 28,
      discount: '14% OFF',
      image: 'https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '3',
      name: 'Tata Iodised Crystal Salt',
      store: 'amazon',
      rating: 4.3,
      weight: '1 kg',
      price: 21,
      originalPrice: 22,
      discount: '5% OFF',
      image: 'https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '4',
      name: 'Tata Himalayan Rock Salt',
      store: 'amazon',
      rating: 4.6,
      weight: '1 kg',
      price: 109,
      originalPrice: 120,
      discount: '9% OFF',
      image: 'https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '5',
      name: 'Vedaka Fenugreek (Methi)',
      store: 'amazon',
      rating: 4.1,
      weight: '200 g',
      price: 33,
      originalPrice: 60,
      discount: '45% OFF',
      image: 'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '6',
      name: 'Vedaka Black Pepper Corn',
      store: 'amazon',
      rating: 4.4,
      weight: '100 g',
      price: 114,
      originalPrice: 165,
      discount: '31% OFF',
      image: 'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '7',
      name: 'Fortune Sunlite Sunflower Oil',
      store: 'amazon',
      rating: 4.3,
      weight: '5 L',
      price: 718,
      originalPrice: 930,
      discount: '23% OFF',
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '8',
      name: 'Sunpure Refined Oil',
      store: 'amazon',
      rating: 4.2,
      weight: '5 L',
      price: 745,
      originalPrice: 850,
      discount: '17% OFF',
      image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      store: product.store,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      weight: product.weight
    });
  };

  return (
    <div className="px-4 pb-20">
      <div className="grid grid-cols-3 gap-2">
        {products.map((product) => {
          const quantity = getItemQuantity(product.id);
          return (
            <div key={product.id} className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="relative mb-2">
                {product.discount && (
                  <div className="absolute top-1 left-1 bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-bold z-10">
                    {product.discount}
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-20 object-cover rounded-md"
                />
              </div>
              
              <div className="mb-1">
                <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <p className="text-xs text-gray-600">{product.weight}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                
                {quantity > 0 ? (
                  <div className="flex items-center bg-yellow-400 rounded-full text-xs">
                    <button 
                      className="p-0.5"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3 text-black" />
                    </button>
                    <span className="px-2 py-0.5 text-black font-bold">{quantity}</span>
                    <button 
                      className="p-0.5"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3 text-black" />
                    </button>
                  </div>
                ) : (
                  <button 
                    className="bg-yellow-400 text-black p-1.5 rounded-full hover:bg-yellow-500"
                    onClick={() => handleAddToCart(product)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bestsellers Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Bestsellers | Offers till stocks last</h3>
          <button className="text-blue-600 text-sm font-medium">see all</button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {products.slice(0, 4).map((product) => {
            const quantity = getItemQuantity(`bestseller-${product.id}`);
            const bestsellerProduct = { ...product, id: `bestseller-${product.id}` };
            
            return (
              <div key={bestsellerProduct.id} className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="relative mb-2">
                  <div className="absolute top-1 left-1 bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-bold z-10">
                    {Math.floor(Math.random() * 40) + 10}% OFF
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
                
                <div className="mb-1">
                  <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                  <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">{product.weight}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-xs text-gray-500 line-through">₹{product.price + 10}</span>
                  </div>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center bg-yellow-400 rounded-full text-xs">
                      <button 
                        className="p-0.5"
                        onClick={() => updateQuantity(bestsellerProduct.id, quantity - 1)}
                      >
                        <Minus className="h-3 w-3 text-black" />
                      </button>
                      <span className="px-2 py-0.5 text-black font-bold">{quantity}</span>
                      <button 
                        className="p-0.5"
                        onClick={() => updateQuantity(bestsellerProduct.id, quantity + 1)}
                      >
                        <Plus className="h-3 w-3 text-black" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="bg-yellow-400 text-black p-1.5 rounded-full hover:bg-yellow-500"
                      onClick={() => handleAddToCart(bestsellerProduct)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};