{
  inputs = {
    xnode-manager.url = "github:Openmesh-Network/xnode-manager";
    xnode-miniapp-template.url = "github:OpenxAI-Network/xnode-miniapp-template";
    nixpkgs.follows = "xnode-miniapp-template/nixpkgs";
  };

  outputs = inputs: {
    nixosConfigurations.container = inputs.nixpkgs.lib.nixosSystem {
      specialArgs = { inherit inputs; };
      modules = [
        inputs.xnode-manager.nixosModules.container
        {
          services.xnode-container.xnode-config = {
            host-platform = ./xnode-config/host-platform;
            state-version = ./xnode-config/state-version;
            hostname = ./xnode-config/hostname;
          };
        }
        {
          # Build the mini-app using our template-aligned package
          environment.systemPackages = [ inputs.nixpkgs.age ];

          systemd.services.johnny-dg = {
            wantedBy = [ "multi-user.target" ];
            after = [ "network.target" ];
            serviceConfig = {
              ExecStart = "${inputs.nixpkgs.callPackage ./nix/package.nix { }}/bin/johnny-dg";
              Restart = "always";
              RestartSec = 5;
            };
            environment = {
              # Inject these via Xnode UI; do NOT commit real values
              # AGE_PRIVATE_KEY = "...";
              # OLLAMA_API_URL = "http://localhost:11434";
              # OLLAMA_MODEL = "llama3.2:3b";
            };
          };

          networking.firewall.allowedTCPPorts = [ 3006 ];
        }
      ];
    };
  };
}
