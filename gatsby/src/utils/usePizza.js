import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from './attachNamesAndPrices';
import calcOrderTotal from './calcOrderTotal';
import formatMoney from './formatMoney';

export default function usePizza({ pizzas, values }) {
  // Create some state to hold our order
  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Make a function to add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  // Make a function to remove things from order
  function removeFromOrder(index) {
    setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
  }

  // function to run when form is submitted.
  async function submitOrder(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    // gather all data.
    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calcOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
      stroop: values.stroop,
    };

    // Send this data to serverless function when they check out
    // GATSBY_SERVERLESS_BASE
    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const text = await JSON.parse(await res.text());

    // check if everything worked
    if (res.status >= 400 && res.status < 600) {
      setLoading(false);
      setError(text.message);
    } else {
      // it worked!
      setLoading(false);
      setMessage('Success! Get your pizza');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}
