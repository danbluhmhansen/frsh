export function initDialog(url: string, openParam: string, clearParams?: string[]): [string, string, boolean] {
  const open = new URL(url);
  const close = new URL(url);
  const isOpen = open.searchParams.has(openParam);
  open.searchParams.set(openParam, "");
  clearParams?.forEach((p) => open.searchParams.delete(p));
  close.searchParams.delete(openParam);
  return [open.pathname + open.search, close.pathname + close.search, isOpen];
}
