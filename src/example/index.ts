import { Network } from 'ataraxia';
import { TCPTransport, TCPPeerMDNSDiscovery } from 'ataraxia-tcp';
import { RunSpaceAuth } from '..';

const net = new Network({
    name: 'name-of-your-app-or-network',
    authentication: [
        new RunSpaceAuth("shhh")
    ]
});

// Setup a TCP transport that will discover other peers on the same network using mDNS
net.addTransport(new TCPTransport({
    discovery: new TCPPeerMDNSDiscovery()
}));

net.onNodeAvailable(node => {
    console.log('A new node is available:', node.id);
    node.send('hey', 'there');
});

net.onMessage(msg => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    console.log(msg);
});

net.start()
    .then(console.log)
    .catch(console.error);