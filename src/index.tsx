import React, { Suspense } from "react";
// react 18
// import ReactDOM from "react-dom/client";

// react 17
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";

// caso:
// "react": "^18.1.0",
// "react-dom": "^18.1.0",

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// react 17
ReactDOM.render(
  <Suspense fallback={<h1>Loading App...</h1>}>
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
