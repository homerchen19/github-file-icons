export default class SelectorObserver {
  constructor(rootNode: Node)
  disconnect(): void
  observe: typeof observe
}

export declare function observe<T extends Element>(
  selector: string,
  options: {
    constructor: {new (): T}
  } & Options<T>
): Observer
export declare function observe<T extends Element>(
  options: {
    selector: string
    constructor: {new (): T}
  } & Options<T>
): Observer
export declare function observe(selector: string, initialize: InitializerCallback<Element>): Observer
export declare function observe(selector: string, options: Options<Element>): Observer
export declare function observe(options: {selector: string} & Options<Element>): Observer

type Options<T> = {
  initialize?: InitializerCallback<T>
  add?: AddCallback<T>
  remove?: RemoveCallback<T>
  subscribe?: SubscribeCallback<T>
}

type InitializerCallback<T> = (el: T) => void | InitializerCallbacks<T>
type AddCallback<T> = (el: T) => void
type RemoveCallback<T> = (el: T) => void
type SubscribeCallback<T> = (el: T) => Subscription

type InitializerCallbacks<T> = {
  add?: AddCallback<T>
  remove?: RemoveCallback<T>
}

type Observer = {
  abort(): void
}

interface Subscription {
  unsubscribe(): void
}
