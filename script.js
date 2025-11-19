const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const modeBtn = document.getElementById("modeBtn");
const body = document.getElementById("body");

let current = "";

// Tombol kalkulator
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");

        if (key === "C") {
            current = "";
            display.textContent = "0";
            gsap.fromTo(display, {scale:1.1}, {scale:1, duration:0.2});
            return;
        }

        if (key === "=") {
            try {
                current = eval(current).toString();
                display.textContent = current;
                gsap.fromTo(display, {scale:1.2}, {scale:1, duration:0.2});
            } catch {
                display.textContent = "Error";
            }
            return;
        }

        current += key;
        display.textContent = current;
    });
});

// Mode siang/malam
modeBtn.addEventListener("click", () => {
    body.classList.toggle("light");

    if (body.classList.contains("light-mode")) {
        modeBtn.textContent = "🌞 Mode Siang";
    } else {
        modeBtn.textContent = "🌙 Mode Malam";
    }

    gsap.fromTo(body, {opacity:0.7}, {opacity:1, duration:0.3});
});
