import { gql } from "@apollo/client";

export const POSITIONS = gql`
  query Positions {
    positions {
      id
      name
    }
  }
`;

export const PROFILE = gql`
  query Profile($userId: ID!) {
    profile(userId: $userId) {
      id
      first_name
      last_name
      full_name
      avatar
    }
  }
`;
