import calcPizzaPrice from './calcPizzaPrice';

export default function calcOrderTotal(order, pizzas) {
  // 1. Loop over each item in the order.
  // 2. Calc the total for that pizza.
  // 3. Add total to order total.
  return order.reduce((total, singleOrder) => {
    const pizza = pizzas.find(
      (singlePizza) => singlePizza.id === singleOrder.id
    );
    return total + calcPizzaPrice(pizza.price, singleOrder.size);
  }, 0);
}
