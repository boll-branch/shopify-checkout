/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */

import { ShopifyCheckoutCreateResponse, ShopifyCheckout, ShopifyCheckoutResponseUserError } from '../checkout-client.types';

   
export default function buildCheckout({
  checkout: {
    id,
    webUrl,
    completedAt,
    lineItems,
    discountApplications
  },
  checkoutUserErrors
}: ShopifyCheckoutCreateResponse): ShopifyCheckout & {
  errors: ShopifyCheckoutResponseUserError[]
} {
  return {
    id,
    url: webUrl,
    completed: Boolean(completedAt),
    lines: lineItems.edges.map((edge) => edge.node),
    discounts: discountApplications.edges.map((edge) => edge.node),
    errors: checkoutUserErrors
  };
}
