/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */


import { gql } from '../../utils';
import {
  ShopifyCheckoutUserError,
  ShopifyCheckoutResponseProperties,
  ShopifyCheckoutResponse
} from '../../checkout-client.types';
import fragments from '../fragments';

export interface CheckoutCreateData {
  checkoutCreate: ShopifyCheckoutResponse;
}

export const checkoutCreate = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        ...Checkout_checkout
      }
      checkoutUserErrors {
        ...CheckoutUserError_checkoutUserError
      }
    }
  }
  ${fragments.CHECKOUT}
  ${fragments.USER_ERROR}
`;

export interface CheckoutLineItemsReplaceData {
  checkoutLineItemsReplace: {
    checkout: ShopifyCheckoutResponseProperties | null;
    userErrors: ShopifyCheckoutUserError[];
  };
}

export const checkoutLineItemsReplace = gql`
  mutation checkoutLineItemsReplace(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutId: ID!
  ) {
    checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutId) {
      checkout {
        ...Checkout_checkout
      }
      userErrors {
        ...CheckoutUserError_checkoutUserError
      }
    }
  }
  ${fragments.CHECKOUT}
  ${fragments.USER_ERROR}
`;

export interface CheckoutAttributesUpdateData {
  checkoutAttributesUpdateV2: ShopifyCheckoutResponse;
}

export const checkoutAttributesUpdate = gql`
  mutation checkoutAttributesUpdate(
    $checkoutId: ID!
    $input: CheckoutAttributesUpdateV2Input!
  ) {
    checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
      checkout {
        ...Checkout_checkout
      }
      checkoutUserErrors {
        ...CheckoutUserError_checkoutUserError
      }
    }
  }
  ${fragments.CHECKOUT}
  ${fragments.USER_ERROR}
`;

export const checkoutDiscountCodeApplyV2 = gql`
  mutation checkoutDiscountCodeApplyV2(
    $checkoutId: ID!
    $discountCode: String!
  ) {
    checkoutDiscountCodeApplyV2(
      checkoutId: $checkoutId
      discountCode: $discountCode
    ) {
      checkout {
        ...Checkout_checkout
      }
      checkoutUserErrors {
        ...CheckoutUserError_checkoutUserError
      }
    }
  }
  ${fragments.CHECKOUT}
  ${fragments.USER_ERROR}
`;

export interface CheckoutDiscountCodeApplyV2Data {
  checkoutDiscountCodeApplyV2: ShopifyCheckoutResponse;
}

export const checkoutDiscountCodeRemove = gql`
  mutation checkoutDiscountCodeRemove($checkoutId: ID!) {
    checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
      checkout {
        ...Checkout_checkout
      }
      checkoutUserErrors {
        ...CheckoutUserError_checkoutUserError
      }
    }
  }
  ${fragments.CHECKOUT}
  ${fragments.USER_ERROR}
`;

export interface CheckoutDiscountCodeRemoveData {
  checkoutDiscountCodeRemove: ShopifyCheckoutResponse;
}
