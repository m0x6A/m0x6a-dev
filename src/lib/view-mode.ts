// Shared by the root layout (server) and ViewToggle (client).
export const VIEW_STORAGE_KEY = "m0x6a:view";

// Runs in <head> before the page paints, so a saved "source" choice doesn't flash.
export const VIEW_INIT_SCRIPT = `try{if(localStorage.getItem("${VIEW_STORAGE_KEY}")==="source")document.documentElement.dataset.view="source"}catch(e){}`;
