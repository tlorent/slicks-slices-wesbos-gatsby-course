import { MdLocalPizza as icon } from 'react-icons/md';
import PriceInput from '../components/PriceInput';

export default {
  // Computer name -- always lowercase
  name: 'pizza',
  // Human-readable name, visible title
  title: 'Pizzas',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Pizza Name',
      type: 'string',
      description: 'Name of the pizza',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price of the pizza in cents',
      validation: (Rule) => Rule.min(1000).max(50000),
      inputComponent: PriceInput,
    },
    {
      name: 'toppings',
      title: 'Toppings',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'topping' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      topping0name: 'toppings.0.name',
      topping1name: 'toppings.1.name',
      topping2name: 'toppings.2.name',
      topping3name: 'toppings.3.name',
      topping0vegetarian: 'toppings.0.vegetarian',
      topping1vegetarian: 'toppings.1.vegetarian',
      topping2vegetarian: 'toppings.2.vegetarian',
      topping3vegetarian: 'toppings.3.vegetarian',
    },
    prepare: ({ title, media, ...toppings }) => {
      const tops = Object.values(toppings).filter(
        (topping) => typeof topping === 'string'
      );
      const isVeggie = !Object.values(toppings).includes(false);
      return {
        title: `${title} ${isVeggie ? '🌱' : ''}`,
        media,
        subtitle: tops.join(', '),
      };
    },
  },
};
