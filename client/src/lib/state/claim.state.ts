// Modules
import { get, writable, type Writable } from 'svelte/store';
import { Conversion } from '$shared/conversion';
import { Data } from '$shared/data';
import { DrawState } from './draw.state';
import { RegionState } from './region.state';

// Types and constants
import type { Location } from '$shared/types';
import type { Region } from '$shared/models';
import { DIG_HEIGHT, DIG_WIDTH } from '$shared/constants';

type Selection = {
	loc: Location;
	region: Region;
};

type SelectionLocations = {
	topLeft: Location;
	bottomRight: Location;
};

type SelectedDig = {
	idx: number;
	key: string;
};

type SelectedDigs = {
	digs: SelectedDig[];
	isClaimable: boolean;
};

enum Selecting {
	NONE,
	SINGLE,
	MULTIPLE
}

let selecting: Selecting = Selecting.NONE;

const selections: Writable<Array<Selection>> = writable(new Array());

/**
 * Calculates selected digs based on selection locations.
 *
 * @param {SelectionLocations} selectionLocs - The selection locations to evaluate.
 * @returns {SelectedDigs} The selected digs and their claimability.
 */
const getSelectionDigs = (selectionLocs: SelectionLocations) => {
	let selectedDigs: SelectedDigs = { digs: [], isClaimable: true };
	let isClaimable = true;

	for (let x = selectionLocs.topLeft.x; x <= selectionLocs.bottomRight.x; x += DIG_WIDTH) {
		for (let y = selectionLocs.topLeft.y; y <= selectionLocs.bottomRight.y; y += DIG_HEIGHT) {
			const loc: Location = Conversion.toLocation(x, y);
			const regionLocation = Conversion.toRegionLocation(loc);
			const region = RegionState.get(Conversion.toRegionKey(regionLocation));
			if (region) {
				selectedDigs.digs.push({ idx: Conversion.toDigIndex(loc, region), key: region.key });
				if (isClaimable == true && RegionState.isClaimable(loc, region) == false) {
					isClaimable = false;
					selectedDigs.isClaimable = false;
				}
			}
		}
	}
	return selectedDigs;
};

/**
 * Determines the top-left and bottom-right locations based on selections.
 *
 * @param {Selection[]} selects - An array of selections.
 * @returns {SelectionLocations} The calculated locations.
 */
const getSelectionLocations = (selects: Selection[]): SelectionLocations => {
	let loc1 = Conversion.toGridLocation(selects[0].loc);
	let loc2 = Conversion.toGridLocation(selects[1].loc);

	const width = Math.abs(loc1.x - loc2.x);
	const height = Math.abs(loc1.y - loc2.y);

	if (width > 0 && width < 6 * DIG_WIDTH && height > 0 && height < 6 * DIG_HEIGHT) {
		return {
			topLeft: Conversion.toLocation(Math.min(loc1.x, loc2.x), Math.min(loc1.y, loc2.y)),
			bottomRight: Conversion.toLocation(Math.max(loc1.x, loc2.x), Math.max(loc1.y, loc2.y))
		};
	}

	return {
		topLeft: loc2,
		bottomRight: loc2
	};
};

/**
 * Handles the selection status based on location and region.
 *
 * @param {Location} loc - The location to consider for selection.
 * @param {Region} region - The region associated with the location.
 */
const handleSelectStatus = (loc: Location, region: Region) => {
	if (!RegionState.isClaimable(loc, region)) {
		selecting = Selecting.NONE;
	} else {
		// Pulled this out to keep the code slightly more readable
		const currentSelection = [
			{ loc, region },
			{ loc, region }
		];

		switch (selecting) {
			case Selecting.NONE:
				selections.update(() => currentSelection);
				selecting = Selecting.SINGLE;
				break;

			case Selecting.SINGLE:
				selections.update((a) => [a[0], { loc, region }]);
				const singleSelection = getSelectionLocations(get(selections));

				/**
				 * This handles:
				 *  - Have we clicked on the same location
				 *  - If selection formed is invalid we revert to a single click
				 *  - Otherwise set to multiple selection
				 */
				if (Data.locationsEqual(get(selections)[0].loc, get(selections)[1].loc)) {
					selecting = Selecting.NONE;
				} else if (Data.locationsEqual(singleSelection.topLeft, singleSelection.bottomRight)) {
					selecting = Selecting.SINGLE;
					selections.update(() => currentSelection);
				} else {
					selecting = Selecting.MULTIPLE;
				}
				break;

			case Selecting.MULTIPLE:
				selections.update(() => currentSelection);
				selecting = Selecting.SINGLE;
				break;
		}
	}
};

/**
 * Updates the draw state based on the current selection.
 */
const handleDrawUpdate = () => {
	if (selecting !== Selecting.NONE) {
		const selectionLocs = getSelectionLocations(get(selections));
		const selectedDigs = getSelectionDigs(selectionLocs);

		DrawState.setSelection(
			selectionLocs.topLeft,
			selectionLocs.bottomRight,
			selectedDigs.isClaimable
		);

		// TODO: Do something with these digs if they are valid
	} else {
		DrawState.resetSelection();
	}
};

/**
 * Attempts to claim a region based on a given location.
 *
 * @param {Location} loc - The location to attempt to claim.
 */
const claim = (loc: Location) => {
	const key = Conversion.toRegionKey(loc);
	const region = RegionState.get(key);
	if (region) {
		handleSelectStatus(loc, region);
		handleDrawUpdate();
	} else {
		selections.update((a) => []);
	}
};

export const ClaimState = {
	claim
};
