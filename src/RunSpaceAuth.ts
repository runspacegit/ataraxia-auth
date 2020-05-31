import { AuthProvider, AuthClientFlow, AuthServerFlow, AuthServerReplyType, AuthServerReply } from "ataraxia";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { toArrayBuffer, toBuffer } from "./utils";

/**
 * @namespace runspace
 * @name RunSpaceAuth
 * @description Ataraxia Network AuthProvider.
 * @author Mikhail Marynenko
 * @author Andreas Holstenson
 */
export class RunSpaceAuth implements AuthProvider {
    public readonly id = 'runspace';
    public key: string;
    constructor(key: string) {
        this.key = key;
    }

    public createClientFlow(): AuthClientFlow {
        const key = this.key;

        return {
            async initialMessage(): Promise<ArrayBuffer> {
                const randomData = crypto.randomBytes(16);
                const signed = jwt.sign(randomData.toString('ascii'), key);
                return toArrayBuffer(Buffer.from(JSON.stringify({ signed, randomData: randomData.toString('ascii') }), 'ascii'))
            },

            receiveData() {
                return Promise.reject();
            },

            destroy() {
                return Promise.resolve();
            }
        };
    }

    public createServerFlow(): AuthServerFlow {
        const key = this.key;

        return {
            async receiveInitial(data: ArrayBuffer): Promise<AuthServerReply> {
                if (data.byteLength === 0) {
                    return {
                        type: AuthServerReplyType.Reject
                    };
                }

                const { signed, randomData }: { signed: string, randomData: string } = JSON.parse(toBuffer(data).toString('ascii'));

                try {
                    if (jwt.verify(signed, key) == randomData) {
                        return {
                            type: AuthServerReplyType.Ok
                        };
                    } else {
                        return {
                            type: AuthServerReplyType.Reject
                        };
                    }
                } catch (error) {
                    return {
                        type: AuthServerReplyType.Reject
                    };
                }
            },

            receiveData() {
                return Promise.reject();
            },

            destroy() {
                return Promise.resolve();
            }
        };
    }
}

export default RunSpaceAuth;
