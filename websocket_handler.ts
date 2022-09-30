import { IncomingMessage, Server } from "http";
import * as WebSocket from "ws";
import { PacketHandler } from "../utils/packetHandler";

export interface ClientCollection {
  remoteAddress: string;
  lastAliveTime: number;
  isConnected: boolean;
  remotePort: number;
  pid: string;
  packetHandler: PacketHandler;
}

export type WsClientEdited = WebSocket.WebSocket & {
  upgradeReq: IncomingMessage;
  _socket: ClientCollection & { destroy: null | object };
} & ClientCollection;

class WebsocketHandler {
  public wss: WebSocket.Server | null;
  public clients: (WebSocket.WebSocket & ClientCollection)[];
  constructor() {
    this.wss = null;
    this.clients = [];
  }

  public init(server: Server): void {
    this.wss = new WebSocket.Server({ server, path: "/gateaway" });

    this.wss.on("error", this.onServerSocketError.bind(this));
    this.wss.on("connection", this.onClientSocketOpen.bind(this));
  }
  private onClientSocketOpen(ws: WsClientEdited, _req?: IncomingMessage): void {
    let req = _req ?? ws.upgradeReq;
    let clientBind: string = process.env.CLIENT_URI ?? "";
    let max_connections: number = parseInt(
      process.env.MAX_WEBSOCKET_CONNECTIONS ?? "-1",
    );
    let serverIpLimit: number = parseInt(process.env.SERVER_IP_LIMIT ?? "1");

    if (
      // Limit of global connections
      max_connections === 0x0 ||
      (max_connections !== -1 && this.clients.length >= max_connections)
    ) {
      ws.close(1000, "No slots");
      return;
    }

    if (serverIpLimit) {
      // Limit connection for each user
      let ipConnections = 0;
      for (let i = 0; i < this.clients.length; i++) {
        let socket: ClientCollection = this.clients[i];

        if (
          !socket.isConnected ||
          socket.remoteAddress != ws._socket.remoteAddress
        )
          continue;
        ipConnections++;
      }

      if (ipConnections >= serverIpLimit) {
        ws.close(1000, "IP limit reached");
        return;
      }
    }

    if (
      // Let only trusted clients to access
      clientBind.length &&
      req.headers.origin &&
      req.headers.origin.indexOf(clientBind) < 0x0
    ) {
      ws.close(1000, "Client not allowed");
      return;
    }

    ws.isConnected = true;
    ws.remoteAddress = ws._socket.remoteAddress;
    ws.remotePort = ws._socket.remotePort;
    ws.lastAliveTime = Date.now();

    ws.packetHandler = new PacketHandler(ws);

    console.log(
      "CONNECTED " +
        ws.remoteAddress +
        ":" +
        ws.remotePort +
        ', origin: "' +
        req.headers.origin +
        '"',
    );

    ws.on("message", (message: Uint8Array) => {
      if (!message.length) return;

      if (message.length > 256) {
        ws.close(1009, "Spam");
        return;
      }

      ws.packetHandler.handleMessage(message);
    });

    ws.on("error", () => {
      ws.packetHandler.sendPacket = () => {};
    });

    ws.on("close", () => {
      if (
        ws._socket &&
        ws._socket.destroy !== null &&
        typeof ws._socket.destroy == "function"
      ) {
        ws._socket.destroy();
      }
      ws.isConnected = false;
      ws.packetHandler.sendPacket = () => {};
    });

    this.clients.push(ws);
  }
  private onServerSocketError(error: Error & { code?: string }): void {
    console.error(
      `[Websocket_Server]: ${error.code ?? "N/A"} , MSG: ${error.message}`,
    );
  }
}

export const websockethandler = new WebsocketHandler();
