import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { MusicService } from "../src/proto/music_pb";

const transport = createGrpcWebTransport({
  baseUrl: "http://localhost:8080",
});

export const musicClient = createClient(MusicService, transport);
