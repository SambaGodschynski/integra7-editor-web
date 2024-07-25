"use strict"
function MyApp() {
    const localStorageKey = 'roland-integra-7-web-storage-';
    const saveState = (index, jsonStr) => {
        localStorage.setItem(localStorageKey+index, jsonStr);
    }
    const loadState = (index) => {
        const jsonStr = localStorage.getItem(localStorageKey+index);
        if (!jsonStr) {
            return undefined;
        }
        return JSON.parse(jsonStr);
    }
    let myconsole = null;
    let idLineMap = {}
    let lines = [];

    const renderConsole = () => {
        myconsole.value = "";
        let lnNr = 0;
        for(const line of lines) {
            myconsole.value += `${lnNr++}> ${line}\n`;
        }
        myconsole.scrollTop = myconsole.scrollHeight;
    }
    const clearConsole = () => {
        idLineMap = {};
        lines = [];
        renderConsole();
    }
    const report = (id, msg) => {
        if (idLineMap[id]!==undefined) {
            lines[idLineMap[id]] = msg;
            renderConsole();
            return;
        }
        idLineMap[id] = lines.length;
        lines.push(msg)
        renderConsole();
    }
    const initConsole = () => {
        const iframe = document.getElementById("header");
        myconsole = iframe.contentWindow.document.getElementById("console-content");
        if (!myconsole) {
            throw new Error("missing console div");
        }
        report(0, "Hello!");
    } 
    setTimeout(initConsole, 1000);
    return {
        loadState,
        saveState,
        report,
        clearConsole
    };

}


(function(window) {
    window["_app_"] = new MyApp();
})(window)