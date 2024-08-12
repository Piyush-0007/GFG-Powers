import prettierFormat_formatCode from "./javaParser.js";

const showNotification = () => {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(
          "Sorry, Unsupported Programming Language!",
          {
            body: "We only support C++ or Java as of date.",
            icon: "icon.png",
          }
        );
      } else {
        console.log("Notification permission denied");
      }
    });
  }
};

const formatCode = (editor) => {
  //Gets the Ace Editor of GFG
  var editorElements = document.getElementsByClassName("ace_editor");
  console.log(editorElements);
  var editor = ace.edit(editorElements[0]);
  console.log(editor);
  var code = editor.getValue();

  // Gets the selected language Used from drop down
  const dropdown = document.querySelector(".problems_language_dropdown__DgjFb");
  const selectedOptionText = dropdown.querySelector(
    ".active.selected.item .text"
  ).textContent;

  var formattedCode;
  if (selectedOptionText.startsWith("C++")) {
    var formattedCode = js_beautify(code, {
      indent_size: 4,
      brace_style: "expand",
    });
  } else if (
    selectedOptionText.startsWith("Java") &&
    !selectedOptionText.startsWith("Javascript")
  ) {
    formattedCode = prettierFormat_formatCode.formatCode(code, {
      printWidth: 200,
      tabWidth: 4,
    });
  } else {
    // Show Unsupported Programming Language Notification
    showNotification();
    return;
  }
  editor.setValue(formattedCode);
  editor.clearSelection();
};

//injecting format button
waitForElement(".problems_menu_wrap_content__BwiWt", (parent) => {
  //adding format button
  const formatDiv = document.createElement("div");
  formatDiv.className = "problems_header_icons__h94Bp null";
  formatDiv.id = "editor-icon";
  formatDiv.innerHTML = `
     <div id="tooltip">
       Format
       <span class="highlight"> Alt </span>+<span class="highlight">Shift</span>+<span class="highlight">f</span>
     </div>
   
     <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="align-left" class="svg-inline--fa fa-align-left absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M24 40C10.7 40 0 50.7 0 64S10.7 88 24 88H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zM0 320c0 13.3 10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H24c-13.3 0-24 10.7-24 24zM24 424c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H24z"></path></svg>
       
     
     `;

  const editorMenu = parent.firstElementChild;
  formatDiv.addEventListener("click", function () {
    formatCode();
  });
  editorMenu.insertBefore(formatDiv, editorMenu.firstElementChild);
});

//waiting for dom to load, so that callback function will work
function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 100); // Check every 100ms
}

//adding shortcut to format
window.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.altKey && e.shiftKey && (e.key == "f" || e.key == "F")) {
    formatCode();
  }
});
