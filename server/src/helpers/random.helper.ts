/**
 * Returns a random int from 'a' to 'b'.
 *
 * @param {number} a - The lower bound
 * @param {number} b - The upper bound
 * @returns {number} A random value
 */
export const getInt = (a: number, b: number): number => {
  return Math.floor(Math.random() * (b - a + 1)) + a;
};

export const Random = {
  getInt,
};
