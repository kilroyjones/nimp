/**
 *
 */
const difference = function (a: Array<any>, b: Array<any>): Array<any> {
	return Array.from(a).filter((x) => !b.includes(x));
};

/**
 *
 */
const intersection = function (a: Array<any>, b: Array<any>): Array<any> {
	return Array.from(a).filter((x) => b.includes(x));
};

export const ArrayOps = {
	difference,
	intersection
};
