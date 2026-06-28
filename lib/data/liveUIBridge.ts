type Listener = (data: any) => void;

class LiveUIBridge {

  private listeners: Listener[] = [];

  emit(data: any) {
    this.listeners.forEach(fn => fn(data));
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
  }

}

export const liveUIBridge = new LiveUIBridge();
