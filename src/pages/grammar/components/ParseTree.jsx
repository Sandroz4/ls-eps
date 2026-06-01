import React from "react";
import { computeTreeLayout } from "../treeLayout";

export default function ParseTree({ tree, targetStr }) {
  if (!tree) return null;

  const { leafCount, depth } = computeTreeLayout(tree);
  const NODE_R = 14;
  const LEVEL_H = 60;
  const MIN_NODE_SPACING = 36;
  const svgWidth = Math.max(400, leafCount * MIN_NODE_SPACING + 60);
  const svgHeight = (depth + 1) * LEVEL_H + 48;

  const shapes = [];
  let key = 0;

  const drawNode = (n, x, y, left, right) => {
    const isTerminal = !n.children || n.children.length === 0;
    const isEpsilon = n.sym === "ε";
    const fill = isTerminal ? "var(--bg3)" : "var(--bg2)";
    const stroke = isEpsilon ? "var(--text-mute)" : isTerminal ? "var(--border2)" : "var(--blue)";
    const textColor = isEpsilon ? "var(--text-mute)" : isTerminal ? "var(--text-dim)" : "var(--cyan)";

    shapes.push(
      <circle key={key++} cx={x} cy={y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={isTerminal ? 1 : 1.5} />
    );
    shapes.push(
      <text key={key++} x={x} y={y + 5} fill={textColor} fontSize="11" textAnchor="middle" fontFamily="Space Mono">
        {n.sym}
      </text>
    );

    if (n.children && n.children.length > 0) {
      const span = right - left;
      const step = span / n.children.length;
      n.children.forEach((child, i) => {
        const cx = left + step * i + step / 2;
        const cy = y + LEVEL_H;
        shapes.push(
          <line key={key++} x1={x} y1={y + NODE_R} x2={cx} y2={cy - NODE_R} stroke="var(--border2)" strokeWidth="1" />
        );
        drawNode(child, cx, cy, left + step * i, left + step * (i + 1));
      });
    }
  };

  drawNode(tree, svgWidth / 2, 28, 0, svgWidth);

  return (
    <div className="panel mb-16">
      <div className="panel-header">
        <span className="panel-dot" />
        <span className="panel-title">პარსინგის ხე — &ldquo;{targetStr}&rdquo;</span>
      </div>
      <div className="panel-body" style={{ overflowX: "auto", overflowY: "auto" }}>
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ minHeight: Math.min(svgHeight, 600), overflow: "visible" }}
        >
          {shapes}
        </svg>
      </div>
    </div>
  );
}