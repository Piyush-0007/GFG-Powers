const output = document.querySelector(".problems_content__I8YGa");
const header = document.querySelector("div.ui.green.pointing.secondary.menu");
header.scrollTop = header.scrollHeight;

const child = header.childNodes;
//remove the existing values
child[0].style.display = "none";
child[1].style.display = "none";

//exampleCase of the given problem
let exampleCase = null,
  runnable = null;

//contain the result
const resultPanel = document.createElement("div");
resultPanel.className = "my_problems_content_pane";
output.appendChild(resultPanel);

let addToTestCase = true;

//adding Result and primary input case.
const result = document.createElement("a");
result.className = "item bgEffect";
result.innerText = `Result`;
header.appendChild(result);
result.addEventListener("click", (e) => {
  saveActiveData(curActive);
  activate(result);

  // resultPanel.innerHTML = resultData;
  child[0].click();
  resultPanel.style.display = "none";
  const arena = document.querySelector(" .problems_content_pane__nexJa");
  arena.style.display = "block";
  header.scrollLeft = 0;
  header.scrollTop = header.scrollHeight;
  //move to custom testcase
  if (addToTestCase) {
    arena.addEventListener("click", (e) => {
      const cls = e.target.classList;
      if (cls.contains("problems_pointer__fzYYK") && cls.contains("branch")) {
        e.stopPropagation();
        const value = e?.target?.parentNode?.parentNode?.nextSibling?.innerText;
        const testcase = addNewCase({ input: value });
        showCase(testcase);
      }
    });
    addToTestCase = false;
  }
});

const case1 = document.createElement("a");
case1.className = "active item bgEffect";
case1.innerText = `Case 1`;
case1.id = 1;
header.appendChild(case1);
case1.addEventListener("click", (e) => {
  header.scrollTop = header.scrollHeight;
  saveActiveData(curActive);
  activate(case1);
  showCase(case1);
});

//variable to set the current active tab
let curActive = case1;
//last active test case
let prevTestCase = null;

//button for addition of testcase +
const ele = document.createElement("a");
ele.classList.add("item");
ele.innerHTML =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M13 11h7a1 1 0 110 2h-7v7a1 1 0 11-2 0v-7H4a1 1 0 110-2h7V4a1 1 0 112 0v7z" clip-rule="evenodd"></path></svg>';
header.appendChild(ele);

let id = 1,
  index = 1;
ele.addEventListener("click", addNewCase);
function addNewCase(e) {
  saveActiveData(curActive);

  const bg = document.createElement("div");
  bg.className = "bgTestCase bgEffect";
  bg.dataset.index = ++index;

  const x = document.createElement("div");
  x.className = "remove hide";
  x.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="0.8rem" height="0.8rem" viewBox="0 0 384 512"><path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;

  let inp = document.createElement("a");
  inp.className = "item customCase";
  inp.innerText = "Case " + index;
  inp.id = `${++id}`;

  bg.appendChild(inp);
  bg.appendChild(x);
  document.querySelector(".problems_custom_input_textarea__T9IDk")?.focus();

  bg.addEventListener("mouseover", () => {
    x.classList.remove("hide");
  });
  bg.addEventListener("mouseout", () => {
    x.classList.add("hide");
  });
  x.addEventListener("click", (e) => {
    e.stopPropagation();
    let i = bg.nextSibling;
    if (curActive == bg.firstElementChild) {
      //checking if we are removing the selected case
      if (i == ele) {
        //check condition for last case
        bg.previousElementSibling.click();
      } else {
        // if not the last case then select the previous case
        i.click();
      }
    }
    //changing indexes for later elements
    while (i && i != ele) {
      let index = parseInt(i.dataset.index);
      i.dataset.index = index - 1;
      i.firstElementChild.innerText = "Case " + (index - 1);
      i = i.nextSibling;
    }
    index--;
    bg.remove();
    chrome.runtime.sendMessage(
      { action: "removeData", key: inp.id },
      ({ error }) => {
        if (error) console.log(error);
      }
    );
  });

  saveActiveData(inp, e.input ?? exampleCase, false);
  if (curActive == result) {
    showCase(inp);
  }
  activate(inp);
  header.insertBefore(bg, ele);
  header.scrollLeft = header.scrollWidth;

  bg.addEventListener("click", (e) => {
    saveActiveData(curActive);
    activate(inp);
    showCase(inp);
  });

  return inp;
}

