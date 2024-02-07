import { socketClient } from '$lib/socket/client';
import type { ClaimRequest } from '$shared/messages';

/**
 * Send messages
 */
const sendClaim = (claimRequest: ClaimRequest) => {
	// console.log(selectedDigs);
	if (claimRequest.isClaimable) {
		let msg = JSON.stringify(claimRequest);
		socketClient.send('claim', msg);
	}
	// let decode = JSON.parse(msg);
	// console.log(decode);
};

const sendDig = (key: string, idx: number) => {
	socketClient.send('dig', { key: key, idx: idx });
};

export const ActionHandler = {
	sendClaim,
	sendDig
};
