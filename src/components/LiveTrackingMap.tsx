import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Store } from 'lucide-react';

interface LiveTrackingMapProps {
  sellerCarts: any[];
  ecoFriendlyDelivery: boolean;
  deliveryStatuses: { [key: string]: number };
}

interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'store' | 'delivery' | 'bike';
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  sellerCarts,
  ecoFriendlyDelivery,
  deliveryStatuses
}) => {
  const [bikePositions, setBikePositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  // Fixed store locations on the map
  const storeLocations: { [key: string]: { x: number; y: number } } = {
    'zara': { x: 15, y: 25 },
    'zudio': { x: 35, y: 15 },
    'mayuri-bakery': { x: 25, y: 35 },
    'nandini': { x: 45, y: 25 },
    'medplus': { x: 55, y: 15 },
    'karachi-bakery': { x: 65, y: 35 },
    'amazon': { x: 40, y: 30 },
    'eco': { x: 30, y: 20 } // Eco delivery starting point
  };

  // Delivery destination
  const deliveryLocation = { x: 75, y: 60 };

  useEffect(() => {
    const interval = setInterval(() => {
      setBikePositions(prev => {
        const updated = { ...prev };
        
        if (ecoFriendlyDelivery) {
          // Single bike for eco delivery
          const ecoStatus = deliveryStatuses['eco'] || 0;
          if (ecoStatus >= 2) { // Out for delivery
            const startX = storeLocations['eco'].x;
            const startY = storeLocations['eco'].y;
            const progress = Math.min((ecoStatus - 2) * 0.3 + (Date.now() % 10000) / 10000 * 0.3, 1);
            
            updated['eco'] = {
              x: startX + (deliveryLocation.x - startX) * progress,
              y: startY + (deliveryLocation.y - startY) * progress
            };
          } else {
            updated['eco'] = storeLocations['eco'];
          }
        } else {
          // Multiple bikes for normal delivery
          sellerCarts.forEach(cart => {
            const status = deliveryStatuses[cart.sellerId] || 0;
            const storePos = storeLocations[cart.sellerId] || storeLocations['amazon'];
            
            if (status >= 3) { // Out for delivery
              const progress = Math.min((status - 3) * 0.4 + (Date.now() % 8000) / 8000 * 0.4, 1);
              updated[cart.sellerId] = {
                x: storePos.x + (deliveryLocation.x - storePos.x) * progress,
                y: storePos.y + (deliveryLocation.y - storePos.y) * progress
              };
            } else {
              updated[cart.sellerId] = storePos;
            }
          });
        }
        
        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [sellerCarts, ecoFriendlyDelivery, deliveryStatuses]);

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 overflow-hidden">
      {/* Map Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Roads/Paths */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
        
        {/* Draw paths from stores to delivery location */}
        {ecoFriendlyDelivery ? (
          <path
            d={`M ${storeLocations['eco'].x}% ${storeLocations['eco'].y}% Q 50% 40% ${deliveryLocation.x}% ${deliveryLocation.y}%`}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        ) : (
          sellerCarts.map(cart => {
            const storePos = storeLocations[cart.sellerId] || storeLocations['amazon'];
            return (
              <path
                key={cart.sellerId}
                d={`M ${storePos.x}% ${storePos.y}% Q ${(storePos.x + deliveryLocation.x) / 2}% ${(storePos.y + deliveryLocation.y) / 2 - 10}% ${deliveryLocation.x}% ${deliveryLocation.y}%`}
                stroke="#10b981"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="3,3"
                opacity="0.6"
              />
            );
          })
        )}
      </svg>

      {/* Store Locations */}
      {ecoFriendlyDelivery ? (
        // Show all stores for eco delivery
        sellerCarts.map(cart => {
          const storePos = storeLocations[cart.sellerId] || storeLocations['amazon'];
          return (
            <div
              key={cart.sellerId}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${storePos.x}%`, top: `${storePos.y}%` }}
            >
              <div className="bg-green-500 rounded-full p-2 shadow-lg">
                <Store className="h-4 w-4 text-white" />
              </div>
              <div className="text-xs font-medium text-center mt-1 bg-white px-1 rounded shadow">
                {cart.sellerName}
              </div>
            </div>
          );
        })
      ) : (
        // Show individual stores for normal delivery
        sellerCarts.map(cart => {
          const storePos = storeLocations[cart.sellerId] || storeLocations['amazon'];
          return (
            <div
              key={cart.sellerId}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${storePos.x}%`, top: `${storePos.y}%` }}
            >
              <div className="bg-blue-500 rounded-full p-2 shadow-lg">
                <Store className="h-4 w-4 text-white" />
              </div>
              <div className="text-xs font-medium text-center mt-1 bg-white px-1 rounded shadow">
                {cart.sellerName}
              </div>
            </div>
          );
        })
      )}

      {/* Delivery Bikes */}
      {Object.entries(bikePositions).map(([sellerId, position]) => (
        <div
          key={sellerId}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-linear"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
          <div className={`${ecoFriendlyDelivery ? 'bg-green-600' : 'bg-orange-500'} rounded-full p-2 shadow-lg animate-bounce`}>
            <Truck className="h-4 w-4 text-white" />
          </div>
          <div className="text-xs font-medium text-center mt-1 bg-white px-1 rounded shadow">
            🏍️
          </div>
        </div>
      ))}

      {/* Delivery Destination */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${deliveryLocation.x}%`, top: `${deliveryLocation.y}%` }}
      >
        <div className="bg-red-500 rounded-full p-2 shadow-lg animate-pulse">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <div className="text-xs font-medium text-center mt-1 bg-white px-1 rounded shadow">
          Your Location
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg p-2 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Stores</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Delivery</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>You</span>
          </div>
        </div>
      </div>

      {/* Status Info */}
      <div className="absolute top-2 right-2 bg-white/90 rounded-lg p-2 text-xs">
        <div className="font-medium text-gray-900">
          {ecoFriendlyDelivery ? 'Eco Delivery' : 'Standard Delivery'}
        </div>
        <div className="text-gray-600">
          {ecoFriendlyDelivery ? '1 Partner' : `${sellerCarts.length} Partners`}
        </div>
      </div>
    </div>
  );
};