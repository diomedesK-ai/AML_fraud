"use client";
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  riskScore: number;
  status: 'active' | 'flagged' | 'suspended' | 'investigating';
  group: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface AccountNetworkGraphProps {
  accounts: any[];
  selectedAccountId?: string;
  onAccountSelect?: (accountId: string) => void;
  width?: number;
  height?: number;
}

export default function AccountNetworkGraph({ 
  accounts, 
  selectedAccountId, 
  onAccountSelect,
  width = 800,
  height = 600 
}: AccountNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!accounts.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data
    const nodes: Node[] = accounts.map((account, index) => ({
      id: account.id,
      name: account.customerName,
      riskScore: account.riskScore,
      status: account.status,
      group: Math.floor(account.riskScore / 25) // Group by risk level
    }));

    const links: Link[] = [];
    accounts.forEach(account => {
      account.connections.forEach((connectionId: string) => {
        if (accounts.find(a => a.id === connectionId)) {
          links.push({
            source: account.id,
            target: connectionId,
            value: Math.random() * 10 + 1 // Random connection strength
          });
        }
      });
    });

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create color scale based on risk score
    const colorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRdYlGn)
      .clamp(true);

    // Create simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value));

    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: any) => Math.max(8, d.riskScore / 5))
      .attr("fill", (d: any) => {
        if (d.status === 'flagged') return '#ef4444';
        if (d.status === 'investigating') return '#f59e0b';
        if (d.status === 'suspended') return '#6b7280';
        return '#10b981';
      })
      .attr("stroke", (d: any) => d.id === selectedAccountId ? "#1f2937" : "#fff")
      .attr("stroke-width", (d: any) => d.id === selectedAccountId ? 3 : 2)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        if (onAccountSelect) {
          onAccountSelect(d.id);
        }
      })
      .on("mouseover", function(event, d: any) {
        // Highlight connected nodes
        const connectedNodes = new Set();
        links.forEach(link => {
          if (link.source === d.id || (link.source as any).id === d.id) {
            connectedNodes.add((link.target as any).id || link.target);
          }
          if (link.target === d.id || (link.target as any).id === d.id) {
            connectedNodes.add((link.source as any).id || link.source);
          }
        });

        node.select("circle")
          .style("opacity", (n: any) => 
            n.id === d.id || connectedNodes.has(n.id) ? 1 : 0.3
          );

        link.style("opacity", (l: any) => 
          (l.source.id || l.source) === d.id || (l.target.id || l.target) === d.id ? 1 : 0.1
        );

        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000")
          .html(`
            <strong>${d.name}</strong><br/>
            Risk Score: ${d.riskScore}<br/>
            Status: ${d.status}
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        node.select("circle").style("opacity", 1);
        link.style("opacity", 0.6);
        d3.selectAll(".tooltip").remove();
      });

    // Add labels to nodes
    node.append("text")
      .text((d: any) => d.name.split(' ')[0]) // First name only
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#374151")
      .style("pointer-events", "none");

    // Add risk score labels
    node.append("text")
      .text((d: any) => d.riskScore)
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "8px")
      .style("fill", "#6b7280")
      .style("font-weight", "bold")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup function
    return () => {
      simulation.stop();
    };

  }, [accounts, selectedAccountId, onAccountSelect, width, height]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
      <svg ref={svgRef} className="max-w-full max-h-full">
        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect width="150" height="80" fill="white" stroke="#d1d5db" rx="4" />
          <text x="8" y="15" fontSize="12" fontWeight="bold" fill="#374151">Risk Levels</text>
          <circle cx="15" cy="30" r="6" fill="#10b981" />
          <text x="25" y="34" fontSize="10" fill="#374151">Low (0-40)</text>
          <circle cx="15" cy="45" r="6" fill="#f59e0b" />
          <text x="25" y="49" fontSize="10" fill="#374151">Medium (41-70)</text>
          <circle cx="15" cy="60" r="6" fill="#ef4444" />
          <text x="25" y="64" fontSize="10" fill="#374151">High (71-100)</text>
        </g>
      </svg>
    </div>
  );
}

