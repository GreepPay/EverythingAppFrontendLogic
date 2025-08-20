type Subscriber<T> = (value: T) => void

export class Observable<T> {
  private _value: T
  private subscribers = new Set<Subscriber<T>>()

  constructor(initialValue: T) {
    this._value = initialValue
  }

  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    if (newValue !== this._value) {
      this._value = newValue
      this.notify()
    }
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber)
    subscriber(this._value) // Emit immediately
    return () => this.subscribers.delete(subscriber)
  }

  private notify() {
    for (const sub of this.subscribers) {
      sub(this._value)
    }
  }
}
