import { generateDummyItems, timeStringToSeconds } from "../utils/util";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)

export interface IMarketItems {
    time: string;
    pricePerMWh: number;
}

export enum EStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}

interface ITransactionDetails {
    finalPrice: string | number;
    quantitySold: string | number;
    saleTime: string | number
}

interface IBidItems {
    bidId?: string;
    userId?: string;
    currentDate: string;
    quantity: string;
    startTime: string;
    closeTime: string;
    price: string;
    status?: EStatus;
    transactionDetails?: ITransactionDetails
}

let listOfBidItems: IBidItems[] = [];

export const listOfMarketItems = () => {
    const timeStrings = generateDummyItems();
    timeStrings.sort();
    return timeStrings;
};

const isBidEligibleForApproval = (bidItem: IBidItems) => {
    const threshold = calculateThreshold(bidItem.startTime);
    return parseInt(bidItem.price) >= threshold;
};

const calculateThreshold = (startTime: string) => {
    const hour = new Date(startTime).getHours();
    // Assuming 8 AM to 6 PM as peak hours
    if (hour >= 8 && hour <= 18) {
        return 0.12;
    } else {
        return 0.08;
    }
};


export const storeBidding = (bidItem: IBidItems) => {
    if (isBidEligibleForApproval(bidItem)) {
        bidItem.status = EStatus.ACCEPTED;
        bidItem.bidId = (Math.random() + 1).toString(36).substring(7);

        bidItem.transactionDetails = {
            finalPrice: calculateFinalPrice(bidItem), // Implement this function based on your pricing logic
            quantitySold: bidItem.quantity, // Assume full quantity is sold for simplicity
            saleTime: new Date().toISOString() // Use current time as sale time
        };
    } else {
        bidItem.status = EStatus.PENDING;
        bidItem.bidId = (Math.random() + 1).toString(36).substring(7);
    }

    listOfBidItems.push(bidItem);
    return listOfBidItems;
}

const calculateFinalPrice = (bidItem: any) => {
    let total: number = 0;

    if (listOfBidItems.length !== 0) {
        listOfBidItems.forEach((item: any) => {
            total += parseInt(item.price);
        });
    }

    total += parseInt(bidItem.price);

    return total;
};



export const getBidsFromHistory = (userId: string, bidId?: string, price?: string, startTime?: string, closeTime?: string, quantity?: string) => {
    let filteredBids = listOfBidItems.filter(bid => bid.userId === userId);

    if (bidId) {
        filteredBids = filteredBids.filter(bid => bid.bidId === bidId);
    }
    if (price) {
        filteredBids = filteredBids.filter(bid => bid.price === price);
    }
    if (quantity) {
        filteredBids = filteredBids.filter(bid => bid.quantity === quantity);
    }
    if (startTime && closeTime) {
        const startRange = dayjs(startTime, "HH:mm:ss");
        const endRange = dayjs(closeTime, "HH:mm:ss");

        filteredBids = filteredBids.filter(bid => {
            const bidStartTime = dayjs(bid.startTime, "HH:mm:ss");
            const bidCloseTime = dayjs(bid.closeTime, "HH:mm:ss");

            return startRange.isSameOrAfter(bidStartTime) && endRange.isSameOrBefore(bidCloseTime);
        });
    }

    return filteredBids
}

export const getTotalTransaction = () => {
    const transactions = listOfBidItems
        .filter((item: any) => item.transactionDetails != null)
        .map((item: any) => {
            const date = new Date(item.transactionDetails.saleTime);
            const month = date.toLocaleString('default', { month: 'long' });
            return {
                price: item.transactionDetails.finalPrice,
                month: month,
            };
        });
        

    return transactions;
}
