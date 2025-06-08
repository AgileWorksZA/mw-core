export function validateParams(
  name: string,
  context: unknown,
  id: string | number | symbol,
) {
  if (name === undefined) {
    throw new Error("Name is required");
  }
  if (id === undefined) {
    throw new Error("Id is required");
  }
  if (context === undefined) {
    throw new Error("Context is required");
  }
}
