import { writable, readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const x = writable(0);
export const y = writable(0);
export const cellWidth: Readable<number> = readable(64);
export const cellHeight: Readable<number> = readable(64);
export const regionWidth: Readable<number> = readable(3200);
export const regionHeight: Readable<number> = readable(2048);
export const windowWidth = writable(0);
export const windowHeight = writable(0);

// export const update = writable(true);
// export const publishedContent = writable(1);
// export const messages = writable([]);
// export const messageLookup = writable({});
// export const code = writable('');
// export const reservedMessage = writable(null);
// export const reservedMessageId = writable(null);

// async function makeApiRequest(request, route) {
// 	return await fetch('http://localhost:3000/' + route, {
// 		method: 'POST',
// 		headers: {
// 			Accept: 'application/json',
// 			'Content-Type': 'application/json'
// 		},
// 		body: request
// 	});
// }

// export const loadMessages = async function () {
// 	console.log('Update');
// 	// if (get(update) == false) {
// 	// 	return;
// 	// }

// 	let request = JSON.stringify({
// 		x: Number.parseInt(get(x)),
// 		y: Number.parseInt(get(y)),
// 		w: get(windowWidth),
// 		h: get(windowHeight)
// 	});
// 	console.log(request);
// 	let response = await makeApiRequest(request, 'get_messages');

// 	if (response.status === 200) {
// 		console.log('go messages');
// 		let msgs = await response.json();
// 		console.log(get(messages));
// 		messages.set(msgs);
// 		console.log(msgs);
// 	} else {
// 		throw new Error(response.status);
// 	}
// };

// export const reserveMessage = async function (x, y) {
// 	if (get(reservedMessageId) == null) {
// 		let request = JSON.stringify({
// 			x: x,
// 			y: y
// 		});

// 		let response = await makeApiRequest(request, 'reserve_message');
// 		let resp = await response.json();

// 		if (response.status === 200) {
// 			if (resp.status == 'success') {
// 				code.set(resp.code);
// 				reservedMessageId.set(resp.id);
// 				reservedMessage.set({ id: resp.id, expired: false, x: x, y: y, text: '' });
// 				get(messages).push(get(reservedMessage));
// 				messages.set(get(messages));
// 				console.log(get(messages));
// 			}
// 		} else {
// 			throw new Error(resp.status);
// 		}
// 	}
// };

// export const cancelMessage = async function () {
// 	let request = JSON.stringify({
// 		code: get(code)
// 	});

// 	let response = await makeApiRequest(request, 'cancel_message');
// 	let resp = await response.json();

// 	if (response.status === 200) {
// 		if (resp.status == 'success') {
// 			console.log(get(messages));
// 			messages.set(get(messages).filter((message) => message.id != get(reservedMessageId)));
// 			console.log('cancelled');
// 			console.log(get(messages));
// 			reservedMessageId.set(null);
// 		} else {
// 			throw new Error(resp.status);
// 		}
// 	}
// };

// export const submitMessage = async function (text) {
// 	console.log(text);
// 	let request = JSON.stringify({
// 		code: get(code),
// 		text: text
// 	});
// 	console.log(request);

// 	let response = await makeApiRequest(request, 'add_message');
// 	let resp = await response.json();
// 	console.log(resp);

// 	if (response.status === 200) {
// 		if (resp.status == 'success') {
// 			reservedMessageId.set(null);
// 			console.log('here');
// 			loadMessages();
// 		} else {
// 			throw new Error(resp.status);
// 		}
// 	}
// };

// export const renderMessage = async function (msg) {
// 	let preview = msg.replaceAll(/<[^>]*>/g, '');
// 	preview = '<b>fuck</b>' + preview;
// 	console.log('Rendering', msg);
// 	preview = await preview.replace(
// 		/\#[cC]\[([1234567689abcdefABCDEF]{6})\](.*)\#/g,
// 		function (a, color, content) {
// 			return '<span style="color:#' + color + '">' + content + '</span>';
// 		}
// 	);

// 	preview = await preview.replace(
// 		/\#[lL]\[\s*(-?[-12345676890]+)\s*,\s*(-?[12345676890]+)\s*\](.*)\#/g,
// 		function (a, x, y, text) {
// 			console.log('This');
// 			let url = `<a href="/${x}/${y}">${text}</a>`;
// 			return url;
// 		}
// 	);
// 	console.log(preview);
// 	return preview;
// };

// export const moveWorld = async function (worldX, worldY) {
// 	if (Number.isInteger(parseInt(worldX)) && Number.isInteger(parseInt(worldY))) {
// 		x.set(worldX);
// 		y.set(worldY);
// 	}
// };

// export const incrementMessagesIcons = async function (id, x, y, icon) {
// 	let request = JSON.stringify({
// 		id: id,
// 		x: x,
// 		y: y,
// 		icon: icon
// 	});
// 	console.log(request);

// 	let response = await makeApiRequest(request, 'increment_icon');
// 	let resp = await response.json();
// 	console.log(resp);

// 	if (response.status === 200) {
// 		if (resp.status == 'success') {
// 			console.log('here');
// 			loadMessages();
// 		} else {
// 			throw new Error(resp.status);
// 		}
// 	}
// };

// export const thetest = function () {
// 	console.log('In here');
// };
