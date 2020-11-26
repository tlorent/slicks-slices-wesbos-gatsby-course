import { useState, useEffect } from 'react';

const gql = (parts, ...pieces) =>
  parts.map((part, i) => `${part}${pieces[i] || ''}`).join('');

const details = `
    name
    _id
    image {
      asset {
        url
        metadata {
          lqip
        }
      }
    }
`;

export default function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();

  // Use a side effect to fetch data from graphql endpoint from Sanity.
  useEffect(function () {
    // when the component loads fetch the data
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // remember: client has to send text to the server. use JSON.
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemasters {
                ${details}
              }
              hotSlices {
                ${details}
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO; Check for errors
        // set the data to state
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemasters);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return {
    hotSlices,
    slicemasters,
  };
}
