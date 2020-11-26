import dotenv from 'dotenv';

dotenv.config({ path: '.env ' });

export default {
  siteMetadata: {
    title: 'Slicks Slices',
    description: 'Best pizza in Amsterdam',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'y4xndcl1',
        dataset: 'production',
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
