export const addToWindow = (name: string, item: any) => {
  const w = window as any;
  w[name] = item;
};
