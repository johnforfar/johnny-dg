{
  inputs = {
    xnode-manager.url = "github:Openmesh-Network/xnode-manager";
    johnny-dg.url = "github:johnforfar/johnny-dg?ref=main"; # "path:..";
    nixpkgs.follows = "johnny-dg/nixpkgs";
  };

  outputs = inputs: {
    nixosConfigurations.container = inputs.nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit inputs;
      };
      modules = [
        inputs.xnode-manager.nixosModules.container
        {
          services.xnode-container.xnode-config = {
            host-platform = ./xnode-config/host-platform;
            state-version = ./xnode-config/state-version;
            hostname = ./xnode-config/hostname;
          };
        }
        inputs.johnny-dg.nixosModules.default
        {
          services.xnode-miniapp-template.enable = true;
          services.xnode-miniapp-template.url = "http://localhost:3006";
          services.xnode-miniapp-template.port = 3006;
          
          # Ollama service for AI features
          services.ollama = {
            enable = true;
            port = 11434;
          };
          
          # Override the systemd service to add our environment variables
          systemd.services.xnode-miniapp-template.environment = {
            NODE_ENV = "production";
            OLLAMA_API_URL = "http://localhost:11434";
            OLLAMA_MODEL = "llama3.2:3b";
            # AGE_PRIVATE_KEY = "..."; # Inject via Xnode UI
          };
          
          # Firewall configuration
          networking.firewall.allowedTCPPorts = [ 3006 11434 ];
        }
      ];
    };
  };
}
