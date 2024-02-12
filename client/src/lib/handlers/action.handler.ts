// Modules
import { Conversion } from '$shared/conversion';
import { DigStatus } from '$shared/constants';
import { socketClient } from '$lib/socket/client';
import { RegionState } from '$lib/state/region.state';

// Types and constants
import type { ClaimRequest } from '$shared/messages';
import type { Location } from '$shared/types';

/**
 * Submits a claim request if the item is claimable.
 *
 * @param {ClaimRequest} claimRequest - The claim request object containing claim details.
 */
const sendClaim = (claimRequest: ClaimRequest) => {
	if (claimRequest.isClaimable) {
		let msg = JSON.stringify(claimRequest);
		socketClient.send('claim', msg);
	}
};

/**
 * Sends a dig request for a specified location if the site has not been dug.
 *
 * @param {Location} loc - The location object containing coordinates and additional location data.
 */

const sendDig = (loc: Location) => {
	const key = Conversion.toRegionKey(loc);
	const site = RegionState.getDigSite(key, loc);
	if (site && site.status == DigStatus.UNDUG) {
		socketClient.send('dig', { key: key, idx: site.idx });
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
	socketClient.send(
		'post',
		JSON.stringify({ regionKey: regionKey, postKey: postKey, content: content })
	);
};

export const ActionHandler = {
	sendClaim,
	sendDig,
	sendPost
};
