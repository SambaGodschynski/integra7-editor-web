"use strict"
// https://webmidijs.org/

// window['_midi_0in$']("midiInputMessage")

// https://codeshock.dev/news/how-to-convert-between-hexadecimal-strings-and-byte-arrays-in-javascript/
function bytestoHexStr(bytes) {
    var hex = '';
    for (var i = 0; i < bytes.length; i++) {
        hex += ('0' + (bytes[i] & 0xFF).toString(16).toUpperCase()).slice(-2);
    }
    return hex;
}

function hexStrTobBytes(hex) {
    var arr = [];
    for (var i = 0; i < hex.length; i += 2) {
        arr.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(arr);
}

function MyWebMidi() {
    this.getWebMidiAssertingReady = () => {
        console.warn("WebMidi not ready yet.");
    };
    this.activeInputs = [];
    this.activeOutputs = [];
    this.activeInputListeners = [];
    this.inPortDelegateFuncName = [];
    this.webMidiReadyPromise = WebMidi
        .enable({sysex: true})
        .then(()=>{
            this.getWebMidiAssertingReady = () => WebMidi;
        })
        .catch(err => {
            alert(err)
        });

    const getInputPorts = () => {
        const result = this.getWebMidiAssertingReady()
            .inputs
            .map(x => ({
                "MIDIEndpointUIDKey": x.id,
                "MIDIDeviceNameKey": x.name,
                type: 'input'
            }));
        return result;
    };
    const getOutputPorts = () => {
        const result = this.getWebMidiAssertingReady()
            .outputs
            .map(x => ({
                "MIDIEndpointUIDKey": x.id,
                "MIDIDeviceNameKey": x.name,
                type: 'output'
            }));
        return result;
    };
    const onMidiMessageReceived = (index, msg) => {
        if (msg.rawData[0] !== 0xf0) {
            console.log(`unhandled message received ${msg.type}`)
            return;
        }
        const hexStr = bytestoHexStr(msg.rawData);
        console.log(`RECEIVED: ${hexStr}`);
        const fkey = this.inPortDelegateFuncName[index]; //  _rwc_0is$
        window[fkey]("midiInputMessage", hexStr);
    };
    const connectInput = async (index, inputObj) => {
        await this.webMidiReadyPromise;
        inputObj = JSON.parse(inputObj);
        const input = this.getWebMidiAssertingReady()
            .inputs
            .find(x => x.id === inputObj["MIDIEndpointUIDKey"]);
        this.activeInputs[index] = input;
        const listener = input.addListener("midimessage", onMidiMessageReceived.bind(this, index));
        this.activeInputListeners[index] = listener;
    };
    const connectOutput = async (index, outputObj) => {
        await this.webMidiReadyPromise;
        outputObj = JSON.parse(outputObj);
        const output = this.getWebMidiAssertingReady()
            .outputs
            .find(x => x.id === outputObj["MIDIEndpointUIDKey"]);
        this.activeOutputs[index] = output;
    };
    const disconnectAllInputs = () => {
        this.activeInputs = [];
        for(let listener of this.activeInputListeners) {
            listener.remove();
        }
        this.activeInputListeners = [];
    };
    const disconnectAllOutputs = () => {
        this.activeOutputs = [];
    };
    const outputPortSend = async (index, hexStr) => {
        await this.webMidiReadyPromise;
        console.log(`SENDING: ${hexStr}`);
        const outp = this.activeOutputs[index];
        if (!outp) {
            console.warn("NO OUPTPUT FOUND");
            return;
        }
        const bytes = hexStrTobBytes(hexStr);
        outp.send(bytes);
    };

    const inputPortDelegate = (index, funcStr) => {
        this.inPortDelegateFuncName[index] = funcStr;
    }
    return {
        inputPort_endpoints: getInputPorts,
        outputPort_endpoints: getOutputPorts,
        inputPort_connectEndpoint: connectInput,
        outputPort_connectEndpoint: connectOutput,
        inputPort_disconnectAllEndpoints: disconnectAllInputs,
        outputPort_disconnectAllEndpoints: disconnectAllOutputs,
        outputPort_send: outputPortSend,
        inputPort_delegate: inputPortDelegate,
    };
}


(function(window) {
    window["_midi_"] = new MyWebMidi();
})(window)