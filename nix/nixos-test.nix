{ pkgs, system, ... }:
let
  testing = import "${toString pkgs.path}/nixos/lib/testing-python.nix" { inherit system pkgs; };
in
testing.makeTest {
  name = "johnny-dg";

  nodes.machine =
    { pkgs, ... }:
    {
      imports = [ ./nixos-module.nix ];
      services.xnode-miniapp-template = {
        enable = true;
        port = 3006;
      };
    };

  testScript = ''
    # Ensure the service is started and reachable
    machine.wait_for_unit("xnode-miniapp-template.service")
    machine.wait_for_open_port(3006)
    machine.succeed("curl --fail http://127.0.0.1:3006")
  '';
}
