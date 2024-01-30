declare namespace API {
    interface IDataType {
        key: string;
        username: string;
        price: string | number;
        quantity: string | number;
        date: string | number;
   }

   interface ITransactionDetails {
    finalPrice: string | number;
    quantitySold: string | number;
    saleTime: string | number
   }

   interface IHistoryItems {
    key: number;
    bidId: string | number;
    quantity: string;
    startTime: string;
    endTime: string;
    price: string;
    status: string;
    transactionDetails: ITransactionDetails;
  }
}