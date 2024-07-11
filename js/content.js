const output = document.querySelector('.problems_content__I8YGa');
const header = document.querySelector("div.ui.green.pointing.secondary.menu");
const child = header.childNodes;
//remove the existing values
child[1].style.display = "none";
child[0].style.display = "none";

//exampleCase of the given problem
let exampleCase = null;

//contain the result
const resultPanel = document.createElement("div")
resultPanel.className = "my_problems_content_pane";
output.appendChild(resultPanel);

resultData = `
        <div class="problems_feedback_container__5RiaB">
            <p id="probfeedback_1" class="problems_feedback_link___wWHc">Suggest Feedback</p>
        </div>
        <span>Click on Compile &amp; Run button to see Result.</span>

`

//adding Result and primary input case.
const result = document.createElement("a");
result.className = "item";
result.innerText = `Result`;
header.appendChild(result);
result.addEventListener("click", (e) => {
    saveActiveData(curActive)
    activate(result);
    
    resultPanel.innerHTML = resultData;
})

const case1 = document.createElement("a");
case1.className = "active item";
case1.innerText = `Case 1`;
case1.id = 1;
header.appendChild(case1);
case1.addEventListener("click", (e) => {
    saveActiveData(curActive)
    activate(case1);
    showCase(case1);
    // resultPanel.innerHTML = defaultCase;
})

//variable to set the current active tab
let curActive = case1;

//button for addition of testcase +
const ele = document.createElement("a");
ele.classList.add("item");
ele.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M13 11h7a1 1 0 110 2h-7v7a1 1 0 11-2 0v-7H4a1 1 0 110-2h7V4a1 1 0 112 0v7z" clip-rule="evenodd"></path></svg>';
header.appendChild(ele);

count = 1;
ele.addEventListener("click", () => {
    saveActiveData(curActive);
    let inp = document.createElement("a");
    inp.className = "item";
    activate(inp);
    inp.innerText = `Case ${++count}`;
    inp.id = `${count}`;
    saveActiveData(inp)
    header.insertBefore(inp, ele);
    header.scrollLeft = header.scrollWidth;

    
    inp.addEventListener("click", (e) => {
        saveActiveData(curActive);
        activate(inp);
        showCase(inp);
    })

});

function saveActiveData(ele){
    if(curActive == result) return;
    const data = document.querySelector(".problems_custom_input_textarea__T9IDk").value;
    console.log("auto save");
    console.log(data);
    chrome.runtime.sendMessage({action: "setData", key : ele.id, value : data});
}


//changing the tab of output window
function activate(ele) {
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


function customInp(custom_input){
    custom_input.innerHTML = "";
    const testcase = document.createElement("div");
    testcase.className = "testcase";
    testcase.innerHTML = `
    <div class="testcase">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(31,194,35,1)"><path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path></svg>
    Testcases
    <div>
    `
    custom_input.appendChild(testcase);
    custom_input.parentNode.classList.add("testcase");
    
    

    testcase.addEventListener("click",()=>{
        output.parentNode.classList.toggle("visible");
        if(exampleCase == null){ 
            waitForElement(".problems_content_pane__nexJa",(defCase)=>{
                exampleCase = document.querySelector(".problems_custom_input_textarea__T9IDk").value;
                const payload  = { action : "setData",key : curActive.id, value : exampleCase};
                chrome.runtime.sendMessage(payload, (response)=>{ 
                    console.log(response);
                    if(curActive != result) showCase(curActive);
                });
            });
        }else if(curActive != result) showCase(curActive);
    });
    
}

//running the above method customInp, where we change the custom_input button and add some functionality 
waitForElement(".problems_custom_input__ediyL", customInp);




// Function to inject values into the HTML structure
function showCase(cases) {
    // Retrieve the values from chrome.storage.session
    console.log("into the showcase")
    const payload = {action : "getData", key : cases.id};
    chrome.runtime.sendMessage(payload, function(result) {
        // Extract the values from the result object
        let data = result.data || exampleCase;
        console.log(result)
        // Create the HTML structure
        const htmlContent = `
                <button class="problems_testcase_link" >use example testcase</button>
                <textarea maxlength="50000" class="problems_custom_input_textarea__T9IDk" rows="3">${data}</textarea>
                <span class="problems_custom_input_limit_text__tXh5w"> Char Limit: 50,000 </span>
                <div class="problems_custom_input_format__OHBL_">
                    <strong>Input Format:</strong>
                    <p>
                        <p><span style="font-size: 18px;">The first line every test case contains two space-separated integers <strong>n</strong> and <strong>k</strong>. Next line has <strong>n</strong> space-separated integers.&nbsp;</span></p>
                        <p><span style="font-size: 20px;">Example:</span></p>
                        <pre>${exampleCase}</pre>
                    </p>
                </div>
        `;
    
        // Inject the HTML content into the desired location
        resultPanel.innerHTML = htmlContent;
    });
}

// Call the function to inject values
// injectValues();

