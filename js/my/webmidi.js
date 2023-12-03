function MyWebMidi() {
    WebMidi
        .enable()
        .then(()=>{})
        .catch(err => {
            alert(err)
        });

    function getInputPorts() {

    }
    function getOutputPorts() {

    }
    return {
        inputPort_endpoints: getInputPorts,
        outputPort_endpoints: getOutputPorts
    }
}


(function(window) {
    window["_midi_"] = new MyWebMidi()
})(window)