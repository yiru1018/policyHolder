import React, { useState, useRef, useEffect } from "react";
import Tree from "react-d3-tree";

const nodeStyle = {
  main: { fill: "#FDE9A9" },
  direct: { fill: "#B9E5C3" },
  indirect: { fill: "#E5E5E5" },
};

function TreeDiagram(props) {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { offsetWidth, offsetHeight } = treeContainer.current;
    setDimensions({ width: offsetWidth, height: offsetHeight });
  }, []);

  const renderCustomNode = ({ nodeDatum }) => {
    const nodeCode = nodeDatum.attributes.code;
    const nodeType = nodeDatum.attributes.type;
    const isMainNode = nodeType === "main";
    const hasParentStack =
      isMainNode && nodeDatum.attributes.introducerCode !== null;
    return (
      <g>
        <rect
          width="120"
          height={hasParentStack ? "75" : "60"}
          x="-60"
          y="-30"
          rx="10"
          style={nodeStyle[nodeType] || { fill: "#ccc" }}
        />
        <text
          fill="black"
          x="0"
          y="-10"
          textAnchor="middle"
          textDecoration={isMainNode ? "none" : "underline"}
          cursor={isMainNode ? "none" : "pointer"}
          onClick={() => !isMainNode && props.onNodeCodeClick(nodeCode)}
        >
          {nodeCode}
        </text>
        <text fill="black" x="0" y="10" textAnchor="middle">
          {nodeDatum.name}
        </text>
        {hasParentStack && (
          <text
            fill="black"
            x="0"
            y="30"
            textAnchor="middle"
            textDecoration="underline"
            onClick={() => props.onTrackParentStack(nodeCode)}
          >
            上一層
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={treeContainer}>
      <Tree
        data={props.treeData}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 100 }}
        renderCustomNodeElement={renderCustomNode}
        pathFunc="elbow"
        collapsible
      />
    </div>
  );
}

export default TreeDiagram;
