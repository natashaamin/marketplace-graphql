import { gql } from "@apollo/client";

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      success
      errors {
        path
        message
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      errors {
        path
        message
      }
    }
  }
`;

export {
    REGISTER_MUTATION,
    LOGIN_MUTATION
}