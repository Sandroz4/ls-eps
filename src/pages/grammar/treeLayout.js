export const computeTreeLayout = (node) => {
  const getWidth = (n) => {
    if (!n || !n.children || n.children.length === 0) return 1;
    return n.children.reduce((s, c) => s + getWidth(c), 0);
  };
  const getDepth = (n) => {
    if (!n || !n.children || n.children.length === 0) return 0;
    return 1 + Math.max(...n.children.map(getDepth));
  };
  const w = getWidth(node);
  const d = getDepth(node);
  return { leafCount: w, depth: d };
};