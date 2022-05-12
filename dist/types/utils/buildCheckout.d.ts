/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { ShopifyCheckoutResponse, ShopifyCheckout, ShopifyCheckoutUserError } from '../checkout-client.types';
export default function buildCheckout({ checkout, checkoutUserErrors }: ShopifyCheckoutResponse): ShopifyCheckout & {
    shopifyErrors: ShopifyCheckoutUserError[];
};
