import { socketClient } from '$lib/socket/client';

/**
 * Send messages
 */
const sendDig = (key: string, idx: number) => {
	socketClient.send('dig', { key: key, idx: idx });
};

export const ActionHandler = {
	sendDig
};
