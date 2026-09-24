// function makeCounter() {
//     let count = 0;
//     return function(){
//         count++;
//         return count;
//     }
// }

// const a =  makeCounter();
// const b =  makeCounter();

// console.log(a());
// console.log(a());
// console.log(b());

//----------------------------------------------------------------------------------

// function Hello(name){
//     console.log("Hello " + name);
// }

// Hello("Birzhan");

// const car = {
//     brand: "BMW",
//     model: "M5",
//     series: "F90",
//     year: 2020
// }

// console.log(car.brand + " " + car.model + " " + car.series + " " + car.year);

// const myFriend = {
//     name: function(){
//         console.log("Azat");
//     },
//     age: function(){
//         return 21;
//     }
// }

// myFriend.name();
// console.log(myFriend.age());


// function makeDog(){
//     return {
//         bark : function(){
//             console.log("Woof");
//         },
//         age : function(){
//             return 3;
//         }
//     }
// }
// const dog = makeDog();
// dog.bark();
// console.log(makeDog().age());


//Task1
// function createTask(name){
//     let count = 0;
//     return {
//         run : function(){
//             count++;
//             console.log(name + " is running");
//         },
//         getCount: function(){
//             return count;
//         },
//         reset: function(){
//             count = 0;
//         }
//     }
// }

// const t1 = createTask("Load Users");
// const t2 = createTask("Load Posts");

// t1.run();
// t1.run();

// t2.run();

// console.log(t1.getCount());
// console.log(t2.getCount());
// console.log(t1.count);

// t1.reset();
// console.log(t1.getCount());



// const age = 20;

// if (age >=18){
//     console.log("You are an adult");
// } else{
//     console.log("You are a minor");
// }

// console.log("A");

// setTimeout(function(){
//     console.log("B");
// }, 2000);

// console.log("C");


// function flipCoin(){
//     return new Promise(function(resolve, reject){
//         setTimeout(function(){
//             if (Math.random() < 0.5){
//                 resolve("Heads");
//             }
//             else{
//                 reject("Tails");
//             }
//         }, 5000);
//     });
// }

// flipCoin()
//     .then(function(result){
//         console.log("Success: " + result);
//     })
//     .catch(function(error){
//         console.log("Error: " + error);
//     });

// console.log("Coin flip initiated...");



//1. createTask (closure)
function createTask(name) {
  let count = 0;       
  let status = "idle"; 
  let time = 0;   

  return {
    name: name,

    run: function () {
      count++;
      status = "running";

      const delay = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          time = delay;

          if (Math.random() < 0.3) {
            status = "failed";
            reject(name + " failed");
          } else {
            status = "completed";
            resolve(name + " completed");
          }
        }, delay);
      });
    },

    getCount: function () {
      return count;
    },
    getStatus: function () {
      return status;
    },
    getTime: function () {
      return time;
    },
    reset: function () {
      count = 0;
      status = "idle";
      time = 0;
    }
  };
}

//2. Tasks 
const task1 = createTask("Load Users");
const task2 = createTask("Load Posts");
const task3 = createTask("Load Comments");
const tasks = [task1, task2, task3];

//3. Show tasks on the page
function render() {
  let html = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    html += "<div class='task'>";
    html += "<div><h3>" + task.name + "</h3>";
    html += "<p class='info'>Runs: " + task.getCount() + ", time: " + task.getTime() + " ms</p></div>";
    html += "<span class='status status-" + task.getStatus() + "'>" + task.getStatus() + "</span>";
    html += "</div>";
  }

  document.getElementById("task-list").innerHTML = html;
}

function showMessage(text) {
  document.getElementById("summary").textContent = text;
}

//4. Run one task 
function runTask(task) {
  const promise = task.run();
  render(); 

  return promise
    .then(function (result) {
      console.log(result);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      render();
    });
}

//5. Run All
function runAll() {
  showMessage("Running all tasks...");

  Promise.allSettled([runTask(task1), runTask(task2), runTask(task3)])
    .then(function () {
      showMessage("All tasks finished");
    });
}

//6. Sequential vs concurrent
async function runSequential() {
  showMessage("Running tasks one by one...");
  const start = Date.now();

  await runTask(task1);
  await runTask(task2);
  await runTask(task3);

  const total = Date.now() - start;
  document.getElementById("seq-time").textContent = total + " ms";
  showMessage("Sequential finished in " + total + " ms");
}

async function runConcurrent() {
  showMessage("Running tasks at the same time...");
  const start = Date.now();

  await Promise.allSettled([runTask(task1), runTask(task2), runTask(task3)]);

  const total = Date.now() - start;
  document.getElementById("conc-time").textContent = total + " ms";
  showMessage("Concurrent finished in " + total + " ms");
}

function resetAll() {
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].reset();
  }
  document.getElementById("seq-time").textContent = "not measured";
  document.getElementById("conc-time").textContent = "not measured";
  showMessage("Press a button to start.");
  render();
}

//7. Event Loop demo
function log(text) {
  console.log(text);
  document.getElementById("demo-log").textContent += text + "\n";
}

function runEventLoopDemo() {
  document.getElementById("demo-log").textContent = "";

  log("script start");

  setTimeout(function () {
    log("timeout 1");
  }, 0);

  Promise.resolve().then(function () {
    log("promise 1");
  });

  async function demoAsync() {
    log("async function start");
    await null;
    log("after await");
  }
  demoAsync();

  setTimeout(function () {
    log("timeout 2");
  }, 0);

  Promise.resolve().then(function () {
    log("promise 2");
  });

  log("script end");
}

//8. Buttons
document.getElementById("run-all").addEventListener("click", runAll);
document.getElementById("run-sequential").addEventListener("click", runSequential);
document.getElementById("run-concurrent").addEventListener("click", runConcurrent);
document.getElementById("reset-all").addEventListener("click", resetAll);
document.getElementById("run-demo").addEventListener("click", runEventLoopDemo);

render();