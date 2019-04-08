const EventEmitter = require('events');
const dgram = require('dgram');
const WebSocket = require('ws');

class TComm extends EventEmitter {
	constructor() {
		super();
		this.wsServer = null;
		this.wsPort = 9581;
		this.wsClient = null;
	}

	startWSServer(port = this.wsPort) {
		return new Promise((resolve, reject) => {
            const WebSocket = require('ws');
			let server;

			try {
				server = new WebSocket.Server({port}, () => {
					console.log('[TAUCOMM] WebSocket server started');
				});
			} catch (err) {
				reject(err);
			}

			server.on('listening', () => {
				this.wsServer = server;
				resolve(this);
			});

			server.on('error', (error) => {
				console.error('[TAUCOMM] error', error);
			});

			server.on('connection', (ws) => {
				ws.on('message', (data) => {
					console.log('[TAUCOMM] got message', data);
                    const msg = JSON.parse(data.toString());
                    this.send(msg.event, msg.data)
                        .then(() => {
                            console.log('[TAUCOMM] send ok');
                        })
                        .catch((err) => {
                            console.error('[TAUCOMM] send error', err);
                        });
				});
			});
		});
	}

	start(asClient = false) {
		return new Promise((resolve, reject) => {
			if (asClient) {
                const WebSocket = require('ws');
				let client;
				try {
					client = new WebSocket('ws://localhost:' + this.wsPort);
				} catch (err) {
					reject(error);
				}
				client.on('open', () => {
					resolve(this);
				});
				client.on('error', (error) => {
					console.error('[TAUCOMM] error', error);
				});
				client.on('message', (data) => {
					const msg = JSON.parse(data.toString('utf8'));
					this.emmit(msg.event, msg);
				});
				this.wsClient = client;
			} else {
                this.startWSServer()
                    .then((tcomm) => {
                        resolve(this);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
			}
		});
	}

	send(event, data) {
		const msg = JSON.stringify({event, data});
		return new Promise((resolve, reject) => {
			if (this.wsClient) {
				this.wsClient.send(msg, (err) => {
					if (err) {
						reject(err);
					} else {
						resolve(this);
					}
				});
			} else {
                let callbacks = [];
                this.wsServer.clients.forEach((client) => {
                    callbacks.push(new Promise((resolve, reject) => {
                        client.send(msg, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }));
                });
                Promise.all(callbacks)
                    .then(() => {
                        resolve(this);
                    })
                    .catch((err) => {
                        reject(err);
                    });
			}
		});
	}

}

export default TComm;
