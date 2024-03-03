import { goto } from '$app/navigation';
import { PlayerState } from '$lib/state/player.state';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	if (PlayerState.isAccountRegistered() == false) {
		return { err: true, msg: 'anonymous-account' };
	}
	PlayerState.removeState();
	goto('/');
};
