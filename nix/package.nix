{ pkgs, lib }:
pkgs.buildNpmPackage {
  pname = "johnny-dg";
  version = "1.0.0";
  src = ../mini-app;

  npmDeps = pkgs.importNpmLock {
    npmRoot = ../mini-app;
  };
  npmConfigHook = pkgs.importNpmLock.npmConfigHook;

  postBuild = ''
    # Add a shebang to the server js file, then patch the shebang to use a
    # nixpkgs nodes binary
    sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
    patchShebangs .next/standalone/server.js
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{share,bin}

    cp -r .next/standalone $out/share/homepage/
    # cp -r .env $out/share/homepage/
    if [ -d public ]; then
      cp -r public $out/share/homepage/public
    else
      mkdir -p $out/share/homepage/public
    fi

    # Copy metadata and data directories for the blog
    if [ -d metadata ]; then
      cp -r metadata $out/share/homepage/metadata
    fi
    if [ -d data ]; then
      cp -r data $out/share/homepage/data
    fi

    mkdir -p $out/share/homepage/.next
    cp -r .next/static $out/share/homepage/.next/static

    # https://github.com/vercel/next.js/discussions/58864
    ln -s /var/cache/mini-app $out/share/homepage/.next/cache

    chmod +x $out/share/homepage/server.js

    # we set a default port to support "nix run ..."
    makeWrapper $out/share/homepage/server.js $out/bin/johnny-dg \
      --set-default PORT 3006 \
      --set-default HOSTNAME 0.0.0.0

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "johnny-dg";
  };
}
