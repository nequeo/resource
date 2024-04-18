
/**
 * WebSocketClientBase interface used to signal other contacted
 * clients, this signalling interface uses WebSockets
 * for the signalling transport.
 */
export interface IWebSocketClientBase {

    /**
     * Subscribe to the on open event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onOpen(event: (message: string, signal: WebSocketClientBase, details: any) => void): void;

    /**
     * Subscribe to the on error event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onError(event: (message: string, signal: WebSocketClientBase, details: any) => void): void;

    /**
     * Subscribe to the on close event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onClose(event: (message: string, signal: WebSocketClientBase, details: any) => void): void;

    /**
     * Subscribe to the on error details event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onErrorDetails(event: (message: string, signal: WebSocketClientBase, details: any) => void): void;

    /**
     * Subscribe to the on message event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onMessage(event: (message: string, signal: WebSocketClientBase, details: any) => void): void;

    /**
     * Send data.
     * 
     * @param {object}  data                 The data to send.
     */
    sendData(data: any): void;

    /**
     * Open the current signalling connection.
    */
    open(): void;

    /**
     * Close the current signalling connection.
    */
    close(): void;
}

/**
 * WebSocketClientBase class used to signal other contacted
 * clients, this signalling class uses WebSockets
 * for the signalling transport.
 */
export class WebSocketClientBase implements IWebSocketClientBase {

    // Global.
    webSocket: WebSocket;
    closed: boolean;
    config: any;

    private signallingEventOpen: (message: string, signal: WebSocketClientBase, details: any) => void;
    private signallingEventError: (message: string, signal: WebSocketClientBase, details: any) => void;
    private signallingEventClose: (message: string, signal: WebSocketClientBase, details: any) => void;
    private signallingEventErrorDetails: (message: string, signal: WebSocketClientBase, details: any) => void;
    private signallingEventMessage: (message: string, signal: WebSocketClientBase, details: any) => void;

    /**
     * WebSocketClientBase prototype.
     * 
     * @param {Object}   signalOptions  A collection of options.
     *        
     * @example                          
     *  options = { 
     *      signallingURL: "wss://127.0.0.1:443"
     *  }
     */
    constructor(public signalOptions) {

        // local.
        let self = this;
        let item;

        // Set options.
        let options = signalOptions || {};

        // Configuration.
        let config = this.config = {
            signallingURL: "wss://127.0.0.1:443"
        };

        // Set options, override existing.
        for (item in options) {
            if (options.hasOwnProperty(item)) {
                config[item] = options[item];
            }
        }

        this.closed = true;
        this.webSocket = null;
    }

    /**
     * Subscribe to the on open event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onOpen(event: (message: string, signal: WebSocketClientBase, details: any) => void): void {
        // assign the event.
        this.signallingEventOpen = event;
    }

    /**
     * Subscribe to the on error event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onError(event: (message: string, signal: WebSocketClientBase, details: any) => void): void {
        // assign the event.
        this.signallingEventError = event;
    }

    /**
     * Subscribe to the on close event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onClose(event: (message: string, signal: WebSocketClientBase, details: any) => void): void {
        // assign the event.
        this.signallingEventClose = event;
    }

    /**
     * Subscribe to the on error details event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onErrorDetails(event: (message: string, signal: WebSocketClientBase, details: any) => void): void {
        // assign the event.
        this.signallingEventErrorDetails = event;
    }

    /**
     * Subscribe to the on message event.
     *
     * @param {function}	event callback(message, signal class, data).
     */
    onMessage(event: (message: string, signal: WebSocketClientBase, details: any) => void): void {
        // assign the event.
        this.signallingEventMessage = event;
    }

    /**
     * Send data.
     * 
     * @param {object}  data                 The data to send.
     */
    sendData(data: any): void {

        // If the socket is not open.
        if (this.webSocket.readyState !== this.webSocket.OPEN) return;

        // Send to the signalling provider.
        this.webSocket.send(JSON.stringify(data));
    }

    /**
     * Open the current signalling connection.
    */
    open(): void {

        if (!this.closed) return;
        this.closed = false;
        let localThis = this;

        try {
            // Create a new WebSocket client for signalling.
            this.webSocket = new WebSocket(this.config.signallingURL);

            // If created.
            if (this.webSocket) {

                // Open new connection handler.
                this.webSocket.onopen = function (openEvent) {
                    // Send open connection alert.
                    localThis.signallingEventOpen("Signalling has opened.", localThis, openEvent);
                };

                // Error handler.
                this.webSocket.onerror = function (errorEvent) {
                    // Send error connection alert.
                    localThis.signallingEventError("Signalling has encountered and unknown error.", localThis, errorEvent);
                };

                // Connection closed handler.
                this.webSocket.onclose = function (closeEvent) {
                    // Send close connection alert.
                    localThis.signallingEventClose("Signalling has closed.", localThis, closeEvent);
                };

                // Incomming messsage handler.
                this.webSocket.onmessage = function (messageEvent) {

                    let signal = null;

                    // Get the signl from the WebSocket.
                    signal = JSON.parse(messageEvent.data);

                    // If a valid response.
                    if (signal) {

                        // Send message.
                        localThis.signallingEventMessage("Signalling general contact message.", localThis, signal);
                    }
                    else {

                        // Unknown error from the WebSocket.
                        localThis.signallingEventErrorDetails("Signalling has encountered an unknown error.", localThis, null);
                    }
                };
            };
        }
        catch (e) {
            // Log the error.
            this.signallingEventErrorDetails("Error opening signalling", this, e.message);
        }
    }

    /**
     * Close the current signalling connection.
    */
    close(): void {

        if (this.closed) return;
        this.closed = true;

        // Close the WebSocket connection.
        if (this.webSocket) {

            // If the socket is not open.
            if (this.webSocket.readyState !== this.webSocket.OPEN) return;

            try {
                // Close.
                this.webSocket.close();
                this.webSocket = null;
            }
            catch (e) {
                // Log the error.
                this.signallingEventErrorDetails("Error closing signalling", this, e.message);
            }
        }
    }
}
