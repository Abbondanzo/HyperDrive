export const assignToWindow = (object: { [key: string]: any }) => {
  const w = window as any;
  Object.assign(w, object);
};
