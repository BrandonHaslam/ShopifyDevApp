// @ts-check

/*
A straightforward example of a function that expands a bundle into its component parts.
The parts of a bundle are stored in a metafield on the product parent value with a specific format,
specifying each part's quantity and variant.

The function reads the cart. Any item containing the metafield that specifies the bundle parts
will return an Expand operation containing the parts.
*/

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      const expandOperation = optionallyBuildExpandOperation(cartLine);

      if (expandOperation) {
        return [...acc, { expand: expandOperation }];
      }

      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
}

function optionallyBuildExpandOperation(
  { id: cartLineId, merchandise, cost, quantity }
) {
  // This will need to check for the GWP
  const hasWarrantyMetafields =
    merchandise.__typename === "ProductVariant"
  const shouldAddWarranty = true

  if (
    merchandise.__typename === "ProductVariant" &&
    hasWarrantyMetafields &&
    shouldAddWarranty
  ) {
    return {
      cartLineId,
      title: `${merchandise.title}`,
      // Optionally override the image for line item
      // image: { url: "https://cdn.shopify.com/.../something.png" },
      expandedCartItems: [
        {
          merchandiseId: merchandise.product.warrantyVariantID.value,
          quantity: 1,
          price: {
            adjustment: {
              fixedPricePerUnit: {
                amount: (0
                ).toFixed(2),
              },
            },
          },
        },
        {
          merchandiseId: merchandise.id,
          quantity: 1,
          price: {
            adjustment: {
              fixedPricePerUnit: {
                amount: (parseFloat(cost.amountPerQuantity.amount)
                ).toFixed(2),
              },
            },
          },
        }
      ],
    };
  }

  return null;
}