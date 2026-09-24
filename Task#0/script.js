const log = (id, ...args) => {
  const el = document.getElementById(id);
  const text = args.map(a => typeof a === "string" ? a : JSON.stringify(a, null, 2)).join("\n");
  el.textContent += (el.textContent ? "\n\n" : "") + text;
  console.log(...args);
};

/*  1. Variables and Data Types  */
{
  const name = "Birzhan";
  let age = 20;
  const isActive = true;
  const courses = ["Algorithms", "Web Dev", "React"];
  const address = { city: "Almaty", street: "Shevchenko" };
  const middleName = null;     
  let scholarship;              

  log("out1", "name:", name, typeof name);
  log("out1", "age:", age, typeof age);
  log("out1", "isActive:", isActive, typeof isActive);
  log("out1", "courses:", courses, typeof courses);
  log("out1", "address:", address, typeof address);
  log("out1", "middleName (null):", middleName, typeof middleName);
  log("out1", "scholarship (undefined):", scholarship, typeof scholarship);
  log("out1", "primitive values: name, age, isActive, middleName, scholarship");
  log("out1", "reference values: courses, address");
  log("out1", `sentence: ${name} is ${age} years old and lives in ${address.city}.`);
}

/*  2. Arrays  */
{
  const numbers = [3, 7, 2, 10, 5];

  const doubled = numbers.map(n => n * 2);
  const above5 = numbers.filter(n => n > 5);
  const firstAbove5 = numbers.find(n => n > 5);
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  const has10 = numbers.includes(10);

  log("out2", "original:", numbers);
  log("out2", "doubled:", doubled);
  log("out2", "above5:", above5);
  log("out2", "firstAbove5:", firstAbove5);
  log("out2", "sum:", sum);
  log("out2", "has10:", has10);
  log("out2", "original unchanged:", numbers);
}

/*  3. Arrays of Objects  */
{
  const students3 = [
    { id: 1, name: "Ronaldo", grade: 85 },
    { id: 2, name: "Messi", grade: 62 },
    { id: 3, name: "Salah", grade: 91 },
    { id: 4, name: "Birzhan", grade: 55 },
  ];

  const passing = students3.filter(s => s.grade >= 70);
  const names3 = students3.map(s => s.name);
  const byId3 = students3.find(s => s.id === 3);
  const topStudent3 = students3.reduce((best, s) => (s.grade > best.grade ? s : best));
  const avgGrade3 = students3.reduce((acc, s) => acc + s.grade, 0) / students3.length;
  const withPassed = students3.map(s => ({ ...s, passed: s.grade >= 60 }));

  log("out3", "passing (>=70):", passing);
  log("out3", "names:", names3);
  log("out3", "student with id=3:", byId3);
  log("out3", "top student:", topStudent3);
  log("out3", "average grade:", avgGrade3);
  log("out3", "with passed flag:", withPassed);
  log("out3", "original students unchanged:", students3);
}

/*  4. Objects  */
{
  const user4 = {
    id: 1,
    name: "Birzhan",
    age: 22,
    address: { city: "Almaty", street: "Shevchenko" },
  };

  log("out4", "name:", user4.name, "city:", user4.address.city);

  user4.age = 23;
  log("out4", "age changed:", user4.age);

  user4.email = "birzhan@example.com";
  log("out4", "email added:", user4.email);

  delete user4.address.street;
  log("out4", "street removed:", user4.address);

  const { name: destructName, age: destructAge } = user4;
  log("out4", "destructured name/age:", destructName, destructAge);

  const { address: { city: destructCity } } = user4;
  log("out4", "nested destructured city:", destructCity);

  const { name: userName } = user4;
  log("out4", "renamed destructure (userName):", userName);
}

/*  5. Values and References  */
{
  const original = { name: "Thiago", score: 10 };
  const copy = original;
  copy.score = 99;
  log("out5", "copy = original (same reference):");
  log("out5", "original.score after changing copy:", original.score, "(changed too!)");

  const original2 = { name: "Thiago", score: 10 };
  const spreadCopy = { ...original2 };
  spreadCopy.score = 99;
  log("out5", "spread copy: original2.score:", original2.score, "spreadCopy.score:", spreadCopy.score);

  const user5 = { name: "Thiago", address: { city: "Almaty" } };
  const shallowCopy = { ...user5 };
  shallowCopy.address.city = "Astana";
  log("out5", "shallow copy: original city:", user5.address.city, "(also changed — nested object shared)");

  const user5b = { name: "Thiago", address: { city: "Almaty" } };
  const deepCopy = { ...user5b, address: { ...user5b.address } };
  deepCopy.address.city = "Astana";
  log("out5", "deep copy fix: original city:", user5b.address.city, "deepCopy city:", deepCopy.address.city);
}

/*  6. Functions  */
{
  function isEven(number) { return number % 2 === 0; }
  const isEvenArrow = number => number % 2 === 0;

  function getFullName(firstName, lastName) { return `${firstName} ${lastName}`; }
  const calculatePrice = (price, quantity) => price * quantity;
  const calculateDiscount = (price, percent) => price - (price * percent) / 100;
  const getMax = (a, b) => (a > b ? a : b);

  log("out6", "isEven(4):", isEven(4), "| arrow isEven(5):", isEvenArrow(5));
  log("out6", "getFullName:", getFullName("Birzhan", "Orynbasar"));
  log("out6", "calculatePrice(100, 3):", calculatePrice(100, 3));
  log("out6", "calculateDiscount(1000, 20):", calculateDiscount(1000, 20));
  log("out6", "getMax(7, 12):", getMax(7, 12));
}

