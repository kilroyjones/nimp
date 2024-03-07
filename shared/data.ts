// Types and constants
import { DigStatus } from "./constants";
import { Region } from "./models";
import { Location } from "./types";

const nameRegex = /^[A-Za-z0-9]+$/;
const passwordRegex = /^[A-Za-z0-9!@#$%^&*]+$/;

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
 * Retrieves a character from a string at a specified index.
 * If the index is out of bounds, an empty string is returned.
 *
 * @param {string} str - The string from which to retrieve the character.
 * @param {number} index - The index of the character to retrieve.
 * @returns {string} The character at the specified index, or an empty string if the index is out of bounds.
 */
const getCharAt = (str: string, index: number) => {
  if (index < str.length) {
    return str[index];
  }
  return "";
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
  if (index > str.length) {
    return str;
  }
  return str.substring(0, index) + chr + str.substring(index + 1);
};

/**
 * Compares two Location objects for equality
 *
 * @param {Location} loc1 - Location 1
 * @param {Location} loc2 - Location 2
 * @returns {boolean} true or false if the locations are equal
 */
const locationsEqual = (loc1: Location, loc2: Location) => {
  if (loc1.x == loc2.x && loc1.y == loc2.y) {
    return true;
  }
  return false;
};

/**
 * Determines if space has been dug (1, which is dug, but not claimed)
 
 * @param {Location} loc1 - Location 1
 * @param {Location} loc2 - Location 2
 * @returns {boolean} true or false if the locations are equal
 */
const isDug = (idx: number, region: Region): boolean => {
  if (getCharAt(region.digs, idx) == DigStatus.DUG) {
    return true;
  }
  return false;
};

/**
 * Checks if a name is valid
 *
 * @param {string} name
 * @returns {Object} Object containss err and msg fields
 */
const checkName = (name: string): { err: boolean; msg: string } => {
  if (name.length < 2) {
    return { err: true, msg: "Name must be at least two letters" };
  } else if (!nameRegex.test(name)) {
    return { err: true, msg: "Name must include only letters and numbers" };
  } else if (name.length == 27) {
    return { err: true, msg: "Names cannot exceed 27 characters" };
  }
  return { err: false, msg: "" };
};

/**
 * Checks if a password is valid
 *
 * @param {string} password
 * @returns {Object} Object containss err and msg fields
 */
const checkPassword = (password: string): { err: boolean; msg: string } => {
  if (password.length < 9) {
    return { err: true, msg: "Password must be at least 9 characters" };
  }

  if (passwordRegex.test(password) == false) {
    return {
      err: true,
      msg: "Password can only container letters, numbers and characters: !@#$%^&*",
    };
  }
  return { err: false, msg: "" };
};

export const Data = {
  arrayDifference,
  arrayIntersection,
  getCharAt,
  setCharAt,
  locationsEqual,
  isDug,
  checkName,
  checkPassword,
};
