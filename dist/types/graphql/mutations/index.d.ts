/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { ShopifyCheckoutUserError, ShopifyCheckoutResponseProperties, ShopifyCheckoutResponse } from '../../checkout-client.types';
export interface CheckoutCreateData {
    checkoutCreate: ShopifyCheckoutResponse;
}
export declare const checkoutCreate: string;
export interface CheckoutLineItemsReplaceData {
    checkoutLineItemsReplace: {
        checkout: ShopifyCheckoutResponseProperties | null;
        userErrors: ShopifyCheckoutUserError[];
    };
}
export declare const checkoutLineItemsReplace: string;
export interface CheckoutAttributesUpdateData {
    checkoutAttributesUpdateV2: ShopifyCheckoutResponse;
}
export declare const checkoutAttributesUpdate: string;
export declare const checkoutDiscountCodeApplyV2: string;
export interface CheckoutDiscountCodeApplyV2Data {
    checkoutDiscountCodeApplyV2: ShopifyCheckoutResponse;
}
export declare const checkoutDiscountCodeRemove: string;
export interface CheckoutDiscountCodeRemoveData {
    checkoutDiscountCodeRemove: ShopifyCheckoutResponse;
}
