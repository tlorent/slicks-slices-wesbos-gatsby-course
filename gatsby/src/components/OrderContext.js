import React, { useState, createContext } from 'react';

// Create a order context
const OrderContext = createContext();

// Create a provider
export function OrderProvider({ children }) {
  // we need to stick state in here
  const [order, setOrder] = useState([]);

  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
