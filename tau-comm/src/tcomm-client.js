import * as ee from 'event-emitter';
const EventEmitter = ee.default;

class TComm {
	constructor() {
		EventEmitter(this);
        this.confs = [];
        this.wsClients = [];
        if (typeof window !== 'undefined' && window.TAUCOMM_HOSTS !== undefined) {
            let conf = window.TAUCOMM_HOSTS;
            if (!Array.isArray(conf)) {
                this.confs.push(conf);
            } else {
                this.confs = this.confs.concat(conf);
            }
        }
	}

	start() {
        var runs = [];

        this.confs.forEach((host) => {
            runs.push(new Promise((resolve, reject) => {
                let client = null;
                try {
                    client = new WebSocket('ws://' + host);
                } catch (err) {
                    consol.error(err); // do not fail promsie at this point
                }

                client.onopen = () => {
                    resolve(client);
                };

                client.onmessage = (e) => {
                    const msg = JSON.parse(e.data.toString('utf8'));
                    this.emit(msg.event, msg.data);
                };

                client.onerror = (err) => {
                    console.error(err);
                    if (err.target instanceof WebSocket
                        && err.target.readyState >= 2) {
                        resolve(client); // do not fail promise at this point
                    }
                };
            }));
        });

        return new Promise((resolve, reject) => {
            Promise.all(runs)
                .then((clients) => {
                    this.wsClients = [];
                    clients.forEach((client) => {
                        if (client instanceof WebSocket
                            && client.readyState < 2) {
                            this.wsClients.push(client);
                        }
                    });
                    if (this.wsClients.length > 0) {
                        resolve(this);
                    } else { // no active clients found so rject
                        reject('no active cliens available');
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
	}

	send(event, data) {
        const msg = JSON.stringify({event, data});
        console.log('sending', msg);
        this.wsClients.forEach((client) => {
            client.send(msg);
        });
	}
}

export default TComm;
