"use strict"
// https://webmidijs.org/

function MyWebMidi() {
    this.getWebMidi = () => {
        console.warn("WebMidi not ready yet.");
    };
    this.activeInputs = [];
    this.activeOutputs = [];
    WebMidi
        .enable({sysex: true})
        .then(()=>{
            this.getWebMidi = () => WebMidi;
        })
        .catch(err => {
            alert(err)
        });

    const getInputPorts = () => {
        const result = this.getWebMidi()
            .inputs
            .map(x => ({
                "MIDIEndpointUIDKey": x.id,
                "MIDIDeviceNameKey": x.name,
                type: 'input'
            }));
        return result;
    };
    const getOutputPorts = () => {
        const result = this.getWebMidi()
            .outputs
            .map(x => ({
                "MIDIEndpointUIDKey": x.id,
                "MIDIDeviceNameKey": x.name,
                type: 'output'
            }));
        return result;
    };
    const connectInput = (index, inputObj) => {
        inputObj = JSON.parse(inputObj);
        const input = this.getWebMidi()
            .inputs
            .find(x => x.id === inputObj["MIDIEndpointUIDKey"]);
        this.activeInputs[index] = input;
    }
    const connectOutput = (index, outputObj) => {
        outputObj = JSON.parse(outputObj);
        const output = this.getWebMidi()
            .outputs
            .find(x => x.id === outputObj["MIDIEndpointUIDKey"]);
        this.activeOutputs[index] = output;
    }
    const disconnectAllInputs = () => {
        this.activeInputs = [];
    }
    const disconnectAllOutputs = () => {
        this.activeOutputs = [];
    }

    return {
        inputPort_endpoints: getInputPorts,
        outputPort_endpoints: getOutputPorts,
        inputPort_connectEndpoint: connectInput,
        outputPort_connectEndpoint: connectOutput,
        inputPort_disconnectAllEndpoints: disconnectAllInputs,
        outputPort_disconnectAllEndpoints: disconnectAllOutputs
    };
}


(function(window) {
    window["_midi_"] = new MyWebMidi()
})(window)