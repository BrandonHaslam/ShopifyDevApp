// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /**
   * @type {{
   *   tag: string
   * }}
   */
  
  if(!input?.cart?.buyerIdentity?.customer?.hasAnyTag){
    return EMPTY_DISCOUNT;
  }

  const discounts = input.cart.lines
    .filter(line => line.merchandise?.product?.metafield?.value)
    .map((line, index) => {
        return  {
          message: "Black Friday Discount Applied",
          targets: [
            {
              cartLine: {
                id: line.id,
              },
            }
          ],
          value: {
            percentage: {
              value: parseFloat(line.merchandise.product.metafield.value)
            }
          }
        }

    });
  if (!discounts.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.All,
  };
}
