"use client";

import { useMiniAppContext } from "@/components/context/miniapp-provider";

export default function FarcasterInfo() {
  const { context } = useMiniAppContext();

  return (
    <main className="flex flex-col gap-3 row-start-2 place-content-center place-items-center justify-center">
      <div className="flex flex-col gap-1 place-items-center">
        {context ? (
          <>
            <span>FID: {context.user.fid}</span>
            {context.user.username && (
              <span>Username: {context.user.username}</span>
            )}
            {context.user.displayName && (
              <span>Display name: {context.user.displayName}</span>
            )}
            {context.user.location && (
              <>
                <span>
                  Location (place id): {context.user.location.placeId}
                </span>
                <span>
                  Location (description): {context.user.location.description}
                </span>
              </>
            )}
            {context.user.pfpUrl && (
              <div className="flex gap-2 place-items-center">
                <span>Profile Picture:</span>
                <img
                  src={context.user.pfpUrl}
                  alt="Profile Picture"
                  width={50}
                  height={50}
                ></img>
              </div>
            )}
          </>
        ) : (
          <span>Farcaster info not detected.</span>
        )}
      </div>
    </main>
  );
}
