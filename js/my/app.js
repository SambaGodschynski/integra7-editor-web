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
    return {
        loadState,
        saveState
    };
}


(function(window) {
    window["_app_"] = new MyApp();
})(window)