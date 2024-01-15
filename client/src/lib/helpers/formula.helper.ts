/**
 * A function to calculate the distance between two points
 */
function distance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export const Formulas = {
	distance
};
