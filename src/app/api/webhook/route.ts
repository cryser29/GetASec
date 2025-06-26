import { Event } from "@/types/webhook";
import { GetStreamKeysResponse, StreamKey } from "@/types/hms";
import * as HMS from "@100mslive/server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

function streamVideo(videoUrl: string, rtmpUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-re",
      "-i",
      videoUrl,
      "-c",
      "copy",
      "-f",
      "flv",
      rtmpUrl,
    ]);

    ffmpeg.stdout.on("data", (data) => {
      console.log(`ffmpeg stdout: ${data}`);
    });

    ffmpeg.stderr.on("data", (data) => {
      console.log(`ffmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("FFmpeg process completed successfully");
        resolve();
      } else {
        console.error(`FFmpeg process exited with code ${code}`);
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (error) => {
      console.error("FFmpeg process error:", error);
      reject(error);
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the X-100ms-Key header
    const providedKey = request.headers.get("X-100ms-Key");
    const expectedKey = process.env.HMS_WEBHOOK_SECRET;

    // Validate the key
    const isValidKey =
      providedKey && expectedKey && providedKey === expectedKey;

    // Parse the event JSON
    const event: Event = await request.json();

    // Log the event and validation status

    // console.log("Webhook received:", {
    //   isValidKey,
    //   event,
    //   timestamp: new Date().toISOString(),
    // });

    if (!isValidKey) {
      console.warn("Invalid or missing X-100ms-Key header");
    } else {
      if (
        event.type === "peer.join.success" &&
        event.data.role === "viewer-near-realtime"
      ) {
        const hms = new HMS.SDK();

        const streamKeyPath = `stream-keys/room/${event.data.room_id}`;

        const getStreamKey: GetStreamKeysResponse = await hms.api.get(
          streamKeyPath
        );

        const streamKey: StreamKey =
          getStreamKey.data[0] ?? (await hms.api.post(streamKeyPath));

        const videoUrl =
          "https://www.sample-videos.com/video321/mp4/480/big_buck_bunny_480p_5mb.mp4";

        console.log("Stream key:", streamKey);

        const rtmpUrl = `${streamKey.url}/${streamKey.key}`;
        console.log("Starting video stream to:", rtmpUrl);

        try {
          await streamVideo(videoUrl, rtmpUrl);
          console.log("Video streaming completed");
        } catch (streamError) {
          console.error("Video streaming failed:", streamError);
        }
      }
    }

    // Always respond with 200 as requested
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 even on error
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
