import { gql } from "@apollo/client";

const SENDBID_MUTATION = gql`
    mutation SendBid($price: Int!, $quantity: Int!, $startTime: String!, $endTime: String!){
    sendBid(price: $price, quantity: $quantity, startTime: $startTime, endTime: $endTime) {
        success
        errors {
            path
            message
        }
    }
  }`

const GET_ALL_BIDS = gql`
  query{
  getBids {
    success
    errors {
      path
      message
    }
    bids {
      id
      price
      quantity
      status
      startTime
      endTime
    }
  }
}
`

const GET_BID_BY_ID = gql`
mutation SearchBid($id: ID, $price: Int, $quantity: Int, $startTime: String, $endTime: String) {
  searchBid(id: $id, price: $price, quantity: $quantity, startTime: $startTime, endTime: $endTime) {
    success
    errors {
      path
      message
    }
    bids {
      id
      price
      quantity
      status
      startTime
      endTime
    }
  }
}`

const GET_HISTORY = gql`
query {
  getHistory {
    success
    errors {
      path
      message
    }
    bids {
      id
      finalPrice
      quantitySold
      saleTime
    }
  }
}`

export {
  SENDBID_MUTATION,
  GET_ALL_BIDS,
  GET_BID_BY_ID,
  GET_HISTORY
}