let screen = document.getElementById("screen");

function display(num) {
  screen.value += num;
}

function del() {
  screen.value = screen.value.slice(0, -1);
}

function C() {
  screen.value = "";
}

function calculate() {
  try {
    screen.value = eval(screen.value);
  } catch {
    alert("Invalid");
  }
}
