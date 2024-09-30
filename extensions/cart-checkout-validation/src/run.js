// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

// The configured entrypoint for the 'purchase.validation.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  // Initialize the errors array
  const errors = [];

  // Loop through the cart lines (line items)
  input.cart.lines.forEach((line) => {
    // Directly access merchandise fields assuming it's always a ProductVariant
    const merchandise = line.merchandise;

    // Safely retrieve the title and limit from merchandise
    const title = merchandise.title;
    const sku = merchandise.sku;
    const quantity = line.quantity;

    // Safely retrieve and parse the limit metafield
    const limitMetafield = merchandise.metafield;
    let limit = null;

    if (limitMetafield && limitMetafield.value) {
      // Try parsing the limit value to ensure it's a number
      limit = parseInt(limitMetafield.value, 10);
      
      if (isNaN(limit)) {
        console.error(`Failed to parse limit for product "${title}" with SKU ${sku}. Metafield value: ${limitMetafield.value}`);
        return; // Skip further checks for this line item if the limit is invalid
      }
    }

    // console.log(`Processing product "${title}" (SKU: ${sku}) with quantity ${quantity} and limit ${limit}`);

    // Check if there's a custom limit set via the metafield and compare it to the quantity
    if (limit !== null && quantity > limit) {
      let error = {
        localizedMessage: `You can only order ${limit} of ${title}`,
        target: `cart.line.${line.id}` // Targeting the specific line item
      };
      errors.push(error);
    }
  });

  // Return the errors if any exist
  return { errors };
};
