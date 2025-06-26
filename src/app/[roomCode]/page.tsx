"use client";

import Peer from "@/components/Peer";
import {
  HMSConfig,
  HMSRoomState,
  selectLocalPeer,
  selectPeerAudioByID,
  selectPeers,
  selectRecordingState,
  selectRoomState,
  selectRTMPState,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function RoomPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;

  const hmsActions = useHMSActions();
  const peers = useHMSStore(selectPeers);

  const roomState = useHMSStore(selectRoomState);

  useEffect(() => {
    console.log("roomState: ", roomState);
  }, [roomState]);

  const [authToken, setAuthToken] = useState<string | null>();

  const config = useMemo<HMSConfig | null>(
    () =>
      authToken
        ? {
            userName: "candidate",
            authToken,
          }
        : null,
    [authToken]
  );

  useEffect(() => {
    if (authToken === undefined) {
      setAuthToken(null);
      console.log("Fetching auth token for room code:", roomCode);
      hmsActions.getAuthTokenByRoomCode({ roomCode }).then(setAuthToken);
    }
  }, [authToken, hmsActions, roomCode]);

  const hasCalledPreview = useRef(false);

  useEffect(() => {
    if (!hasCalledPreview.current && config) {
      hasCalledPreview.current = true;

      console.log("Previewing room...:");

      hmsActions
        .preview(config)
        .then(() => console.log("Preview succcess"))
        .catch((error) => console.log("Preview failed:", error));
    }
  }, [config, hmsActions]);

  const joinRoom = useCallback(async () => {
    if (!config) return;

    try {
      await hmsActions.join(config);
    } catch (e) {
      console.error(e);
    }
  }, [config, hmsActions]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      hmsActions.leave();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      hmsActions.leave(); // Also cleanup on component unmount
    };
  }, [hmsActions]);

  /** get localpeer from store */
  const localpeer = useHMSStore(selectLocalPeer);
  /** get a given peer's audio level. */
  const peerAudioLevel = useHMSStore(selectPeerAudioByID(localpeer?.id));

  const recordingState = useHMSStore(selectRecordingState);
  const rtmpState = useHMSStore(selectRTMPState);

  useEffect(() => {
    console.log("RTMP state:", rtmpState);
  }, [rtmpState]);

  const isRecording = recordingState.server.running;
  const recordingStartedAt = recordingState.server.startedAt;

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isRecording && recordingStartedAt) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - recordingStartedAt.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRecording, recordingStartedAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-row gap-4 p-4 bg-black relative">
      {isRecording && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
            <span className="font-mono font-semibold text-sm">
              REC {formatTime(elapsedTime)}
            </span>
          </div>
        </div>
      )}

      {peers.map((peer) => (
        <Peer key={peer.id} peer={peer} />
      ))}

      {peers.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Joining Meeting</h2>
          <p className="text-gray-300">Connecting to room: {roomCode}</p>
        </div>
      )}

      {localpeer && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
          <div className="bg-white text-black p-3 rounded-full flex items-center">
            <div className="relative w-5 h-5">
              <MicrophoneIcon className="w-5 h-5 text-blue-100" />
              <div
                className="absolute inset-0 transition-all duration-200"
                style={{
                  clipPath:
                    "polygon(0 100%, 100% 100%, 100% " +
                    (100 - Math.min(peerAudioLevel || 0, 100)) +
                    "%, 0 " +
                    (100 - Math.min(peerAudioLevel || 0, 100)) +
                    "%)",
                }}
              >
                <MicrophoneIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {roomState === HMSRoomState.Connected ? (
            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-200">
                Finish meeting
              </button>
            </Link>
          ) : (
            <button
              onClick={joinRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-200"
              disabled={roomState === HMSRoomState.Connecting}
            >
              Start meeting
            </button>
          )}
        </div>
      )}
    </div>
  );
}
