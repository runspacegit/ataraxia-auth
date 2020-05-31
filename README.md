# @runspace/ataraxia-auth

[Ataraxia](https://github.com/aholstenson/ataraxia) JWT Auth implementation.

## Example
```typescript
import { Network } from 'ataraxia';
import { TCPTransport, TCPPeerMDNSDiscovery } from 'ataraxia-tcp';
import { RunSpaceAuth } from '@runspace/ataraxia-auth';

const net = new Network({
    name: 'name-of-your-app-or-network',
    authentication: [
        new RunSpaceAuth("your-secret")
    ]
});

net.addTransport(new TCPTransport({
    discovery: new TCPPeerMDNSDiscovery()
}));

net.onNodeAvailable(node => {
    console.log('A new node is available:', node.id);
    node.send('hey', 'there');
});

net.onMessage(msg => {
    console.log(msg);
});

net.start()
    .then(console.log)
    .catch(console.error);
```

see in `src/example/index.ts`