function saveActiveData(ele, value, nonResult = true) {
  if (nonResult && (curActive == result || !ele)) return;
  const data =
    value ??
    document.querySelector(".problems_custom_input_textarea__T9IDk")?.value;
  if (data)
    chrome.runtime.sendMessage({ action: "setData", key: ele.id, value: data });
}

//changing the tab of output window
function activate(ele) {
  // if(curActive == prevTestCase) return;
  if (curActive == ele) {
    return;
  }
  prevTestCase = curActive;
  curActive.classList.remove("active");
  ele.classList.add("active");
  curActive = ele;
}

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
let input_format = null;
function customInp(custom_input) {
  custom_input.innerHTML = "";
  testcase = document.createElement("div");
  testcase.className = "testcase";
  testcase.innerHTML = `
    <div class="testcase">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(31,194,35,1)"><path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path></svg>
    Testcases
    <div>
    `;
  custom_input.appendChild(testcase);
  custom_input.parentNode.classList.add("testcase");

  testcase.addEventListener("click", () => {
    output.parentNode.classList.add("visible");

    if (exampleCase == null) {
      waitForElement(".problems_content_pane__nexJa", (defCase) => {
        runnable = defCase.querySelector(
          ".problems_custom_input_textarea__T9IDk"
        );
        exampleCase = runnable.value;
        const payload = {
          action: "setData",
          key: curActive.id,
          value: exampleCase,
        };
        chrome.runtime.sendMessage(payload, (response) => {
          showCase(curActive);
        });
        input_format = document.querySelector(
          ".problems_custom_input_format__OHBL_"
        )?.innerHTML;
      });
    } else if (curActive != result) showCase(curActive);

    if (curActive != result) {
      header.scrollLeft =
        curActive.offsetLeft -
        curActive.offsetWidth / 2 +
        curActive.offsetWidth / 2;
      curActive.click();
    } else {
      header.scrollLeft =
        prevTestCase.offsetLeft -
        prevTestCase.offsetWidth / 2 +
        prevTestCase.offsetWidth / 2;
      prevTestCase.click();
    }
  });

  //attaching event listener to submit button
  const submit = document.querySelector(
    "button.ui.button.problems_submit_button__6QoNQ"
  );
  submit.addEventListener("click", (e) => {
    output.parentNode.classList.add("visible");
    if (exampleCase == null) testcase.click();
    result.click();
  });

  function compileAndRun() {
    const id = curActive == result ? prevTestCase : curActive;
    if (exampleCase == null) {
      testcase.click();
    } else {
      if (curActive != result) id.click();
    }

    waitForElement(`#run_${id.id}`, (el) => {
      el.click();
    });
  }

  // adding shortcut for compile and run
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === ";") {
      testcase.click();
    } else if (e.ctrlKey && e.key === "'") {
      compileAndRun();
    } else if (e.ctrlKey && e.key === "Enter") {
      submit.click();
    } else if (e.ctrlKey && (e.altKey ? e.altKey : true) && e.key === ".") {
      //add to test case
      if (curActive == result) {
        const copyTestCase = document.querySelector(
          ".branch.problems_pointer__fzYYK"
        );
        console.log(copyTestCase);
        if (copyTestCase) {
          copyTestCase.click();
        }
      } else {
        ele.click();
      }
    } else if (e.ctrlKey && (e.altKey ? e.altKey : true) && e.key === ",") {
      //remove test case
      e.preventDefault();
      const element = curActive.nextElementSibling;
      if (element && element != ele) {
        element.click();
      }
    }
  });

  //making custom compile and run button.
  const run = document.createElement("button");
  run.className = "compile-run";
  run.innerText = "Compile & Run";
  run.addEventListener("click", compileAndRun);
  custom_input.parentNode.insertBefore(run, submit);
}

//running the above method customInp, where we change the custom_input button and add some functionality
waitForElement(".problems_custom_input__ediyL", customInp);

