import ExtendedPublicKey from './ExtendedPublicKey';
import Bluebird from 'bluebird';
export default interface SocketOptions {
    auth?: (key: ExtendedPublicKey) => Bluebird<void | boolean>;
}
//# sourceMappingURL=SocketOptions.d.ts.map