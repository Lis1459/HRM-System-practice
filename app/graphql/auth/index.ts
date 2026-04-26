import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      user {
        id
        email
        profile {
          id
          full_name
          avatar
        }
        role
        is_verified
      }
      access_token
      refresh_token
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user {
        id
        email
        profile {
          id
          full_name
          avatar
        }
        role
        is_verified
      }
      access_token
      refresh_token
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`;

export const UPDATE_TOKEN = gql`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

export const ME = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      id
      email
      profile {
        id
        full_name
        avatar
      }
      role
      is_verified
    }
  }
`;

///

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
