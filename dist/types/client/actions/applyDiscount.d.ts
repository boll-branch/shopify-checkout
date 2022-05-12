/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { GqlClient, ShopifyCheckout } from '../../checkout-client.types';
export interface ApplyDiscountParams {
    gqlClient: GqlClient;
    id: string;
    discountCode?: string;
    queueToken?: string;
}
export declare type ApplyDiscountVariables = {
    input: {
        checkoutId: string;
        discountCode?: string;
    };
};
export default function applyDiscount({ gqlClient, id, discountCode, queueToken }: ApplyDiscountParams): Promise<void | ShopifyCheckout>;
