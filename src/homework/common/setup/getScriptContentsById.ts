export const getScriptContentsById = (id: string): string => {
  const element = document.getElementById(id) as HTMLScriptElement;
  return element.text;
};
