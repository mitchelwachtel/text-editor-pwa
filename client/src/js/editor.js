// Import methods to save and get data from the indexedDB database in './database.js'
import {getDb, putDb} from "./database";
import {header} from "./header";

export default class {
  constructor() {
    const localData = localStorage.getItem("content");
console.log(`local storage: ${localData}`)
    // check if CodeMirror is loaded
    if (typeof CodeMirror === "undefined") {
      throw new Error("CodeMirror is not loaded");
    }

    this.editor = CodeMirror(document.querySelector("#main"), {
      value: "",
      mode: "javascript",
      theme: "monokai",
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((res) => {
      const index = res.length;
      console.log(index);
      const localIndex = localData.length;
      // console.log(res[res.length-1].data);
      // console.log(localData);
      // console.log(header);
      // console.log(res);
      // const index = res.length-1;
      // console.log(index);
      // console.info("Loaded data from THIS, injecting into editor");
      // console.log(data.length)
      if (index != 0) {
        console.log('data.length is >0')
        // console.log(res[0].data)
        this.editor.setValue(res[res.length-1].data);
      } 
      else if (localIndex != 0) {
        console.log('localData.length is >0')
        this.editor.setValue(localData);
      }
       else {
        console.log('header section')
        this.editor.setValue(header);
      }
    // this.editor.setValue(res[res.length-1].data || localData || header);
    });

    this.editor.on("change", () => {
      localStorage.setItem("content", this.editor.getValue());
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on("blur", () => {
      console.log("The editor has lost focus");
      putDb(localStorage.getItem("content"));
    });
  }
}
