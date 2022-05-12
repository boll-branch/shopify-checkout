/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { GqlClient, ShopifyCheckout } from '../../checkout-client.types';
export interface RemoveDiscountParams {
    gqlClient: GqlClient;
    id: string;
    queueToken?: string;
}
export declare type RemoveDiscountVariables = {
    input: {
        checkoutId: string;
    };
};
export default function removeDiscount({ gqlClient, id, queueToken }: RemoveDiscountParams): Promise<void | ShopifyCheckout>;
