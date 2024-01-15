export const difference = function (a: Set<any>, b: Set<any>): Set<any> {
	return new Set(Array.from(a).filter((x) => !b.has(x)));
};

export const intersection = function (a: Set<any>, b: Set<any>): Set<any> {
	return new Set(Array.from(a).filter((x) => b.has(x)));
};
