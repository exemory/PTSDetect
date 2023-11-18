import { gql } from '@apollo/client';

export const GET_ALL_FILMS = gql`
  query GetAllFilms {
    allFilms {
      films {
        title
        director
        releaseDate
        speciesConnection {
          species {
            name
            classification
            homeworld {
              name
            }
          }
        }
      }
    }
  }
`;
