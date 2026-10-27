/** Marks a function you still need to write. Delete the call (and this import) when you implement it. */
export function todo(name: string, ...args: unknown[]): never {
  void args // keeps the stub's parameters "used" so TypeScript doesn't complain
  throw new Error(`TODO: implement ${name}()`)
}
