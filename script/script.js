// footer wave js
const wave1 =
    "M0 108.306L50 114.323C100 120.34 200 132.374 300 168.476C400 204.578 500 264.749 600 246.698C700 228.647 800 132.374 900 108.306C1000 84.2382 1100 132.374 1150 156.442L1200 180.51V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V108.306Z",
  wave2 =
    "M0 250L50 244.048C100 238.095 200 226.19 300 226.19C400 226.19 500 238.095 600 232.143C700 226.19 800 202.381 900 196.429C1000 190.476 1100 202.381 1150 208.333L1200 214.286V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V250Z",
  wave3 =
    "M0 250L50 238.095C100 226.19 200 202.381 300 166.667C400 130.952 500 83.3333 600 101.19C700 119.048 800 202.381 900 214.286C1000 226.19 1100 166.667 1150 136.905L1200 107.143V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V250Z",
  wave4 =
    "M0 125L50 111.111C100 97.2222 200 69.4444 300 97.2222C400 125 500 208.333 600 236.111C700 263.889 800 236.111 900 229.167C1000 222.222 1100 236.111 1150 243.056L1200 250V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V125Z";

anime({
  targets: ".wave-top > path",
  easing: "linear",
  duration: 12000,
  loop: true,
  d: [
    { value: [wave1, wave2] },
    { value: wave3 },
    { value: wave4 },
    { value: wave1 },
  ],
});

// clock js
const container = document.querySelector(".clock-container");
const containerHeight = Math.round(container.getBoundingClientRect().height);

function addSVGTicks() {
  const strokeWidth = 10;
  const stroke = "black";
  const xmlns = "http://www.w3.org/2000/svg";
  const svgElem = document.createElementNS(xmlns, "svg");
  svgElem.setAttributeNS(null, "height", containerHeight);

  const g = document.createElementNS(xmlns, "g");
  const svgFrag = new DocumentFragment();

  Math.times(12, (i) => {
    const tick = document.createElementNS(xmlns, "path");
    tick.setAttributeNS(null, "width", "5");
    tick.classList = `.tick .tick--${i}`;
    tick.setAttributeNS(null, "height", containerHeight / 2);
    // tick.setAttributeNS(null, "viewBox", 'm 0 0 l 0 100');
    tick.setAttributeNS(null, "d", "m 0 0 l 0 50");
    tick.setAttributeNS(null, "stroke-width", strokeWidth);
    tick.setAttributeNS(null, "stroke", stroke);
    // tick.setAttributeNS(null, "transform", `rotate(30deg)`);
    svgFrag.appendChild(tick);
  });

  g.appendChild(svgFrag);
  svgElem.appendChild(g);
  container.appendChild(svgElem);
}

const now = new Date();
let secs = now.getSeconds();
let mins = now.getMinutes();
let hours = now.getHours();

let secRotate = Math.round((secs / 60) * 360);
let bigRotate = Math.round((mins / 60) * 360 + (6 * secs) / 60);
let smallRotate = Math.round((hours % 12) * 30 + (30 * mins) / 60);

// let secRotate = 6;
// let smallRotate = 30 + 6 * Math.random(50);
// let bigRotate = 30 + 6 * Math.random(50);

////////ANIME JS

function handleSec() {
  anime({
    targets: ".sec-hand",
    duration: 300,
    delay: 700,
    translateX: -0.75,
    rotate: () => (secRotate += 6),
    easeing: "spring(0, 90, 10, 10)",
    complete: handleSec,
  });
}

function handleBig(start = 0) {
  anime({
    targets: ".big-hand",
    duration: ((60 - mins) * 60 - secs) * 1000,
    translateX: -1.5,
    easing: "linear",
    rotate: [start, 360],
    complete: (target) => {
      mins = 0;
      secs = 0;
      handleBig(0);
    },
  });
}

function handleSmall(start = 0) {
  anime({
    targets: ".small-hand",
    duration: (60 - mins) * 60 * 1000,
    rotate: [start, start + (start % 30)],
    translateX: -2,
    easing: "linear",
    complete: (target) => {
      handleSmall(start + 30);
    },
  });
}
function handleSecGSAP() {
  return gsap.to(".sec-hand", {
    duration: 0.35,
    delay: 0.65,
    // delay: 700,
    // translateX: -0.75,
    rotation: () => (secRotate += 6),
    ease: "elastic.out(1, 0.4)", // "back.out(2.4)",
    onComplete: handleSecGSAP,
  });
}

