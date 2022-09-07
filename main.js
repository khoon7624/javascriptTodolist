//유저가 값을 입력한다
// + 버튼을 클릭하면, 할일이 추가
// delete 버튼을 누르면 할일이 삭제된다
// check 버튼을 누르면 할일이 끝나면서 밑줄이 간다
// 1.check 버튼을 클릭하는 순간 true false
// 2. true이면 끝난걸로 간주하고 밑줄 보여주기
// 3. false이면 안긑난걸로 간주하고 그대로

// done not done 탭을 누르면, 언더바가 이동한다
// done / not done 필터
// all 누르면 전체 필터

const addBtn = document.querySelector("#add-button");
let taskInput = document.querySelector("#task-input");
let tabs = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
let filterList = [];
addBtn.addEventListener("click", addTask);

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

const strogeItem = JSON.parse(localStorage.getItem("memo"));

if (strogeItem) {
  strogeItem.forEach((e) => {
    taskList.push(e);
  });
}

function addTask() {
  //추가 하는 함수
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  localStorage.setItem("memo", JSON.stringify(taskList));
  render(taskList);
  taskInput.value = "";
}

function render() {
  let list = [];
  if (mode === "all") {
    list = taskList;
  } else if (mode === "ongoing" || mode === "done") {
    list = filterList;
  }
  let resultHTML = "";
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete === true) {
      resultHTML += `<div class="task">
      <div class="task-done">${list[i].taskContent}</div>
      <div>
        <button onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-arrow-rotate-left"></i></button>
        <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>`;
    } else {
      resultHTML += `<div class="task">
      <div>${list[i].taskContent}</div>
      <div>
        <button onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-check"></i></button>
        <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  // Check 기능 함수
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      localStorage.setItem("memo", JSON.stringify(taskList));
    }
  }
  render(taskList);
}

function deleteTask(id) {
  // 삭제하는 함수
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("memo", JSON.stringify(taskList));
  render();
}

function randomIDGenerate() {
  return "_" + Math.random().toString(36).substring(2, 9);
}

function filter(event) {
  mode = event.target.id;
  filterList = [];
  if (mode === "all") {
    moveUnderLine("stop");
    render();
  } else if (mode === "ongoing") {
    moveUnderLine("move");
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i]);
      }
    }
    render();
  } else if (mode === "done") {
    moveUnderLine("lastWidth");
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true) {
        filterList.push(taskList[i]);
      }
    }

    render();
  }
}

function moveUnderLine(move) {
  let under = document.getElementById("under-line");
  let moveWidth = document.getElementById("ongoing").clientWidth;
  let allWidth = document.getElementById("all").clientWidth;
  let lastWidth = document.getElementById("done").clientWidth;

  if (move === "move") {
    console.log("move");
    under.style.width = moveWidth + "px";
    under.style.left = allWidth + "px";
  } else if (move === "stop") {
    console.log("stop");
    under.style.width = allWidth + "px";
    under.style.left = 0;
  } else if (move === "lastWidth") {
    console.log("lastWidth");
    under.style.width = lastWidth + "px";
    under.style.left = allWidth + moveWidth + "px";
  }
}

function inputEvent() {
  const input = document.getElementById("task-input");
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("add-button").click();
    }
  });
}
inputEvent();
render(taskList);
