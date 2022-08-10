import React, { useState, useEffect } from "react"; //importing react and useState and useEffect functions
import axios from "axios"; //importing axios , to make requests to the server and get the data from the server
import AceEditor from "react-ace"; //importing ace editor to display the code in the editor and to edit the code
import { jsPDF } from "jspdf"; //importing jsPDF to generate the pdf file
import copy from "./copy.png"; //importing copy.png to display the copy icon   (copy.png is the image file)
import pdf from "./pdf.png"; //importing pdf.png to display the pdf icon   (pdf.png is the image file)
// import moment from "moment"; //importing moment to format the date and time
import { useToast } from "@chakra-ui/react"; //importing useToast to display the toast message
// import alanBtn from "@alan-ai/alan-sdk-web"; //importing alanBtn to display the alan button
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
function App() {
  const toast = useToast(); //using useToast to display the toast message
  //creating a function called App which will be called in the index.js file
  const [code, setCode] = useState(""); //creating a state called code and setting it to an empty string
  const [output, setOutput] = useState(""); //creating a state called output and setting it to an empty string
  const [language, setLanguage] = useState("cpp"); //creating a state called language and setting it to cpp
  const [name, setName] = useState("default-code"); //creating a state called name and setting it to default-code
  const [status, setStatus] = useState(""); //creating a state called status and setting it to an empty string
  const [input, setInput] = useState(""); //creating a state called input and setting it to an empty string
  // const [jobId, setJobId] = useState(""); //creating a state called jobId and setting it to an empty string
  //eslint-disable-next-line
  // const [jobDetails, setJobDetails] = useState(null); //creating a state called jobDetails and setting it to null
  // const [executionToast, setExecutionToast] = useState(false); //creating a state called executionToast and setting it to false

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  var doc = new jsPDF();
  doc.text(code, 15, 15);

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    toast({
      title: `${language} set as default language!`,
      description: "",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleSubmit = async () => {
    const payload = {
      language: language,
      code,
      input,
    };
    try {
      const { data } = await axios.post(
        "https://smartcodecompiler.herokuapp.com/run",
        payload
      );
      if (data.output.memory === null) {
        setStatus("error");
      } else if (data.output.statusCode === 200) {
        setStatus("Success");
      }
      setOutput(data.output.output);
      let sts;
      if (data.output.memory === null) {
        sts = "error";
      } else if (data.output.statusCode === 200) {
        sts = "Success";
      }

      toast({
        title: "Code Executed!",
        description: `Memory: ${data.output.memory} KB | Time: ${data.output.cpuTime} ms`,
        status: sts === "Success" ? "success" : "error",
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     alanBtn({
  //       key: "e6f0bf4fca3358f5d610608f6aad42102e956eca572e1d8b807a3e2338fdd0dc/stage",
  //       onCommand: (commandData) => {
  //         if (commandData.command === "go:back") {
  //           // Call the client code that will react to the received command
  //         }
  //       },
  //     });
  //   }, []);

  // returning the JSX code to render the App component
  return (
    <div className="mx-4">
      <h1 className="text-2xl border-b-2 text-gray-800 border-black text-center pb-3 ubuntu md:text-3xl md:p-4">
        SMART CODE EDITOR AND COMPILER
      </h1>
      <div>
        <div className="flex justify-evenly ">
          <div className="flex flex-col w-full mt-4 mb-4 md:flex md:flex-row md:justify-center">
            <select
              className="px-3 py-3 bg-white border border-black rounded-lg shadow-md"
              value={language}
              onChange={(e) => {
                let response = window.confirm(
                  "Are you sure you want to switch the Language?"
                );
                if (response) {
                  setLanguage(e.target.value);
                }
              }}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              {/* <option value="py">Python</option> */}
              {/* <option value="js">Javascript</option> */}
              <option value="java">Java</option>
            </select>
            &nbsp;&nbsp;
            <button
              onClick={setDefaultLanguage}
              className="hover:bg-green-700 bg-green-600 px-3 py-3 text-white ubuntu rounded-lg shadow-md text-left"
            >
              Set Default Language
            </button>
            &nbsp;&nbsp;
            <button
              onClick={handleSubmit}
              className="hover:bg-red-700 bg-red-600 text-white px-2 py-3 ubuntu rounded-lg shadow-md"
            >
              <div
                className="flex"
                onClick={() => {
                  toast({
                    title: `Code submitted!`,
                    description: "",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "bottom",
                  });
                }}
              >
                SUBMIT&nbsp;&nbsp;&nbsp;
                <img
                  alt="PLAY"
                  src="https://img.icons8.com/ios-glyphs/30/000000/play--v1.png"
                  style={{
                    height: "15px",
                    width: "15px",
                    marginTop: "5px",
                  }}
                />
              </div>
            </button>
            &nbsp;&nbsp;
            <button
              className="hover:bg-yellow-600 bg-yellow-500 text-white px-3 py-3 ubuntu rounded-lg shadow-md"
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast({
                  title: "Code copied to clipboard!",
                  description: "",
                  status: "success",
                  duration: 4000,
                  isClosable: true,
                  position: "bottom",
                });
              }}
            >
              <div className="flex">
                Copy Code&nbsp;&nbsp;&nbsp;
                <img
                  style={{
                    height: "15px",
                    width: "15px",
                    marginTop: "5px",
                  }}
                  src={copy}
                  alt="CP"
                />
              </div>
            </button>
            &nbsp;&nbsp;
            <input
              type="text"
              id="fname"
              name=""
              placeholder=" Name"
              className="border-2 border-black  px-3 py-3 bg-white rounded-lg shadow-md"
              onChange={(e) => {
                setName(e.target.value);
                console.log(name);
              }}
            />
            &nbsp;&nbsp;
            <button
              className="hover:bg-blue-700 bg-blue-600 text-white px-3 py-3 ubuntu border-black border-2 border-l-0 rounded-lg shadow-md"
              onClick={() => {
                doc.save(`${name}.pdf`);
                toast({
                  title: "Code saved to PDF!",
                  description: "",
                  status: "success",
                  duration: 4000,
                  isClosable: true,
                  position: "bottom",
                });
              }}
            >
              <div className="flex">
                Save PDF&nbsp;&nbsp;&nbsp;
                <img
                  style={{
                    height: "15px",
                    width: "15px",
                    marginTop: "5px",
                  }}
                  alt="PDF"
                  src={pdf}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full md:flex md:flex-row md:terminal md:justify-center md:terminal">
          <AceEditor
            className="max-h-96 min-w-full md:min-w-0 md:max-h-full md:border-2 md:border-gray-700 md:rounded-lg md:shadow-md md:border-2 md:border-gray-700 md:rounded-lg md:shadow-md mb-3 md:mr-4"
            mode="javascript"
            theme="github"
            value={code}
            name="editor"
            height="75vh"
            placeholder="CODE"
            width="60%"
            wrapEnabled="true"
            onChange={(e) => {
              setCode(e);
            }}
            fontSize={16}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 4,
            }}
          />
          <div className="grid grid-cols-1 justify-center">
            <div className="grid grid-cols-1">
              <div className="flex justify-start rounded-lg pl-2 pt-1 bg-gray-100 ubuntu border-t-2 border-l-2 border-r-2 border-b-2 border-black">
                Notes
              </div>
              <textarea
                rows={2}
                className="h-full w-full border-2 border-black p-2  rounded-lg shadow-md mt-2 "
                placeholder="NOTES"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 mt-2 justify-center mt-3 mb-4">
              <div className="grid grid-cols-1 mb-3">
                <div className="flex justify-start bg-gray-100 pl-2 pt-2 pb-2 ubuntu rounded-lg">
                  Output Screen
                </div>
                <div
                  className="max-w-full rounded-lg bg-black text-white p-2 md:h-full md:w-full md:bg-black md:text-white md:p-4"
                  style={{ height: "230px", width: "430px" }}
                >
                  {output}
                </div>
              </div>
              {!status ? (
                <div className="flex justify-center bg-gray-300 pr-2 ubuntu text-white rounded-lg p-2">
                  {status} &nbsp; &nbsp;{" "}
                </div>
              ) : status === "error" ? (
                <div className="flex justify-center bg-red-600 text-white pr-2 ubuntu rounded-lg p-2">
                  {status.toUpperCase()} &nbsp; &nbsp;{" "}
                </div>
              ) : status === "pending" ? (
                <div className="flex justify-center bg-yellow-500 text-white pr-2 ubuntu rounded-lg p-2">
                  {status.toUpperCase()} &nbsp; &nbsp;{" "}
                </div>
              ) : (
                <div className="flex justify-center bg-green-600 pr-2 ubuntu text-white rounded-lg p-2">
                  {status.toUpperCase()} &nbsp; &nbsp;{" "}
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
      </div>
      <div className="mb-8 md:ml-6 md:mr-6">
        <AceEditor
          className="max-h-96 max-w-full md:min-w-full md:max-h-36 md:border-2 md:border-gray-700 md:rounded-lg md:shadow-md md:border-2 md:border-gray-700 md:rounded-lg md:shadow-md mb-3 md:mr-4"
          placeholder="Input Parameters"
          theme="github"
          name="input_editor"
          onChange={(e) => {
            setInput(e);
          }}
          fontSize={16}
          value={input}
          showPrintMargin={true}
          showGutter={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}

export default App;
