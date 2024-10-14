import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

// Loader function to handle the GET request and return a simple response
export const loader: LoaderFunction = async () => {
  // Returning a simple JSON response with a message
  return json({ success: true, message: "Hello World" });
};
