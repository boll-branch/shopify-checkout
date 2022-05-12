import { FindCheckoutParams } from '../client/actions/findCheckout';
import { PutCheckoutParams } from '../client/actions/putCheckout';
import { ApplyDiscountParams } from '../client/actions/applyDiscount';
import { RemoveDiscountParams } from '../client/actions/removeDiscount';
import { CartItem, Metafield, ShopifyCheckout } from '../checkout-client.types';
export interface CreateClientParams {
    storefrontCheckoutToken: string;
    myshopifyDomain?: string;
    customEndpoint?: string;
    fetchClient?: typeof fetch;
}
export declare type GetCheckoutParams = Pick<FindCheckoutParams, 'id'>;
export declare type DiscountApplyParams = Omit<ApplyDiscountParams, 'gqlClient'>;
export declare type DiscountRemoveParams = Omit<RemoveDiscountParams, 'gqlClient'>;
export declare type GetCheckout = (params: GetCheckoutParams) => Promise<ShopifyCheckout | void>;
export declare type ProcessCheckoutParams = Pick<PutCheckoutParams, 'id' | 'note' | 'queueToken'> & {
    cartItems?: CartItem[];
    metafields?: Metafield[];
};
export declare type ProcessCheckout = (params: ProcessCheckoutParams) => Promise<void | ShopifyCheckout>;
export declare type ApplyDiscount = (params: DiscountApplyParams) => Promise<void | ShopifyCheckout>;
export declare type RemoveDiscount = (params: DiscountRemoveParams) => Promise<void | ShopifyCheckout>;
export interface CheckoutClient {
    /**
     * Retrieve a previously-created Shopify checkout.
     */
    get: GetCheckout;
    /**
     * Creates a Shopify checkout, or updates an existing Shopify checkout
     * if a valid `checkoutId` is provided.
     */
    process: ProcessCheckout;
    /**
     * Applies and validate discount code
     */
    discountApply: ApplyDiscount;
    /**
     * Applies and validate discount code
     */
    discountRemove: RemoveDiscount;
}
/**
 * Create a Shopify checkout client that can:
 * - `get` an existing Shopify checkout
 * - `process` a new Shopify checkout, or update an existing Shopify checkout
 */
export default function createShopifyCheckoutClient({ storefrontCheckoutToken, myshopifyDomain, customEndpoint, fetchClient }: CreateClientParams): CheckoutClient;
