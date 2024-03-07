<script lang="ts">
	import { PlayerState } from '$lib/state/player.state';
	import { PlaySocket } from '$lib/sockets/play.socket';
</script>

Inventory
{PlayerState.isDefined()}
{PlaySocket.isConnected()}
