import Service from './service';
export default class ServiceMap {
    private remotes;
    count: number;
    end(): void;
    insert(remoteId: number, socket: Service): Service;
    get(remoteId: number): Service | null;
    remove(remoteId: number): Service | null;
}
//# sourceMappingURL=servicemap.d.ts.map