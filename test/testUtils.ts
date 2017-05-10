import * as stream from "stream";

export class BufferStream extends stream.Writable {
    constructor(public bufferSize: number = Infinity, public buffer = "") {
        super();
    }
    public write(chunk: string) {
        if (this.buffer.length + chunk.length < this.bufferSize) {
            this.buffer += chunk;
            return true;
        } else {
            this.buffer += chunk.slice(0, this.bufferSize - this.buffer.length);
        }
    }
}
