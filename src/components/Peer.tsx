"use client";

import { useVideo, HMSPeer } from "@100mslive/react-sdk";

function Peer({ peer }: { peer: HMSPeer }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  return (
    <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${peer.isLocal ? "local" : ""}`}
        autoPlay
        muted
        playsInline
      />
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {peer.isLocal ? "You" : peer.name}
      </div>
    </div>
  );
}

export default Peer;
