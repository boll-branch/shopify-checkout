/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { ShopifyCheckout, Attribute, GqlClient } from '../../checkout-client.types';
export interface CheckoutAttributesUpdateParams {
    gqlClient: GqlClient;
    /**
     * a Shopify checkout ID.
     */
    id: string;
    customAttributes?: Attribute[];
    note?: string;
}
export declare type CheckoutUpdateVariables = {
    checkoutId: CheckoutAttributesUpdateParams['id'];
    input: Pick<CheckoutAttributesUpdateParams, 'customAttributes' | 'note'>;
};
export default function checkoutAttributesUpdate({ gqlClient, id, customAttributes, note }: CheckoutAttributesUpdateParams): Promise<ShopifyCheckout | void>;
