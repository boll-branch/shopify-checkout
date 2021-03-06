/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { CheckoutItem, ShopifyCheckout, GqlClient } from '../../checkout-client.types';
export interface CheckoutLineItemsReplaceParams {
    gqlClient: GqlClient;
    /**
     * a Shopify checkout ID.
     */
    id: string;
    lineItems: CheckoutItem[];
}
export declare type CheckoutLineItemsReplaceVariables = Pick<CheckoutLineItemsReplaceParams, 'lineItems'> & {
    checkoutId: CheckoutLineItemsReplaceParams['id'];
};
export default function checkoutLineItemsReplace({ gqlClient, lineItems, id }: CheckoutLineItemsReplaceParams): Promise<ShopifyCheckout | void>;
