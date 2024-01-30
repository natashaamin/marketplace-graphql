import { Bid } from "../../entity/Bid";
import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { formatYupError } from "../../utils/formatYupError";

export const resolvers: ResolverMap = {
    Mutation: {
        sendBid: async (_, args: GQL.ISendBidOnMutationArguments) => {
            try {
                const { price, quantity, startTime, endTime } = args;

                let status: string = 'REJECTED';

                if (price > 20) {
                    status = 'ACCEPTED';
                } else {
                    status = 'REJECTED';
                }

                const bid = await Bid.create({
                    price,
                    quantity,
                    status,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                })

                await bid.save();
                return {
                    success: true,
                    errors: null
                }

            } catch (err) {
                return formatYupError(err);
            }
        },
        searchBid: async (_, args: GQL.ISearchBidOnMutationArguments) => {
            try {
                const { id, price, quantity, startTime, endTime } = args;
        
                // Initialize an empty query object
                const query: any = {};
        
                if (id) {
                    query.id = id;
                }
        
                if (price) {
                    query.price = price;
                }
        
                if (quantity) {
                    query.quantity = quantity;
                }
        
                if (startTime && endTime) {
                    query.startTime = {
                        $gte: new Date(startTime),
                        $lte: new Date(endTime),
                    };
                }
        
                // Check if all query fields are null, and return all bids in that case
                if (
                    Object.keys(query).every((key) => query[key] === null)
                ) {
                    const allBids = await Bid.find();
                    return {
                        success: true,
                        errors: null,
                        bids: allBids,
                    };
                }
        
                // Use the query object to filter bids
                const finalBid = await Bid.find({ where: query });
        
                return {
                    success: true,
                    errors: null,
                    bids: finalBid,
                };
            } catch (err) {
                return formatYupError(err);
            }
        }
    },
    Query: {
        getBids: async (_) => {
            try {
                const listOfBids = await Bid.find();
                return {
                    success: true,
                    errors: null,
                    bids: listOfBids
                };
            } catch (err) {
                return formatYupError(err);
            }
        },
        getHistory: async (_) => {
            try {
                const listOfBids = await Bid.find();
                const listOfAcceptedBid = listOfBids
                    .filter((bid) => bid.status === 'ACCEPTED')
                    .map((item) => {
                        const total = item.price * 2;

                        return {
                            id: item.id,
                            finalPrice: total,
                            quantitySold: item.quantity,
                            saleTime: new Date().toISOString()
                        }
                    }
                    )

                return {
                    success: true,
                    errors: null,
                    bids: listOfAcceptedBid
                };
            } catch (err) {
                return formatYupError(err);
            }
        }
    }
}