// Function to inject values into the HTML structure
function showCase(cases) {
  resultPanel.style.display = "block";
  try {
    document.querySelector(" .problems_content_pane__nexJa").style.display =
      "none";
  } catch (e) {
    console.log(e);
  }

  // Retrieve the values from chrome.storage.session
  const payload = { action: "getData", key: cases.id };
  chrome.runtime.sendMessage(payload, function (resultData) {
    // Extract the values from the result object
    let data = resultData.data || exampleCase;
    // Create the HTML structure
    const htmlContent = `
                <span class="problems_testcase_example" >use example testcase</span>
                <textarea maxlength="50000" class="problems_custom_input_textarea__T9IDk" height="3rem" rows="3">${data}</textarea>

                <button class="run_testcase " id="run_${cases.id}">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg></div><span>Run</span>
                </button>
                
                <div class="problems_custom_input_limit_text__tXh5w"> Char Limit: 50,000 </div>
                ${
                  input_format ??
                  `<div class="problems_custom_input_format__OHBL_">
                    <strong>Input Format:</strong>
                    <p>
                        <p><span style="font-size: 18px;">The first line every test case contains two space-separated integers <strong>n</strong> and <strong>k</strong>. Next line has <strong>n</strong> space-separated integers.&nbsp;</span></p>
                        <p><span style="font-size: 20px;">Example:</span></p>
                        <pre>${exampleCase}</pre>
                    </p>
                    </div>`
                }
        `;

    // Inject the HTML content into the desired location
    resultPanel.innerHTML = htmlContent;
    //focusing on input text box
    textareaValue = document.querySelector(
      ".problems_custom_input_textarea__T9IDk"
    );
    textareaValue.focus();

    //setting the functionality of [use example testcase] button
    document
      .querySelector(".problems_testcase_example")
      .addEventListener("click", () => {
        textareaValue.value = exampleCase;
      });

    document
      .querySelector(`#run_${cases.id}`)
      .addEventListener("click", (e) => {
        const data = document.querySelector(
          ".problems_custom_input_textarea__T9IDk"
        ).value;
        chrome.runtime.sendMessage({
          action: "setData",
          key: curActive.id,
          value: data,
        });
        child[1].click();
        addToTestCase = true;
        waitForElement(".problems_content_pane__nexJa", (el) => {
          const textarea = el.querySelector(
            "textarea.problems_custom_input_textarea__T9IDk"
          );

          if (textarea) {
            // Update the value using React's value tracker
            const lastValue = textarea.value;
            textarea.value = data;
            const event = new Event("input", { bubbles: true });
            // Ensure React picks up the new value
            const tracker = textarea._valueTracker;
            if (tracker) {
              tracker.setValue(lastValue);
            }
            textarea.dispatchEvent(event);
          }
          document
            .querySelector("button.ui.button.problems_compile_button__Lfluz")
            .click();
          result.click();
        });
      });
  });
}

const outputScreen = document.querySelector(
  "div.ui.segment.ui.overlay.bottom.sidebar.problems_output_window__G_LTH.problems_normal_height__Og1iy"
);

const mutation = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (
      mutation.type === "attributes" &&
      !mutation.target.classList.contains("visible")
    ) {
      addToTestCase = true;
    }
  }
});

mutation.observe(outputScreen, {
  attributes: true,
  attributeFilter: ["class"],
});

function init(parent) {
  //adding format button
  const formatDiv = document.createElement("div");
  formatDiv.className = "problems_header_icons__h94Bp null";
  formatDiv.id = "editor-icon";
  formatDiv.innerHTML = `
    <div id="tooltip">
      Format
      <span class="highlight"> Alt </span>+<span class="highlight"> Shift </span>+
      <span class="highlight"> f </span>
    </div>
  
    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="align-left" class="svg-inline--fa fa-align-left absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M24 40C10.7 40 0 50.7 0 64S10.7 88 24 88H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H24zM0 320c0 13.3 10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H24c-13.3 0-24 10.7-24 24zM24 424c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H24z"></path></svg>
      
    
    `;

  const editorMenu = parent.firstElementChild;
  formatDiv.addEventListener("click", function () {
    formatCode();
  });
  editorMenu.insertBefore(formatDiv, editorMenu.firstElementChild);
}

let source = document.createElement("script");

source.type = "module";
source.src = chrome.runtime.getURL("./js/cppParser.js");
(document.head || document.documentElement).appendChild(source);

source = document.createElement("script");
source.type = "module";
source.src = chrome.runtime.getURL("./js/formatScript.js");
(document.head || document.documentElement).appendChild(source);

source = document.createElement("script");
source.src = chrome.runtime.getURL("./js/javaParser.js");
source.type = "module";
(document.head || document.documentElement).appendChild(source);
