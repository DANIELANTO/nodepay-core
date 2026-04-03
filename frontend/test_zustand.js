import { createStore } from "zustand/vanilla";
const store = createStore((set) => ({ count: 0 }));
store.setState({ count: 1 });
console.log(store.getState().count);
