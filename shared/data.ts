/**
 * Calculates the difference between two arrays.
 * It returns a new array containing elements from the first array that are not present in the second array.
 *
 * @param {Array<any>} a - The first array.
 * @param {Array<any>} b - The second array to compare against.
 * @returns {Array<any>} An array containing elements that are in 'a' but not in 'b'.
 */
const arrayDifference = function (a: Array<any>, b: Array<any>): Array<any> {
  return Array.from(a).filter(x => !b.includes(x));
};

/**
 * Calculates the intersection of two arrays.
 * It returns a new array containing all elements that are present in both arrays.
 *
 * @param {Array<any>} a - The first array.
 * @param {Array<any>} b - The second array to compare with.
 * @returns {Array<any>} An array containing elements that are both in 'a' and 'b'.
 */
const arrayIntersection = function (a: Array<any>, b: Array<any>): Array<any> {
  return Array.from(a).filter(x => b.includes(x));
};

/**
 * Replaces a character at a specific index in a string with a new character.
 * If the index is out of bounds of the string, the original string is returned.
 *
 * @param {string} str - The string to modify.
 * @param {number} index - The index at which to replace the character.
 * @param {string} chr - The new character to be set at the specified index.
 * @returns {string} A new string with the character at the specified index replaced.
 */
const setCharAt = (str: string, index: number, chr: string) => {
  if (index > str.length - 1) {
    return str;
  }
  return str.substring(0, index) + chr + str.substring(index + 1);
};

/**
 * Retrieves a character from a string at a specified index.
 * If the index is out of bounds, an empty string is returned.
 *
 * @param {string} str - The string from which to retrieve the character.
 * @param {number} index - The index of the character to retrieve.
 * @returns {string} The character at the specified index, or an empty string if the index is out of bounds.
 */
const getCharAt = (str: string, index: number) => {
  if (index < str.length - 1) {
    return str[index];
  }
  return "";
};

export const Data = {
  arrayDifference,
  arrayIntersection,
  setCharAt,
  getCharAt,
};
