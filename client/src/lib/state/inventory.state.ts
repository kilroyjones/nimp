import { writable } from 'svelte/store';
import type { Resources } from '$shared/types';
import type { Writable } from 'svelte/store';
import type { UpdateResourcesResponse } from '$shared/messages';

export const resources: Writable<Resources | undefined> = writable(undefined);

const setResources = (resourcesUpdate: UpdateResourcesResponse) => {
	resources.set(resourcesUpdate);
};

export const InventoryState = {
	setResources
};
