// (function () {
//   function blockDevTools() {
//     const threshold = 200;
//     const widthExceeded = window.outerWidth - window.innerWidth > threshold;
//     const heightExceeded = window.outerHeight - window.innerHeight > threshold;

//     if (widthExceeded || heightExceeded) {
//       // Replace page content
//       document.body.innerHTML =
//         "<h1 style='color:red;text-align:center;margin-top:20%;font-size:2rem;'>⚠️ File Content is Unavailable (404 Found)</h1>";

//       // Block console
//       const handler = () => {
//         while (true) {
//           debugger;
//         }
//       };
//       setInterval(handler, 500);

//       // Override console methods
//       console.log = () => {};
//       console.warn = () => {};
//       console.error = () => {};
//       console.debug = () => {};
//       console.clear = () => {};
//     }
//   }

//   // Run check repeatedly
//   setInterval(blockDevTools, 1000);

//   // // Disable right-click
//   // document.addEventListener("contextmenu", (e) => e.preventDefault());

//   // // Disable certain key shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
//   // document.addEventListener("keydown", (e) => {
//   //   if (
//   //     e.keyCode === 123 || // F12
//   //     (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
//   //     (e.ctrlKey && e.key.toUpperCase() === "U")
//   //   ) {
//   //     e.preventDefault();
//   //     return false;
//   //   }
//   // });
// })();
