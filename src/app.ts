console.log("app.ts: loaded");
export class App {
  constructor() {
    console.log("App initialized");
  }
}

export function sum(a: number, b: number): number {
  return a + b;
}
