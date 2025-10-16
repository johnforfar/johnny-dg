{ pkgs, lib }:
pkgs.buildNpmPackage {
  pname = "johnny-dg";
  version = "1.0.0";
  src = ../mini-app;

  npmDeps = pkgs.importNpmLock {
    npmRoot = ../mini-app;
  };
  npmConfigHook = pkgs.importNpmLock.npmConfigHook;

  # Ensure all dependencies are available
  buildInputs = with pkgs; [
    nodejs_20
    npm
  ];

  # Build configuration
  npmBuild = "npm run build";
  
  postBuild = ''
    # Ensure standalone output is properly configured
    if [ ! -f .next/standalone/server.js ]; then
      echo "Standalone build not found, creating fallback"
      mkdir -p .next/standalone
      cp -r .next/server.js .next/standalone/server.js || true
    fi
    
    # Add shebang and make executable
    sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
    patchShebangs .next/standalone/server.js
    chmod +x .next/standalone/server.js
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out/{share,bin}
    
    # Copy standalone build
    cp -r .next/standalone $out/share/johnny-dg/
    
    # Copy public assets
    cp -r public $out/share/johnny-dg/public || true
    
    # Copy static assets
    mkdir -p $out/share/johnny-dg/.next
    cp -r .next/static $out/share/johnny-dg/.next/static || true
    
    # Create cache directory symlink
    ln -s /var/cache/johnny-dg $out/share/johnny-dg/.next/cache
    
    # Make server executable
    chmod +x $out/share/johnny-dg/server.js
    
    # Create wrapper script
    makeWrapper $out/share/johnny-dg/server.js $out/bin/johnny-dg \
      --set-default PORT 3006 \
      --set-default HOSTNAME 0.0.0.0 \
      --set-default NODE_ENV production
    
    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "johnny-dg";
    description = "Johnny DG unified mini-app with AI editing";
    license = lib.licenses.mit;
  };
}
