/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */

import { ShopifyCheckoutResponse, ShopifyCheckout, ShopifyCheckoutUserError } from '../checkout-client.types';

   
export default function buildCheckout({
  checkout,
  checkoutUserErrors
}: ShopifyCheckoutResponse): ShopifyCheckout & {
  shopifyErrors: ShopifyCheckoutUserError[]
} {
  const {
    id,
    webUrl,
    completedAt,
    lineItems,
    discountApplications
  } = checkout ?? {
    id: null,
    webUrl: null,
    lineItems: { edges: [] },
    discountApplications: { edges: [] }
  }
  return {
    id,
    url: webUrl,
    completed: Boolean(completedAt),
    lines: lineItems.edges.map((edge) => edge.node),
    discounts: discountApplications.edges.map((edge) => edge.node),
    shopifyErrors: checkoutUserErrors
  };
}
