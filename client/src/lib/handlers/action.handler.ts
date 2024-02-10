import { socketClient } from '$lib/socket/client';
import type { ClaimRequest } from '$shared/messages';

/**
 * Send messages
 */
const sendClaim = (claimRequest: ClaimRequest) => {
	if (claimRequest.isClaimable) {
		let msg = JSON.stringify(claimRequest);
		socketClient.send('claim', msg);
	}
};

const sendDig = (key: string, idx: number) => {
	socketClient.send('dig', { key: key, idx: idx });
};

export const ActionHandler = {
	sendClaim,
	sendDig
};
