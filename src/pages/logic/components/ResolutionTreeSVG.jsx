import React from "react";

export default function ResolutionTreeSVG({ root }) {
  if (!root) return null;
  const LEVEL_H = 70, NODE_W = 110, NODE_H = 36, PAD = 16;
  const getWidth = (n) => !n.children?.length ? 1 : n.children.reduce((s, c) => s + getWidth(c), 0);
  const getDepth = (n) => (!n.children?.length ? 0 : 1 + Math.max(...n.children.map(getDepth)));
  const leavesW = getWidth(root);
  const depth = getDepth(root);
  const svgW = Math.max(500, leavesW * (NODE_W + PAD) + PAD * 2);
  const svgH = (depth + 1) * LEVEL_H + NODE_H + 24;

  const shapes = [];
  let k = 0;
  const drawNode = (node, x, y, left, right) => {
    const isEmpty = node.clause === "⊥";
    const isInput = node.origin === "input";
    const fill = isEmpty ? "#4ecb7122" : isInput ? "var(--bg3)" : "#1a4a99";
    const stroke = isEmpty ? "#4ecb71" : isInput ? "var(--border2)" : "var(--blue)";
    const textCol = isEmpty ? "#4ecb71" : isInput ? "var(--text-dim)" : "var(--cyan)";
    
    shapes.push(
      <rect key={k++} x={x - NODE_W / 2} y={y} width={NODE_W} height={NODE_H} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />,
      <text key={k++} x={x - NODE_W / 2 + 6} y={y + 11} fill="var(--text-mute)" fontSize={9} fontFamily="Space Mono">{node.label}</text>,
      <text key={k++} x={x} y={y + 25} fill={textCol} fontSize={11} fontFamily="Space Mono" textAnchor="middle">
        {node.clause.length > 14 ? node.clause.slice(0, 13) + "…" : node.clause}
      </text>
    );
    if (node.children?.length) {
      const span = right - left, step = span / node.children.length;
      node.children.forEach((child, i) => {
        const cx = left + step * i + step / 2, cy = y + LEVEL_H;
        const pivotPart = (i === 0 ? node.pivot?.split("/")[0] : node.pivot?.split("/")[1]) || "";
        shapes.push(
          <line key={k++} x1={x} y1={y + NODE_H} x2={cx} y2={cy} stroke="var(--border2)" strokeWidth={1} />,
          <text key={k++} x={(x + cx) / 2} y={(y + NODE_H + cy) / 2} fill="var(--accent)" fontSize={9} fontFamily="Space Mono" textAnchor="middle">{pivotPart}</text>
        );
        drawNode(child, cx, cy, left + step * i, left + step * (i + 1));
      });
    }
  };
  drawNode(root, svgW / 2, 16, 0, svgW);
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ minHeight: svgH, width: "100%", minWidth: 400 }}>
        {shapes}
      </svg>
    </div>
  );
}