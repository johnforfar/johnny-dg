import OpenxAINetworkDashboard from '../../components/OpenxAINetworkDashboard';

export const metadata = {
  title: 'OpenxAI Decentralized Network',
  description: 'Visualize the OpenxAI decentralized inference network, Mixture of Agents (MoA), and Gossip Marketplace.',
};

export default function OpenxAINetworkPage() {
  // Forced rebuild trigger - v1
  return <OpenxAINetworkDashboard />;
}