/*  7. Functions as Values  */
{
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  const calculate = (a, b, operation) => operation(a, b);

  log("out7", "calculate(5,3,add):", calculate(5, 3, add));
  log("out7", "calculate(5,3,multiply):", calculate(5, 3, multiply));
}

/*  8. Scope  */
{
  const message = "global";

  function scopeDemo() {
    let message = "function";
    log("out8", "inside function, before block:", message);

    if (true) {
      let message = "block";
      log("out8", "inside block:", message);
    }
    log("out8", "inside function, after block:", message);
  }
  scopeDemo();
  log("out8", "global message:", message);

  if (true) {
    var varInBlock = "I leak out of the block";
    let letInBlock = "I stay in the block";
  }
  log("out8", "var accessible outside block:", varInBlock);
  try {
    log("out8", "let outside block:", letInBlock);
  } catch (e) {
    log("out8", "let is NOT accessible outside block (ReferenceError)");
  }
}

/*  9. Closure  */
{
  function createCounter() {
    let count = 0;
    return function () {
      count += 1;
      return count;
    };
  }

  const counterA = createCounter();
  log("out9", "counterA():", counterA());
  log("out9", "counterA():", counterA());
  log("out9", "counterA():", counterA());

  const counterB = createCounter();
  log("out9", "counterB() (independent state):", counterB());

  function createAdder(value) {
    return function (n) { return n + value; };
  }
  const addFive = createAdder(5);
  log("out9", "addFive(10):", addFive(10));
  log("out9", "addFive(20):", addFive(20));
}

/*  10. Destructuring, Spread and Rest  */
{
  const numbers10 = [10, 20, 30, 40];
  const [first10, second10] = numbers10;
  log("out10", "first two:", first10, second10);

  const user10 = { id: 1, name: "Ronaldo", age: 21 };
  const { name: name10, age: age10 } = user10;
  log("out10", "destructured name/age:", name10, age10);

  const numbersWith50 = [...numbers10, 50];
  log("out10", "numbers + 50 (new array):", numbersWith50, "| original untouched:", numbers10);

  const olderUser = { ...user10, age: 22 };
  log("out10", "new user with age 22:", olderUser, "| original untouched:", user10);

  const userWithEmail = { ...user10, email: "ronaldo@example.com" };
  log("out10", "user with email (original untouched):", userWithEmail, user10);

  const combined = [...numbers10, ...[1, 2, 3]];
  log("out10", "combined arrays:", combined);

  function sum10(...nums) { return nums.reduce((acc, n) => acc + n, 0); }
  log("out10", "sum(1,2):", sum10(1, 2), "| sum(1,2,3,4):", sum10(1, 2, 3, 4));
}

/*  11. Optional Chaining and Nullish Coalescing  */
{
  const userWithAddress = { name: "Ronaldo", address: { city: "Almaty" } };
  const userNoAddress = { name: "Messi" };

  try {
    log("out11", "direct access (has address):", userWithAddress.address.city);
    log("out11", "direct access (no address):", userNoAddress.address.city);
  } catch (e) {
    log("out11", "direct access without optional chaining throws:", e.message);
  }

  log("out11", "optional chaining (has address):", userWithAddress.address?.city);
  log("out11", "optional chaining (no address):", userNoAddress.address?.city);
  log("out11", "nullish coalescing fallback:", userNoAddress.address?.city ?? "City not specified");

  const values11 = [0, "", false, null, undefined];
  values11.forEach(v => {
    log("out11", `value: ${JSON.stringify(v)} | v || 'default':`, v || "default", `| v ?? 'default':`, v ?? "default");
  });
  log("out11", "Note: || replaces ANY falsy value (0, '', false included), ?? only replaces null/undefined.");
}

/*  12. Final Task  */
{
  const students = [
    { id: 1, name: "Ronaldo", age: 20, grades: [85, 90, 78] },
    { id: 2, name: "Messi", age: 21, grades: [60, 55, 50] },
    { id: 3, name: "Salah", age: 22, grades: [91, 95, 89] },
    { id: 4, name: "Birzhan", age: 20, grades: [40, 55, 60] },
    { id: 5, name: "Dana", age: 23, grades: [70, 65, 72] },
  ];

  const getAverage = (grades) => grades.reduce((acc, g) => acc + g, 0) / grades.length;
  const getStudentAverage = (student) => getAverage(student.grades);
  const getPassedStudents = (list) => list.filter(s => getStudentAverage(s) >= 60);
  const getStudentNames = (list) => list.map(s => s.name);
  const findStudent = (list, id) => list.find(s => s.id === id);
  const getTopStudent = (list) => list.reduce((best, s) =>
    getStudentAverage(s) > getStudentAverage(best) ? s : best
  );

  log("outFinal", "average grades of Ronaldo:", getStudentAverage(students[0]));
  log("outFinal", "passed students:", getStudentNames(getPassedStudents(students)));
  log("outFinal", "all student names:", getStudentNames(students));
  log("outFinal", "find student id=3:", findStudent(students, 3));
  log("outFinal", "top student:", getTopStudent(students).name);

  const report = students.map(s => ({
    id: s.id,
    name: s.name,
    average: Number(getStudentAverage(s).toFixed(2)),
    passed: getStudentAverage(s) >= 60,
  }));
  log("outFinal", "final report:", report);
  log("outFinal", "original students unchanged:", students);
}