import React, { useEffect, useState, useRef } from "react";

import Editor from "@monaco-editor/react";

// import Codemirror from "codemirror";
// import "codemirror/lib/codemirror.css";
// import "codemirror/mode/clike/clike";
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import "./CodeEditArea.css";
import axios from "axios";

// let REACT_APP_CODE_EXECUTE_URL = process.env.REACT_APP_CODE_EXECUTE_PROD_URL
let REACT_APP_CODE_EXECUTE_URL = process.env.REACT_APP_CODE_EXECUTE_DEV_URL;

const CodeEditArea = () => {
  const [code, setCode] = useState(``);
  const [result, setResult] = useState(``);
  // const editorRef = useRef(null);

  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    setCode(value);
  };

  // useEffect(() => {
  //   const init = () => {
  //     editorRef.current = Codemirror.fromTextArea(
  //       document.getElementById("codeEditor2"),
  //       {
  //         mode: { name: "text/x-c++src", json: true },
  //         theme: "dracula",
  //         autoCloseTags: true,
  //         autoCloseBrackets: true,
  //         lineNumbers: true,
  //       }
  //     );
  //     editorRef.current.on("change", (instance) => {
  //       const code = instance.getValue();
  //       setCode(code);
  //     });
  //   };
  //   init();
  // }, []);

  const handleSubmit = async () => {
    await axios({
      method: "post",
      url: `${REACT_APP_CODE_EXECUTE_URL}`,
      data: {
        code: code,
      },
    }).then((response) => {
      console.log(response);
      setResult(response.data);
    });
  };

  // const doNothing = () => {
  //   console.log("output");
  // };

  return (
    <div className="sm:flex sm:flex-col sm:justify-between sm:h-full sm:w-full">
      <div className="sm:h-[65%] w-full">
        {/* <textarea
          className="rounded-lg h-[100%] w-full border-gray-300"
          value={code}
          onChange={doNothing}
          id="codeEditor2"
        ></textarea> */}
        <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
          <Editor
            height="85vh"
            width={`100%`}
            language="cpp"
            value={value}
            theme="Monokai"
            defaultValue="// write code here"
            onChange={handleEditorChange}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded absolute pb-3 mt-[-55px] ml-[10px]"
        >
          <span>Run</span>
        </button>
      </div>
      <div className="bg-[#EEEEEE] rounded-lg h-fit sm:h-[33%]">
        <div className="text-[#EEEEEE] bg-[#222831] h-fit sm:text-lg sm:h-[15%] font-medium rounded-t-lg p-1 w-[100%]">
          Terminal
        </div>
        <div className="sm:flex h-[100px] sm:h-[78%] border-solid border-2 sm:p-2 border-gray-400">
          {result && (
            <div className="font-medium">
              {result.split("\n").map((i, key) => {
                return <div key={key}>{i}</div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditArea;
