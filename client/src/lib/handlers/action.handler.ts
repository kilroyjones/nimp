// Modules
import { Conversion } from '$shared/conversion';
import { DigStatus } from '$shared/constants';
import { PlaySocket } from '$lib/sockets/play.socket';
import { RegionState } from '$lib/state/region.state';

// Types and constants
import type { ClaimRequest } from '$shared/messages';
import type { Location } from '$shared/types';
import { DrawState } from '$lib/state/draw.state';

/**
 * Submits a claim request if the item is claimable.
 *
 * @param {ClaimRequest} claimRequest - The claim request object containing claim details.
 */
const sendClaim = (claimRequest: ClaimRequest) => {
	if (claimRequest.isClaimable) {
		PlaySocket.send('claim', JSON.stringify(claimRequest));
	}
};

/**
 * Sends a dig request for a specified location if the site has not been dug.
 *
 * @param {Location} loc - The location object containing coordinates and additional location data.
 */

const sendDig = (loc: Location) => {
	const regionKey = Conversion.toRegionKey(loc);
	const site = RegionState.getDigSite(regionKey, loc);
	if (site && site.status == DigStatus.UNDUG) {
		PlaySocket.send('dig', { regionKey: regionKey, idx: site.idx });
	}
};

/**
 * Posts content to a specified region and post key.
 *
 * @param {string} regionKey - The key of the region where the post will be sent.
 * @param {string} postKey - The key identifying the specific post.
 * @param {string} content - The content to be posted.
 */
const sendPost = (regionKey: string, postKey: string, content: string) => {
	PlaySocket.send(
		'post',
		JSON.stringify({ regionKey: regionKey, postKey: postKey, content: content })
	);
};

export const ActionHandler = {
	sendClaim,
	sendDig,
	sendPost
};
