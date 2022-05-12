/**
 * Modified by David Rekow <drekow@bollandbranch.com>
 */
export interface Attribute {
    key: string;
    value: string;
}
export interface Metafield extends Attribute {
    [key: string]: string;
}
export declare type DiscountAllocation = {
    allocatedAmount: {
        amount: any;
        currencyCode: string;
    };
};
export declare type CheckoutLine = {
    customAttributes: Array<Attribute>;
    discountAllocations: Array<DiscountAllocation>;
    id: string;
    quantity: number;
    title: string;
    unitPrice: {
        amount: any;
        currencyCode: string;
    };
    variant: {
        id: string;
    };
};
export declare type CheckoutDiscountApplication = {
    allocationMethod: string;
    targetSelection: string;
    targetType: string;
    value: {
        amount: any;
        currencyCode: string;
        percentage: number;
    };
};
export declare type ShopifyCheckout = {
    id: string | null;
    url: string | null;
    completed: boolean | null;
    lines: Array<CheckoutLine>;
    discounts: Array<CheckoutDiscountApplication>;
};
export declare type ShopifyCheckoutResponseLineConnection = {
    edges: Array<ShopifyCheckoutResponseLineEdge>;
};
export declare type ShopifyCheckoutResponseLineEdge = {
    node: CheckoutLine;
};
export declare type ShopifyCheckoutResponseDiscountConnection = {
    edges: Array<ShopifyCheckoutResponseDiscountEdge>;
};
export declare type ShopifyCheckoutResponseDiscountEdge = {
    node: CheckoutDiscountApplication;
};
export declare type ShopifyCheckoutResponseUserError = {
    code?: string;
    field?: string;
    message: string;
};
export interface ShopifyCheckoutResponseProperties {
    id: string;
    webUrl: string;
    completedAt: string | null;
    lineItems: ShopifyCheckoutResponseLineConnection;
    discountApplications: ShopifyCheckoutResponseDiscountConnection;
}
export interface ShopifyCheckoutResponse {
    checkout: ShopifyCheckoutResponseProperties | null;
    checkoutUserErrors: ShopifyCheckoutUserError[];
}
export declare type BuildCheckoutParams = ShopifyCheckoutResponseProperties & {
    customAttributes?: Attribute[];
    note?: string;
};
export interface CartItem {
    quantity: number;
    variantId: string;
    metafields?: Metafield[];
    [key: string]: unknown;
}
export declare type CheckoutItem = Pick<CartItem, 'quantity' | 'variantId'> & {
    customAttributes: Attribute[];
};
export interface ShopifyCheckoutUserError {
    code: string;
    field: string[];
    message: string;
}
interface ShopifyErrorLocation {
    line: number;
    column: number;
}
interface ShopifyErrorExtensionProblems {
    path: (string | number)[];
    explanation: string;
    message?: string;
}
export interface ShopifyError {
    message: string;
    locations: ShopifyErrorLocation[];
    extensions: {
        value: string | unknown;
        problems: ShopifyErrorExtensionProblems[];
    };
}
export declare type ShopifyResponse<D> = {
    data?: D;
    errors?: ShopifyError[];
};
export interface GqlClientParams<V> {
    query: string;
    variables: V;
}
export declare type GqlClient = <V, R>(params: GqlClientParams<V>) => Promise<ShopifyResponse<R>>;
export declare type GqlStringField = string | null;
export {};
