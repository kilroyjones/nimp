import { socketClient } from '$lib/socket/client';

/**
 * Send messages
 */
const sendDig = (key: string, idx: number) => {
	socketClient.send('dig', { key: key, idx: idx });
};

const sendClaim = () => {};

export const ActionHandler = {
	sendDig
};
