# Homework: JavaScript Runtime and Async

A small page with three tasks: Load Users, Load Posts, Load Comments.
Each task "loads" for a random time (500–2000 ms) and sometimes fails.

## 1. Closure and private counter

`createTask(name)` has a variable `count` inside it and returns an object with methods
`run`, `getCount` and `reset`. These methods still remember `count` after `createTask`
has finished. This is called a closure.

`count` is not inside the returned object, so `task.count` is `undefined`.
You can only use it through `getCount()` and `reset()`.

Each call to `createTask` creates a new `count`, so every task has its own counter.

## 2. Call stack example

When I click "Run All Tasks":

1. `runAll` goes onto the call stack.
2. It calls `runTask(task1)`, which goes on top.
3. `runTask` calls `task1.run()`. It starts a timer and returns a Promise, then leaves the stack.
4. `runTask` calls `render()`, then leaves the stack.
5. The same happens for `task2` and `task3`.
6. `runAll` leaves the stack. The stack is empty.

The last function that was called finishes first (Last In, First Out).

## 3. How JavaScript continues while setTimeout is waiting

`setTimeout` is handled by the browser, not by JavaScript itself.
JavaScript starts the timer and goes to the next line right away.
When the timer ends, its callback goes to the task queue.
The event loop runs it when the call stack is empty.

## 4. Event Loop demo

My code:

```js
log("script start");
setTimeout(() => log("timeout 1"), 0);
Promise.resolve().then(() => log("promise 1"));
async function demoAsync() {
  log("async function start");
  await null;
  log("after await");
}
demoAsync();
setTimeout(() => log("timeout 2"), 0);
Promise.resolve().then(() => log("promise 2"));
log("script end");
```

Predicted output:

```
script start
async function start
script end
promise 1
after await
promise 2
timeout 1
timeout 2
```

Actual output:

```
script start
async function start
script end
promise 1
after await
promise 2
timeout 1
timeout 2
```

Why:

1. **Call Stack:** normal code runs first: `script start`, `async function start`
   (async function runs until `await`), `script end`.
2. **Microtask Queue:** then all Promise callbacks and code after `await`:
   `promise 1`, `after await`, `promise 2`.
3. **Task Queue:** timers go last: `timeout 1`, `timeout 2`.
4. **Event Loop:** it waits until the stack is empty, runs all microtasks,
   and only then takes the next task.

## 5. Tasks vs microtasks

- **Tasks:** `setTimeout`, `setInterval`, clicks.
- **Microtasks:** `.then`, `.catch`, `.finally`, code after `await`.

After each task, the event loop runs all microtasks first. That is why Promises run
before timers, even when the timer is 0 ms.

## 6. Multiple Promises and errors

- `task.run()` returns a Promise: `resolve` if it worked, `reject` if it failed.
- `runTask` uses `.then` for success, `.catch` for errors and `.finally` to update the page.
  Because `.catch` handles the error, one failed task does not break the others.
- "Run All Tasks" uses `Promise.allSettled`. It waits for all tasks, and only then
  shows "All tasks finished".

## 7. Sequential vs concurrent

Sequential:

```js
await runTask(task1);
await runTask(task2);
await runTask(task3);
```

The next task starts only after the previous one ends.
Total time ≈ sum of all tasks (for example 900 + 1500 + 1200 = 3600 ms).

Concurrent:

```js
await Promise.allSettled([runTask(task1), runTask(task2), runTask(task3)]);
```

All tasks start at the same time.
Total time ≈ the longest task (for example 1500 ms).

I measure time with `Date.now()` before and after. Concurrent is faster because
all timers wait at the same time.