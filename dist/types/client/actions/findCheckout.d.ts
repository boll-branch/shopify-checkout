/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { ShopifyCheckout, GqlClient } from '../../checkout-client.types';
export interface FindCheckoutParams {
    gqlClient: GqlClient;
    /**
     * a Shopify checkout ID.
     */
    id: string;
}
export declare type FindCheckoutVariables = Pick<FindCheckoutParams, 'id'>;
export default function findCheckout({ gqlClient, id }: FindCheckoutParams): Promise<ShopifyCheckout | void>;
