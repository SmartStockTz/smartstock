export interface EventApiAdapter {
  listen(eventName: string, handler: (data: any) => void): void;

  broadcast(eventName: string, data?: any): void;
}
