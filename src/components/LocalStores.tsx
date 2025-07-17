import React from 'react';
import { Clock, Star } from 'lucide-react';

interface LocalStoresProps {
  onStoreSelect: (storeId: string) => void;
  currentLocation: string;
}

export const LocalStores: React.FC<LocalStoresProps> = ({ onStoreSelect, currentLocation }) => {
  
  const getStoresForLocation = (location: string) => {
    const allStores = [
      // MG Road stores
      {
        id: 'zara',
        name: 'Zara',
        rating: 4.3,
        logo: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Jewellery & Accessories',
        deliveryTime: '15 mins',
        locations: ['560001', '560025']
      },
      {
        id: 'zudio',
        name: 'Zudio',
        rating: 4.5,
        logo: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Fashion & Clothing',
        deliveryTime: '18 mins',
        locations: ['560001', '560067', '560100']
      },
      {
        id: 'mayuri-bakery',
        name: 'Mayuri Bakery',
        rating: 4.7,
        logo: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Bakery & Sweets',
        deliveryTime: '12 mins',
        locations: ['560001', '560025', '560067']
      },
      {
        id: 'nandini',
        name: 'Nandini Milk Parlour',
        rating: 4.6,
        logo: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Dairy Products',
        deliveryTime: '10 mins',
        locations: ['560001', '560025', '560067', '560078', '560100']
      },
      {
        id: 'medplus',
        name: 'MedPlus',
        rating: 4.2,
        logo: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Pharmacy & Health',
        deliveryTime: '20 mins',
        locations: ['560001', '560067', '560078']
      },
      {
        id: 'karachi-bakery',
        name: 'Karachi Bakery',
        rating: 4.4,
        logo: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Bakery & Biscuits',
        deliveryTime: '16 mins',
        locations: ['560025', '560067', '560100']
      },
      {
        id: 'cera',
        name: 'Cera Sanitaryware',
        rating: 4.1,
        logo: 'https://images.pexels.com/photos/1358912/pexels-photo-1358912.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Home & Hardware',
        deliveryTime: '25 mins',
        locations: ['560067', '560078', '560100']
      },
      {
        id: 'patanjali',
        name: 'Patanjali Store',
        rating: 4.3,
        logo: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Ayurvedic & Natural',
        deliveryTime: '18 mins',
        locations: ['560001', '560025', '560067']
      },
      {
        id: 'ice-cream-parlour',
        name: 'Baskin Robbins',
        rating: 4.5,
        logo: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'Ice Cream & Desserts',
        deliveryTime: '14 mins',
        locations: ['560001', '560025', '560100']
      }
    ];

    // Extract pincode from current location
    const currentPincode = location.match(/\d{6}/)?.[0] || '560001';
    
    // Filter stores based on current location
    return allStores.filter(store => store.locations.includes(currentPincode));
  };

  const localStores = getStoresForLocation(currentLocation);

  return (
    <div className="px-4 py-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 whitespace-nowrap">🏪 Discover Local Stores Near You</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {localStores.map((store) => (
          <button
            key={store.id}
            onClick={() => onStoreSelect(store.id)}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-16 rounded-lg overflow-hidden mb-3 border border-gray-100 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 text-center mb-1 group-hover:text-blue-600">
                {store.name}
              </h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{store.rating}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-2 text-center">{store.category}</p>
              <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">in {store.deliveryTime}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};