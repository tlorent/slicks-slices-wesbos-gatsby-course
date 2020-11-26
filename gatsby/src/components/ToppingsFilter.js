import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;

  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;

    .count {
      background: #fff;
      padding: 2px 5px;
    }

    &[aria-current='page'] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  // Return the pizzas with counts
  const counts = pizzas
    // collect all toppings of the pizza
    .map((pizza) => pizza.toppings)
    // flatten the data structure that map returns, otherwise you get arrays within arrays (nested)
    .flat()
    // reduce the flattened toppings array to a new object
    .reduce((acc, topping) => {
      // check if this is an existing topping
      // if it's not, new entry in acc and set it to 1
      // otherwise, increment by 1

      // if the accumulator does not have the current topping (the one you loop over, current item in the reducer)
      // already in it, add it to the accumulator.

      // note: you have to check on a specific property, in this case the id, you can't check on the whole topping object.
      // each topping is an object with many properties, it's not a string so you can't just say if (!acc[topping]).
      // if you only check on the topping and not one of its properties, it will add the first one it finds and then it will just
      // start incrementing it everytime it comes in the else clause of the if-statement.
      if (!acc[topping.id]) {
        acc[topping.id] = {
          ...topping,
          count: 1,
        };
      } else {
        acc[topping.id].count += 1;
      }
      return acc;
    }, {});

  const sortedToppings = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );
  return sortedToppings;
}

export default function ToppingsFilter() {
  // Get a list of all the toppings
  // Get a list of all the pizzas with their toppings
  const { pizzas } = useStaticQuery(graphql`
    query {
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);

  // Count how many pizzas are in each topping (i.e, how many pizza's have x topping on them?)
  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);
  // Loop over the list of toppings and display the topping and the count of pizzas in that topping
  // Link it up
  return (
    <ToppingsStyles>
      <Link to="/pizzas">
        <span className="name">All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {toppingsWithCounts.map((topping) => (
        <Link key={topping.id} to={`/topping/${topping.name}`}>
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}
