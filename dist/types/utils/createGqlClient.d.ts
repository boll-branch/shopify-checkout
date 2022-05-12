import { GqlClient } from '../checkout-client.types';
import { CreateClientParams } from '../client';
export declare const fetchClientError: string;
declare type CreateGqlClientParams = Pick<CreateClientParams, 'customEndpoint' | 'fetchClient' | 'myshopifyDomain' | 'storefrontCheckoutToken'>;
export declare const missingParametersErrorMessage = "[@nacelle/shopify-checkout]: missing required parameters. You must provide a `myshopifyDomain` or a `customEndpoint`.";
export declare const missingAccessTokenMessage = "[@nacelle/shopify-checkout]: missing required parameter `storefrontCheckoutToken`.";
/**
 * Create a GraphQL client using `window.fetch` or the provided `fetchClient`
 */
export default function createGqlClient({ customEndpoint, fetchClient, myshopifyDomain, storefrontCheckoutToken }: CreateGqlClientParams): GqlClient;
export {};
