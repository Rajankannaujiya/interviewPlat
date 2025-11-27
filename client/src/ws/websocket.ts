export class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;

  private constructor() {}

  public static getInstanceWs(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public async connectWs(url: string, userId: string): Promise<void> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(url);

    return new Promise((resolve, reject) => {
      this.socket!.onopen = () => {
        console.log("✅ Connected to WebSocket server");
        this.socket!.send(
          JSON.stringify({ type: "initWs", payload: { userId } })
        );
        resolve();
      };

      this.socket!.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        reject(err);
      };

      this.socket!.onclose = () =>
        console.log("🔌 WebSocket connection closed");
    });
  }

  public send(data: any): void {
    try {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(
          typeof data === "string" ? data : JSON.stringify(data)
        );
      } else {
        console.warn("⚠️ WebSocket not open. Message not sent:", data);
      }
    } catch (error) {
      console.error("An error occurred while sending data:", error);
    }
  }

  public onMessage(handler: (data: any) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handler(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };
    }
  }

  clearOnMessage(userId: string) {
    if (this.socket) {
      this.handleClose(userId);
      this.socket.onmessage = null;
    }
  }

  public handleClose(userId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ type: "exit_chat", payload: { userId } })
      );
      this.socket.close();
    } else {
      console.log("Unable to close");
    }
  }
}

export const WsInstance = WebSocketManager.getInstanceWs();
