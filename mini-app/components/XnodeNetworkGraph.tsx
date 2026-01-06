import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import SpriteText from 'three-spritetext';

// Dynamically import ForceGraph3D with no SSR
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface NetworkGraphProps {
  height?: number;
  darkMode?: boolean;
  nodeData?: any[];
}

const XnodeNetworkGraph: React.FC<NetworkGraphProps> = ({ 
  height = 600,
  nodeData = []
}) => {
  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Resize handler
  useEffect(() => {
      if (containerRef.current) {
          setWidth(containerRef.current.clientWidth);
          const ro = new ResizeObserver(entries => {
              for (const entry of entries) {
                  setWidth(entry.contentRect.width);
              }
          });
          ro.observe(containerRef.current);
          return () => ro.disconnect();
      }
  }, []);

  // Initialize Camera & Scene
  useEffect(() => {
      // Add stars
      if (graphRef.current) {
          const scene = graphRef.current.scene();
          // Create starfield
          const starsGeometry = new THREE.BufferGeometry();
          const starsCount = 1500;
          const posArray = new Float32Array(starsCount * 3);
          
          for(let i = 0; i < starsCount * 3; i++) {
              posArray[i] = (Math.random() - 0.5) * 2000;
          }
          
          starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
          const starsMaterial = new THREE.PointsMaterial({
              size: 2,
              color: 0xffffff,
              transparent: true,
              opacity: 0.8,
          });
          const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
          scene.add(starsMesh);

          // Initial Camera Position - Zoomed In
          // Use setTimeout to ensure graph is initialized
          setTimeout(() => {
              graphRef.current.cameraPosition(
                  { x: 0, y: 50, z: 250 }, // Position
                  { x: 0, y: 0, z: 0 },    // LookAt
                  2000                     // Transition ms
              );
          }, 500);
      }
  }, []);

  // Generate Network Data
  useEffect(() => {
    let nodes: any[] = [];
    let links: any[] = [];

    if (nodeData && nodeData.length > 0) {
        // Use real data
        nodes = nodeData.map((n, i) => {
            // Calculate load factor for size
            let loadFactor = 1;
            if (n.stats && n.stats.load) {
                loadFactor = Math.max(1, parseFloat(n.stats.load) * 3); 
            }
            if (n.stats && n.stats.cpu) {
                const cpu = parseInt(n.stats.cpu.replace('%', ''));
                if (!isNaN(cpu)) loadFactor += (cpu / 15); 
            }

            return {
                id: n.id || `NODE_${i}`,
                group: n.role || 'inference',
                val: (n.role === 'aggregator' ? 15 : 8) + loadFactor,
                label: n.id,
                stats: n.stats,
                desc: `${n.id}\nRole: ${n.role}\nCPU: ${n.stats?.cpu || '-'}\nMem: ${n.stats?.memory || '-'}\nLoad: ${n.stats?.load || '-'}`
            };
        });

        // Generate mesh links for real nodes
        for (let i = 0; i < nodes.length; i++) {
            // Connect to next node (ring)
            links.push({ source: nodes[i].id, target: nodes[(i + 1) % nodes.length].id, value: 1 });
            
            // Connect to random other node for mesh density
            if (nodes.length > 2) {
                const rand = Math.floor(Math.random() * nodes.length);
                if (rand !== i) {
                    links.push({ source: nodes[i].id, target: nodes[rand].id, value: 1 });
                }
            }
        }
        
        // Ensure aggregator exists
        if (!nodes.find(n => n.group === 'aggregator')) {
             const agg = { id: 'AGGREGATOR', group: 'aggregator', val: 25, label: 'MoA Aggregator', desc: 'Aggregator Node' };
             nodes.push(agg);
             // Connect all to aggregator
             nodes.forEach(n => {
                 if (n.id !== 'AGGREGATOR') links.push({ source: n.id, target: 'AGGREGATOR', value: 2 });
             });
        }

    } else {
        // Default demo data if no real data
        const demoNodes = 12;
        nodes = Array.from({ length: demoNodes }, (_, i) => ({
            id: `NODE_${i}`,
            group: i === 0 ? 'aggregator' : (i % 3 === 0 ? 'oracle' : 'inference'),
            val: i === 0 ? 15 : 8,
            label: i === 0 ? 'Aggregator' : `Node ${i}`
        }));

        links = [];
        for (let i = 0; i < nodes.length; i++) {
            links.push({ source: nodes[i].id, target: nodes[(i + 1) % nodes.length].id, value: 1 });
            if (i !== 0) links.push({ source: nodes[i].id, target: nodes[0].id, value: 2 });
        }
    }

    setGraphData({ nodes, links });
  }, [nodeData]);

  // Color helper
  const getNodeColor = (group: string) => {
      switch(group) {
        case 'oracle': return '#f59e0b'; // Amber
        case 'data': return '#3b82f6'; // Blue
        case 'app': return '#3b82f6'; // Blue
        case 'inference': return '#a855f7'; // Purple (Brighter)
        case 'aggregator': return '#ef4444'; // Red
        default: return '#9ca3af';
      }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black">
      <ForceGraph3D
        ref={graphRef}
        width={width}
        height={height}
        graphData={graphData}
        nodeLabel="desc"
        backgroundColor="#000000"
        showNavInfo={false} // Clean look
        
        // Nodes
        nodeThreeObject={(node: any) => {
            const group = new THREE.Group();
            const color = getNodeColor(node.group);
            
            // 1. Core Sphere (Glowing)
            const geometry = new THREE.SphereGeometry(node.val, 32, 32);
            const material = new THREE.MeshPhysicalMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.8,
                roughness: 0.1,
                metalness: 0.1,
                transparent: true,
                opacity: 0.9,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // 2. Outer Glow/Atmosphere (larger, transparent)
            const glowGeo = new THREE.SphereGeometry(node.val * 1.4, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            group.add(glow);

            // 3. Text Label
            const sprite = new SpriteText(node.label);
            sprite.color = 'rgba(255,255,255,0.9)';
            sprite.textHeight = 4;
            (sprite as any).position.y = node.val + 6;
            group.add(sprite);

            return group;
        }}
        
        // Links
        linkColor={() => 'rgba(100, 100, 255, 0.2)'}
        linkWidth={0.5}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => '#4facfe'} // Cyan/Blue particles
        
        // Interaction
        onNodeClick={(node: any) => {
            const distance = 60;
            const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

            graphRef.current?.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node, 
                2000
            );
        }}
        
        // Physics
        d3VelocityDecay={0.1} // Lower friction for more movement
        warmupTicks={100}
        cooldownTicks={100}
      />
      
      {/* Overlay Controls Hint */}
      <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono bg-black/50 p-2 rounded backdrop-blur-sm pointer-events-none border border-white/10">
          Left-Click: Rotate • Right-Click: Pan • Scroll: Zoom
      </div>
    </div>
  );
};

export default XnodeNetworkGraph;

// @ts-ignore
