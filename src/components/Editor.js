import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
// importing css
import "codemirror/lib/codemirror.css";
// // import for js
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";

// // import for theme
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";
import "codemirror/theme/dracula.css";

const Editor = ({ socketRef, id, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = await Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: {
            name: "python",
            json: true,
          },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            id,
            code,
          });
        }
      });

      //
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("receiving");
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
