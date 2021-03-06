/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
import { Attribute, CheckoutItem, GqlClient, ShopifyCheckout } from '../../checkout-client.types';
export interface CreateCheckoutParams {
    gqlClient: GqlClient;
    lineItems: CheckoutItem[];
    customAttributes?: Attribute[];
    note?: string;
    queueToken?: string;
}
export declare type CheckoutCreateVariables = {
    input: Pick<CreateCheckoutParams, 'customAttributes' | 'lineItems' | 'note'>;
};
export default function createCheckout({ gqlClient, lineItems, customAttributes, note, queueToken }: CreateCheckoutParams): Promise<ShopifyCheckout | void>;
