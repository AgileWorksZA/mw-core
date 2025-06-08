import { describe, test, expect } from "vitest";
import { arrayMove } from "@dnd-kit/sortable";

describe("arrayMove function", () => {
  test("moves an item from one position to another", () => {
    const array = ["a", "b", "c", "d", "e"];
    
    // Move "a" to position 2 (after "c")
    const result = arrayMove(array, 0, 2);
    expect(result).toEqual(["b", "c", "a", "d", "e"]);
  });
  
  test("moves an item backward in the array", () => {
    const array = ["a", "b", "c", "d", "e"];
    
    // Move "d" before "b"
    const result = arrayMove(array, 3, 1);
    expect(result).toEqual(["a", "d", "b", "c", "e"]);
  });
  
  test("moves an item forward in the array", () => {
    const array = ["a", "b", "c", "d", "e"];
    
    // Move "b" after "d"
    const result = arrayMove(array, 1, 3);
    expect(result).toEqual(["a", "c", "d", "b", "e"]);
  });
  
  test("handles moving to the beginning of the array", () => {
    const array = ["a", "b", "c", "d", "e"];
    
    // Move "e" to the beginning
    const result = arrayMove(array, 4, 0);
    expect(result).toEqual(["e", "a", "b", "c", "d"]);
  });
  
  test("handles moving to the end of the array", () => {
    const array = ["a", "b", "c", "d", "e"];
    
    // Move "a" to the end
    const result = arrayMove(array, 0, 4);
    expect(result).toEqual(["b", "c", "d", "e", "a"]);
  });
  
  test("returns a new array and doesn't modify the original", () => {
    const array = ["a", "b", "c", "d", "e"];
    const originalArray = [...array];
    
    arrayMove(array, 1, 3);
    
    // Original array should remain unchanged
    expect(array).toEqual(originalArray);
  });
  
  test("handles the two-item case correctly", () => {
    const array = ["first", "second"];
    
    // Swap positions
    const result = arrayMove(array, 0, 1);
    expect(result).toEqual(["second", "first"]);
    
    // And back
    const result2 = arrayMove(array, 1, 0);
    expect(result2).toEqual(["second", "first"]);
  });
});