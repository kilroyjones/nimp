import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // Replace with your server's URL
const socket = io(SERVER_URL);

export interface RegionLocation {
	x: number;
	y: number;
}

type Data = RegionLocation[];

type Message = {
	data: Data;
};

socket.on('connect', () => {
	socket.emit('message', { cmd: 'connected', data: 'success' });
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

function send(endpoint: string, msg: Message) {
	console.log(msg);
	socket.emit(endpoint, msg);
}

export const socketClient = {
	send
};
