// tslint:disable
// graphql typescript definitions

export namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IMutation {
    __typename: 'Mutation';
    sendBid: ISendBidResponse;
    searchBid: IGetBidsResponse;
    login: ILoginResponse;
    register: IRegisterResponse;
  }

  interface ISendBidOnMutationArguments {
    price: number;
    quantity: number;
    startTime: string;
    endTime: string;
  }

  interface ISearchBidOnMutationArguments {
    id?: string | null;
    price?: number | null;
    quantity?: number | null;
    startTime?: string | null;
    endTime?: string | null;
  }

  interface ILoginOnMutationArguments {
    username: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    username: string;
    password: string;
  }

  interface IQuery {
    __typename: 'Query';
    getBids: IGetBidsResponse;
    getHistory: IGetHistoryResponse;
    hello: string;
  }

  interface IHelloOnQueryArguments {
    name?: string | null;
  }

  interface ISendBidResponse {
    __typename: 'SendBidResponse';
    success: boolean;
    errors: Array<IError | null> | null;
  }

  interface IGetBidsResponse {
    __typename: 'GetBidsResponse';
    success: boolean;
    errors: Array<IError | null> | null;
    bids: Array<IBid | null> | null;
  }

  interface IGetHistoryResponse {
    __typename: 'GetHistoryResponse';
    success: boolean;
    errors: Array<IError | null> | null;
    bids: Array<IAcceptedBidReponse | null> | null;
  }

  interface IAcceptedBidReponse {
    __typename: 'AcceptedBidReponse';
    id: string;
    finalPrice: number | null;
    quantitySold: number | null;
    saleTime: string | null;
  }

  interface IBid {
    __typename: 'Bid';
    id: string;
    price: number | null;
    quantity: number | null;
    status: string | null;
    startTime: string | null;
    endTime: string | null;
  }

  interface IBidResponse {
    __typename: 'BidResponse';
    success: boolean;
    errors: Array<IError | null> | null;
  }

  interface ILoginResponse {
    __typename: 'LoginResponse';
    success: boolean;
    token: string;
    errors: Array<IError | null> | null;
  }

  interface IRegisterResponse {
    __typename: 'RegisterResponse';
    success: boolean;
    errors: Array<IError | null> | null;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }
}

// tslint:enable
