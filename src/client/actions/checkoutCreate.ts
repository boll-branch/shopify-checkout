/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */


import { buildCheckout } from '../../utils';
import {
  checkoutCreate as checkoutCreateMutation,
  CheckoutCreateData
} from '../../graphql/mutations';
import {
  Attribute,
  CheckoutItem,
  GqlClient,
  ShopifyCheckout
} from '../../checkout-client.types';

export interface CreateCheckoutParams {
  gqlClient: GqlClient;
  lineItems: CheckoutItem[];
  customAttributes?: Attribute[];
  note?: string;
  queueToken?: string;
}

export type CheckoutCreateVariables = {
  input: Pick<CreateCheckoutParams, 'customAttributes' | 'lineItems' | 'note'>;
};

export default async function createCheckout({
  gqlClient,
  lineItems,
  customAttributes,
  note,
  queueToken
}: CreateCheckoutParams): Promise<ShopifyCheckout | void> {
  const query = checkoutCreateMutation;
  const variables = {
    input: { customAttributes, lineItems, note },
    queueToken
  };

  try {
    const { data } = await gqlClient<
      CheckoutCreateVariables,
      CheckoutCreateData
    >({
      query,
      variables
    }).catch((err) => {
      throw new Error(err);
    });

    if (data?.checkoutCreate.checkout) {
      return buildCheckout(data.checkoutCreate);
    }
  } catch (err) {
    throw new Error(String(err));
  }
}
