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

// ----------------------------------------------------------------------------------

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


// Task1
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






// ------------------------------------------ 1
// const taskName = "Load Users";
// let count = 0;

// count++;
// count+=1;

// let status = "idle";

// status = "running";

// console.log(taskName + " - " + status + " - " + "runs: " + count);



// ------------------------------------------------- 2

function getRandomTime(){
    const max = 2000;
    const min = 500;

    return Math.floor(Math.random() * (max - min + 1) + min);

}

// console.log(getRandomTime());
// console.log(getRandomTime());
// console.log(getRandomTime());


// function makeStatusLine(name, status, count){
//     return name + " - " + status + " - " + "runs: " + count;
// }

// const task = makeStatusLine("Load Users", "running", 2);
// console.log(task);

// function noReturn(){
//     console.log("hi");
// }
// console.log(noReturn());

// ----------------------------3

// const task = {
//     name: "Load Users",
//     status: "idle",
//     count: 0,
//     time: 0,

//     describe: function(){
//         return task.name + " - " + task.status + " - " + "runs: " + task.count + " - time " + task.time + " ms";
//     }
// }

// console.log(task.name);
// console.log(task.count);

// task.status = "running";
// task.count += 1;
// task.time = getRandomTime();

// console.log(task);

// console.log(task.color);

// console.log(task.describe());


// function createTask(name){
//     let count = 0;
//     let status = "idle";
//     let time = 0;

//     return {
//         getName: function(){
//             return name;
//         },
//         run: function(){
//             count++;
//             status = "running";
//             time = getRandomTime();
//             console.log(name + " is " + status);
//         },
//         getCount: function(){
//             return count;
//         },
//         getStatus: function(){
//             return status;
//         },
//         getTime: function(){
//             return time;
//         },
//         reset: function(){
//             count = 0;
//             status = "idle";
//             time = 0;
//         }
//     }
// }

// const task1 = createTask("Load Users");
// const task2 = createTask("Load Posts");

// task1.run();
// task1.run();
// task2.run();

// console.log(task1.getCount());
// console.log(task2.getCount());
// console.log(task1.getStatus());
// console.log(task1.getName());
// console.log(task1.count);
// task1.reset();
// console.log(task1.getCount());
// console.log(task1.getStatus());

// ----------------------------------------4

// console.log("start");


// setTimeout(function(){
//     console.log("timeout 0");
// }, 0);


// setTimeout(function(){
//     console.log("timeout 1000");
// }, 1000);



// console.log("end");

// function delayedHello(name, ms){
//     setTimeout(function(){
//         console.log("Hello " + name);
//     }, ms)
// }

// delayedHello("Birzhan", 500);
// delayedHello("Birzhan2", 1500);

// setTimeout(delayedHello("Test", 100), 1000);

// -------------------------5

// function flipCoin(){
//     return new Promise(function(resolve, reject){
//         setTimeout(function(){
//             if (Math.random() < 0.5){
//                 resolve("Heads");
//             }
//             else{
//                 reject("tails");
//             }
//         }, 1000);
//     });
// }

// flipCoin()
//     .then(function(result){
//         console.log("Success: " + result);
//     })
//     .catch(function(error){
//         console.log("Error: " + error);
//     })
//     .finally(function(){
//         console.log("Done");
//     });

// console.log("Coin flipped");


// function loadData(){
//     return new Promise(function(resolve, reject){
//         setTimeout(function(){
//             let a = Math.random();
//             if (a < 0.3){
//                 console.log(a);
//                 reject("Failed");
//             }
//             else{
//                 console.log(a);
//                 resolve("Completed");
//             }
//         }, 1000)
//     });
// }

// loadData()
//     .then(function(result){
//         console.log("Success: " + result);
//     })
//     .catch(function(error){
//         console.log("Error: " + error);
//     })
//     .finally(function(){
//         console.log("Done");
//     });

// console.log("Started");

// console.log(loadData());

// -------------------------------------------------6

// async function runSequential() {
//     const start = Date.now();
//     try {
//         const result = await loadData();
//         console.log("Result: " + result);
//     }
//     catch (error){
//         console.log("Error: " + error)
//     }
//     try {
//         const result2 = await loadData();
//         console.log("Result2: " + result2);
//     }
//     catch (error){
//         console.log("Error: " + error)
//     }
//     try {
//         const result3 = await loadData();
//         console.log("Result3: " + result3);
//     }
//     catch (error){
//         console.log("Error: " + error)
//     }
//     console.log(Date.now() - start + " ms");
// }

// runSequential();

// async function runConcurrent(){
//     const start = Date.now();
//     const result = await Promise.allSettled([loadData(), loadData(), loadData()]);
//     console.log(result);
//     console.log(Date.now() - start + " ms")
// }

// runConcurrent();

function sayHi(){
    const hai = document.getElementById("output");
    hai.textContent = "Button clicked";


}

// document.getElementById("my-button").addEventListener("click", sayHi);


function showList(){
    let html = "";
    for (let i = 1; i < 4; i++){
        html += "<p>Task " + i + "</p>";
    }
    document.getElementById("list").innerHTML = html;
}

showList();


document.getElementById("my-button").addEventListener("click", sayHi);
