var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function buildCheckout({
  checkout: checkout2,
  checkoutUserErrors
}) {
  const {
    id,
    webUrl,
    completedAt,
    lineItems,
    discountApplications
  } = checkout2 != null ? checkout2 : {
    id: null,
    webUrl: null,
    lineItems: {
      edges: []
    },
    discountApplications: {
      edges: []
    }
  };
  return {
    id,
    url: webUrl,
    completed: Boolean(completedAt),
    lines: lineItems.edges.map((edge) => edge.node),
    discounts: discountApplications.edges.map((edge) => edge.node),
    shopifyErrors: checkoutUserErrors
  };
}
function cartItemsToCheckoutItems({
  cartItems
}) {
  const lineItems = cartItems.map((cartItem) => {
    const {
      quantity,
      variantId: providedVariantId
    } = cartItem;
    const variantId = transformVariantIdToGid(providedVariantId);
    const customAttributes = metafieldsToCustomAttributes({
      metafields: cartItem.metafields
    });
    return {
      customAttributes,
      quantity,
      variantId
    };
  });
  return lineItems;
}
function sanitizeShopifyDomain(domain) {
  var _a, _b;
  const sanitizedDomain = (_b = (_a = domain == null ? void 0 : domain.split(".myshopify").shift()) == null ? void 0 : _a.split("//").pop()) == null ? void 0 : _b.split(".").pop();
  return sanitizedDomain || domain;
}
const fetchClientError = "[@nacelle/shopify-checkout] in order to create a checkout server-side, you must provide a fetch API-compatible `fetchClient` capable of running on both the client & server. Examples include `isomorphic-unfetch` and `cross-fetch`.";
const missingParametersErrorMessage = "[@nacelle/shopify-checkout]: missing required parameters. You must provide a `myshopifyDomain` or a `customEndpoint`.";
const missingAccessTokenMessage = "[@nacelle/shopify-checkout]: missing required parameter `storefrontCheckoutToken`.";
function createGqlClient({
  customEndpoint,
  fetchClient,
  myshopifyDomain,
  storefrontCheckoutToken
}) {
  const gqlClient = ({
    query,
    variables
  }) => {
    let endpoint = customEndpoint || "";
    if (!storefrontCheckoutToken) {
      throw new Error(missingAccessTokenMessage);
    }
    if (!endpoint) {
      if (!myshopifyDomain) {
        throw new Error(missingParametersErrorMessage);
      }
      const domain = sanitizeShopifyDomain(myshopifyDomain || "");
      endpoint = `https://${domain}.myshopify.com/api/2022-01/graphql`;
    }
    let fetcher = fetchClient;
    if (!fetcher) {
      if (typeof window !== "undefined") {
        fetcher = window.fetch;
      } else {
        throw new Error(fetchClientError);
      }
    }
    return fetcher(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontCheckoutToken
      },
      body: JSON.stringify({
        query,
        variables
      })
    }).then((res) => res.json());
  };
  return gqlClient;
}
function gql(str, ...values) {
  return str.reduce((acc, s, i) => `${acc}${s}${values[i] || ""}`, "");
}
function handleShopifyError(errors, {
  caller,
  message
} = {}) {
  let errorMessage = "";
  if (caller) {
    errorMessage = `[${caller}] `;
  }
  errorMessage = errorMessage + (message || "Shopify Storefront API Errors:") + (errors ? "\n" + JSON.stringify(errors, null, 2) : "");
  throw new Error(errorMessage);
}
function isVerifiedCheckoutId(id) {
  if (!(id == null ? void 0 : id.length)) {
    return false;
  }
  return id.includes("Z2lkOi8vc2hvcGlmeS9DaGVja291dC") && id !== "";
}
function metafieldsToCustomAttributes({
  metafields
}) {
  if (!Array.isArray(metafields) || !(metafields == null ? void 0 : metafields.length)) {
    return [];
  }
  const customAttributes = metafields == null ? void 0 : metafields.reduce((fields, m) => {
    if (typeof m.value === "string") {
      fields.push({
        key: m.key,
        value: m.value
      });
    } else {
      console.warn(`Omitting custom attribute "${m.key}" because it has a non-string value.`);
    }
    return fields;
  }, []);
  return customAttributes;
}
function transformVariantIdToGid(variantId) {
  if (isPlainTextGlobalId(variantId)) {
    return variantId;
  }
  if (isNumeric(variantId)) {
    return idToVariantGid(variantId);
  }
  const decodedVariantId = decodeBase64Id(variantId);
  if (isPlainTextGlobalId(decodedVariantId)) {
    return decodedVariantId;
  }
  throw Error(`${variantId} is an invalid shopify variant id`);
}
function isPlainTextGlobalId(variantId) {
  return variantId.startsWith("gid://shopify/");
}
function isNumeric(variantId) {
  return !Number.isNaN(Number(variantId));
}
function decodeBase64Id(variantId) {
  try {
    if (typeof window === "undefined") {
      if (Buffer.from(variantId, "base64").toString("base64") === variantId) {
        return Buffer.from(variantId, "base64").toString();
      } else {
        return variantId;
      }
    } else {
      return window.atob(variantId);
    }
  } catch (err) {
    return variantId;
  }
}
function idToVariantGid(variantId) {
  return `gid://shopify/ProductVariant/${variantId}`;
}
const lineItem = gql`fragment CheckoutLineItem_lineItem on CheckoutLineItem { customAttributes { key value } discountAllocations { allocatedAmount { amount currencyCode } } id quantity title unitPrice { amount currencyCode } variant { id } }`;
const discountApplication = gql`fragment DiscountApplication_discountApplication on DiscountApplication { allocationMethod targetSelection targetType ... on ScriptDiscountApplication { title } value { ... on MoneyV2 { amount currencyCode } ... on PricingPercentageValue { percentage } } }`;
const checkout = gql`fragment Checkout_checkout on Checkout { id webUrl lineItems(first: 100) { edges { node { ...CheckoutLineItem_lineItem } } } discountApplications(first: 100) { edges { node { ...DiscountApplication_discountApplication } } } }${lineItem}${discountApplication}`;
const userError = gql`fragment CheckoutUserError_checkoutUserError on CheckoutUserError { code field message }`;
var fragments = {
  CHECKOUT: checkout,
  USER_ERROR: userError
};
const checkoutCreate = gql`mutation checkoutCreate($input: CheckoutCreateInput!) { checkoutCreate(input: $input) { checkout { ...Checkout_checkout } checkoutUserErrors { ...CheckoutUserError_checkoutUserError } } }${fragments.CHECKOUT}${fragments.USER_ERROR}`;
const checkoutLineItemsReplace$1 = gql`mutation checkoutLineItemsReplace( $lineItems: [CheckoutLineItemInput!]! $checkoutId: ID! ) { checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutId) { checkout { ...Checkout_checkout } userErrors { ...CheckoutUserError_checkoutUserError } } }${fragments.CHECKOUT}${fragments.USER_ERROR}`;
const checkoutAttributesUpdate$1 = gql`mutation checkoutAttributesUpdate( $checkoutId: ID! $input: CheckoutAttributesUpdateV2Input! ) { checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) { checkout { ...Checkout_checkout } checkoutUserErrors { ...CheckoutUserError_checkoutUserError } } }${fragments.CHECKOUT}${fragments.USER_ERROR}`;
const checkoutDiscountCodeApplyV2 = gql`mutation checkoutDiscountCodeApplyV2( $checkoutId: ID! $discountCode: String! ) { checkoutDiscountCodeApplyV2( checkoutId: $checkoutId discountCode: $discountCode ) { checkout { ...Checkout_checkout } checkoutUserErrors { ...CheckoutUserError_checkoutUserError } } }${fragments.CHECKOUT}${fragments.USER_ERROR}`;
const checkoutDiscountCodeRemove = gql`mutation checkoutDiscountCodeRemove($checkoutId: ID!) { checkoutDiscountCodeRemove(checkoutId: $checkoutId) { checkout { ...Checkout_checkout } checkoutUserErrors { ...CheckoutUserError_checkoutUserError } } }${fragments.CHECKOUT}${fragments.USER_ERROR}`;
function checkoutAttributesUpdate(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    id,
    customAttributes,
    note
  }) {
    const query = checkoutAttributesUpdate$1;
    const variables = {
      checkoutId: id,
      input: {
        customAttributes,
        note
      }
    };
    const {
      data,
      errors
    } = yield gqlClient({
      query,
      variables
    }).catch((err) => {
      throw new Error(err);
    });
    const errs = errors || (data == null ? void 0 : data.checkoutAttributesUpdateV2.checkoutUserErrors);
    if (errs == null ? void 0 : errs.length) {
      handleShopifyError(errs, {
        caller: "checkoutAttributesUpdate"
      });
    }
    if (data == null ? void 0 : data.checkoutAttributesUpdateV2.checkout) {
      return buildCheckout(data.checkoutAttributesUpdateV2);
    }
  });
}
function createCheckout(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    lineItems,
    customAttributes,
    note,
    queueToken
  }) {
    const query = checkoutCreate;
    const variables = {
      input: {
        customAttributes,
        lineItems,
        note
      },
      queueToken
    };
    try {
      const {
        data
      } = yield gqlClient({
        query,
        variables
      }).catch((err) => {
        throw new Error(err);
      });
      if (data == null ? void 0 : data.checkoutCreate.checkout) {
        return buildCheckout(data.checkoutCreate);
      }
    } catch (err) {
      throw new Error(String(err));
    }
  });
}
function checkoutLineItemsReplace(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    lineItems,
    id
  }) {
    const query = checkoutLineItemsReplace$1;
    const variables = {
      checkoutId: id,
      lineItems
    };
    const {
      data,
      errors
    } = yield gqlClient({
      query,
      variables
    }).catch((err) => {
      throw new Error(err);
    });
    const errs = errors || (data == null ? void 0 : data.checkoutLineItemsReplace.userErrors);
    if (errs == null ? void 0 : errs.length) {
      handleShopifyError(errs, {
        caller: "checkoutLineItemsReplace"
      });
    }
    if (data == null ? void 0 : data.checkoutLineItemsReplace.checkout) {
      return buildCheckout({
        checkout: data == null ? void 0 : data.checkoutLineItemsReplace.checkout,
        checkoutUserErrors: data == null ? void 0 : data.checkoutLineItemsReplace.userErrors
      });
    }
  });
}
const getCheckout = gql`query getCheckout($id: ID!) { node(id: $id) { ... on Checkout { ...Checkout_checkout } } }${fragments.CHECKOUT}`;
function findCheckout(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    id
  }) {
    const query = getCheckout;
    const variables = {
      id
    };
    const {
      data,
      errors
    } = yield gqlClient({
      query,
      variables
    }).catch((err) => {
      throw new Error(err);
    });
    if (errors) {
      handleShopifyError(errors, {
        caller: "findCheckout"
      });
    }
    if (!(data == null ? void 0 : data.node)) {
      handleShopifyError(void 0, {
        caller: "findCheckout",
        message: "Checkout response has no data"
      });
    } else {
      return buildCheckout({
        checkout: data.node,
        checkoutUserErrors: []
      });
    }
  });
}
function putCheckout(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    id,
    lineItems,
    customAttributes,
    note,
    queueToken
  }) {
    let checkout2 = void 0;
    const shouldUpdateLineItems = lineItems == null ? void 0 : lineItems.length;
    const shouldUpdateAttributes = (customAttributes == null ? void 0 : customAttributes.length) || note;
    try {
      if (id) {
        if (!isVerifiedCheckoutId(id)) {
          throw new Error(`Invalid checkout ID. Expected a Base64-encoded Shopify Global ID. Received: ${id}`);
        }
        const checkoutUpdatePromises = [];
        if (shouldUpdateLineItems) {
          checkoutUpdatePromises.push(checkoutLineItemsReplace({
            gqlClient,
            id,
            lineItems
          }));
        }
        if (shouldUpdateAttributes) {
          checkoutUpdatePromises.push(checkoutAttributesUpdate({
            gqlClient,
            id,
            customAttributes,
            note
          }));
        }
        yield Promise.allSettled(checkoutUpdatePromises).then((settledPromises) => settledPromises.forEach((p) => {
          if (p.status === "fulfilled" && p.value) {
            checkout2 = __spreadValues(__spreadValues({}, checkout2 || {}), p.value);
          } else if (p.status === "rejected") {
            throw new Error(p.reason);
          }
        }));
      }
      if (typeof checkout2 === "undefined" && typeof lineItems !== "undefined") {
        checkout2 = yield createCheckout({
          gqlClient,
          customAttributes,
          note,
          lineItems,
          queueToken
        });
      }
      return checkout2;
    } catch (err) {
      throw new Error(String(err));
    }
  });
}
function applyDiscount(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    id,
    discountCode,
    queueToken
  }) {
    const query = checkoutDiscountCodeApplyV2;
    const variables = {
      input: {
        checkoutId: id,
        discountCode
      },
      queueToken
    };
    try {
      if (!isVerifiedCheckoutId(id)) {
        throw new Error(`Invalid checkout ID. Expected a Base64-encoded Shopify Global ID. Received: ${id}`);
      }
      const {
        data,
        errors
      } = yield gqlClient({
        query,
        variables
      }).catch((err) => {
        throw new Error(err);
      });
      const errs = errors || (data == null ? void 0 : data.checkoutDiscountCodeApplyV2.checkoutUserErrors);
      if (errs == null ? void 0 : errs.length) {
        handleShopifyError(errs, {
          caller: "checkoutDiscountCodeApplyV2"
        });
      }
      if (data == null ? void 0 : data.checkoutDiscountCodeApplyV2.checkout) {
        return buildCheckout(data.checkoutDiscountCodeApplyV2);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  });
}
function removeDiscount(_0) {
  return __async(this, arguments, function* ({
    gqlClient,
    id,
    queueToken
  }) {
    const query = checkoutDiscountCodeRemove;
    const variables = {
      input: {
        checkoutId: id
      },
      queueToken
    };
    try {
      if (!isVerifiedCheckoutId(id)) {
        throw new Error(`Invalid checkout ID. Expected a Base64-encoded Shopify Global ID. Received: ${id}`);
      }
      const {
        data,
        errors
      } = yield gqlClient({
        query,
        variables
      }).catch((err) => {
        throw new Error(err);
      });
      const errs = errors || (data == null ? void 0 : data.checkoutDiscountCodeRemove.checkoutUserErrors);
      if (errs == null ? void 0 : errs.length) {
        handleShopifyError(errs, {
          caller: "checkoutDiscountCodeRemove"
        });
      }
      if (data == null ? void 0 : data.checkoutDiscountCodeRemove.checkout) {
        return buildCheckout(data.checkoutDiscountCodeRemove);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  });
}
function createShopifyCheckoutClient({
  storefrontCheckoutToken,
  myshopifyDomain,
  customEndpoint,
  fetchClient
}) {
  const gqlClient = createGqlClient({
    customEndpoint,
    fetchClient,
    myshopifyDomain,
    storefrontCheckoutToken
  });
  function getCheckout2(_0) {
    return __async(this, arguments, function* ({
      id
    }) {
      return yield findCheckout({
        gqlClient,
        id
      });
    });
  }
  function processCheckout(_0) {
    return __async(this, arguments, function* ({
      cartItems,
      id,
      metafields,
      note,
      queueToken
    }) {
      const lineItems = (cartItems == null ? void 0 : cartItems.length) ? cartItemsToCheckoutItems({
        cartItems
      }) : void 0;
      const customAttributes = (metafields == null ? void 0 : metafields.length) ? metafieldsToCustomAttributes({
        metafields
      }) : void 0;
      return yield putCheckout({
        gqlClient,
        lineItems,
        id,
        customAttributes,
        note,
        queueToken
      });
    });
  }
  function discountApply(_0) {
    return __async(this, arguments, function* ({
      id,
      discountCode,
      queueToken
    }) {
      return yield applyDiscount({
        gqlClient,
        id,
        discountCode,
        queueToken
      });
    });
  }
  function discountRemove(_0) {
    return __async(this, arguments, function* ({
      id,
      queueToken
    }) {
      return yield removeDiscount({
        gqlClient,
        id,
        queueToken
      });
    });
  }
  return {
    get: getCheckout2,
    process: processCheckout,
    discountApply,
    discountRemove
  };
}
export { createShopifyCheckoutClient as default };
//# sourceMappingURL=boll-branch-shopify-checkout.es.js.map