function handleBigGSAP(start = 0) {
  gsap.fromTo(
    ".big-hand",
    {
      rotation: start,
    },
    {
      duration: (60 - mins) * 60 - secs,
      ease: "linear",
      rotation: 360,
      onComplete: () => {
        mins = 0;
        secs = 0;
        handleBigGSAP();
      },
    }
  );
}

function handleSmallGSAP(start = 0) {
  return gsap.fromTo(
    ".big-hand",
    {
      rotation: start,
    },
    {
      duration: (60 - mins) * 60 - secs,
      ease: "linear",
      rotation: 360,
      onComplete: () => {
        hours = (hours + 1) % 12;
        smallRotate = hours * 30;
        handleSmallGSAP(smallRotate);
      },
    }
  );
}

function tiktok() {
  const timeline = gsap.timeline({ timeScale: 2 });
  gsap.set(".sec-hand", {
    rotation: secRotate,
  });
  gsap.set(".small-hand", {
    rotation: smallRotate,
  });
  gsap.set(".big-hand", {
    rotation: bigRotate,
  });

  timeline.add(handleSecGSAP());
  timeline.add(handleBigGSAP(bigRotate), "<");
  timeline.add(handleSmallGSAP(smallRotate), "<");

  timeline.timeScale(2);
  // handleSmallGSAP(smallRotate);
}

const tickingTimeline = tiktok();

// click anywhere
const shape = new mojs.Burst({
  radius: { 0: 50 },
  angle: "rand(0, 360)",
  count: 5,
  top: 0,
  left: 0,
  children: {
    shape: "polygon",
    fill: ["#6e07f3", "#32caa9", "#b375f5", "#13ceef", "#ffef77"],
    radius: 15,
    angle: { 0: 360 },
    duration: 750,
  },
});

document.addEventListener("click", (e) => {
  shape.tune({ x: e.pageX, y: e.pageY }).generate().replay();
});

// cutom cursor
var cursor = document.querySelector(".cursor");
var cursorinner = document.querySelector(".cursor2");
var a = document.querySelectorAll("a");

document.addEventListener("mousemove", function (e) {
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
});

document.addEventListener("mousemove", function (e) {
  var x = e.clientX;
  var y = e.clientY;
  cursorinner.style.left = x + "px";
  cursorinner.style.top = y + "px";
});

document.addEventListener("mousedown", function () {
  cursor.classList.add("click");
  cursorinner.classList.add("cursorinnerhover");
});

document.addEventListener("mouseup", function () {
  cursor.classList.remove("click");
  cursorinner.classList.remove("cursorinnerhover");
});

a.forEach((item) => {
  item.addEventListener("mouseover", () => {
    cursor.classList.add("hover");
  });
  item.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover");
  });
});

// initialization of tooltip
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// custom faqs

const faqsQuestion = $(".faqs__list .faq__item .faq__question");
const faqsAnswers = $(".faqs__list .faq__item  .faq__content");
faqsQuestion.each(function () {
  $(this).click(function (e) {
    e.preventDefault();
    const targetId = $(this).data("target");
    $(`#${targetId}`).slideToggle();
    if ($(`#${targetId}`).css("display") === "block") {
      $(`#${targetId}`)
        .closest(".faq__item")
        .find(".icon-wrapper")
        .html('<i class="bi bi-chevron-up"></i>');
    } else {
      $(`#${targetId}`)
        .closest(".faq__item")
        .find(".icon-wrapper")
        .html('<i class="bi bi-chevron-down"></i>');
    }
  });
});

// custom testimonials

const testimonyPerson = $(".testimony-user__image-list .testimony-user__image");
const testimonyContent = $(".testimony-content__list .testimony-content__item");

testimonyPerson.each(function () {
  $(this).click(function () {
    const targetId = $(this).data("target");
    testimonyPerson.removeClass("active");
    testimonyContent.removeClass("show");
    $(this).addClass("active");
    $(`#${targetId}`).addClass("show");
  });
});
