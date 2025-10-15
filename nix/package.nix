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
    sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
    patchShebangs .next/standalone/server.js
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p $out/{share,bin}
    cp -r .next/standalone $out/share/homepage/
    cp -r public $out/share/homepage/public || true
    mkdir -p $out/share/homepage/.next
    cp -r .next/static $out/share/homepage/.next/static
    ln -s /var/cache/johnny-dg $out/share/homepage/.next/cache
    chmod +x $out/share/homepage/server.js
    makeWrapper $out/share/homepage/server.js $out/bin/johnny-dg \
      --set-default PORT 3006 \
      --set-default HOSTNAME 0.0.0.0
    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "johnny-dg";
    description = "Johnny DG unified mini-app";
  };
}
