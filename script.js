const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    controlPanel: null,
    keys: [],
    audioContainer: [
      Key0 = new Audio('assets/Sounds/0.mp3'),
      Key1 = new Audio('assets/Sounds/1.mp3'),
      Key2 = new Audio('assets/Sounds/2.mp3'),
      Key3 = new Audio('assets/Sounds/3.mp3'),
      Key4 = new Audio('assets/Sounds/4.mp3'),
      Key5 = new Audio('assets/Sounds/5.mp3'),
      Key0Ru = new Audio('assets/Sounds/6.mp3'),
      Key1Ru = new Audio('assets/Sounds/7.mp3'),
      Key2Ru = new Audio('assets/Sounds/8.mp3'),
      Key3Ru = new Audio('assets/Sounds/9.mp3'),
      Key4Ru = new Audio('assets/Sounds/10.mp3'),
      Key5Ru = new Audio('assets/Sounds/11.mp3'),
      Spec0 = new Audio('assets/Sounds/12.mp3'),
      Spec1 = new Audio('assets/Sounds/13.mp3'),
      Spec2 = new Audio('assets/Sounds/14.mp3'),
      Spec3 = new Audio('assets/Sounds/15.mp3'),
      Spec4 = new Audio('assets/Sounds/16.mp3'),
      Spec0Ru = new Audio('assets/Sounds/17.mp3'),
      Spec1Ru = new Audio('assets/Sounds/18.mp3'),
      Spec2Ru = new Audio('assets/Sounds/19.mp3'),
      Spec3Ru = new Audio('assets/Sounds/20.mp3'),
      Spec4Ru = new Audio('assets/Sounds/21.mp3'),
      
      
    ]
  },
  shiftSwitcher: {
    "1" : "!",
    "2" : "@",
    "3" : "#",
    "4" : "$",
    "5" : "%",
    "6" : "^",
    "7" : "&",
    "8" : "*",
    "9" : "(",
    "0" : ")",
    "," : "<",
    "?" : "/",
    "." : ">",
    "!" : "1",
    "@" : "2",
    "#" : "3",
    "$" : "4",
    "%" : "5",
    "^" : "6",
    "&" : "7",
    "*" : "8",
    "(" : "9",
    ")" : "0",
    "<" : ",",
    ">" : ".",
    "/" : "?"
  },
  shiftSwitcherRu: {
    "1" : "!",
    "2" : "\"",
    "3" : "№",
    "4" : ";",
    "5" : "%",
    "6" : ":",
    "7" : "?",
    "8" : "*",
    "9" : "(",
    "0" : ")",
    "!" : "1",
    "\"" : "2",
    "№" : "3",
    ";" : "4",
    "%" : "5",
    ":" : "6",
    "?" : "7",
    "*" : "8",
    "(" : "9",
    ")" : "0",
    "." : ",",
    "," : "."
  },
  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    secondValue: "",
    capsLock: false,
    shift: false,
    langRu : false,
    sound: true,
    cursorPos : 0
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    this.elements.controlPanel = document.querySelector(".keyboard-cp");
    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    // Add to DOM
    this.elements.main.appendChild(this.elements.controlPanel);
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
    soundControl = this.elements.controlPanel.querySelector(".sounds-controll");
    soundControl.addEventListener("click", ()=>{
      this.properties.sound = !this.properties.sound;
      soundControl.classList.toggle("keyboard-cp__element__active");
    });
    hideControl = this.elements.controlPanel.querySelector(".hide");
    hideControl.addEventListener("click", ()=>{
      this.close();
    });
    speechRecognitionControl = this.elements.controlPanel.querySelector(".speech-recog");
    speechRecognitionControl.addEventListener("click", ()=>{
      speechRecognitionControl.classList.toggle("keyboard-cp__element__active");
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
      recognition.lang = Keyboard.properties.langRu?"ru-RU":"en-US";
      recognition.start();
      recognition.onresult = function(event) {
      if (event.results.length > 0) {
      let recognishedText = event.results[0][0].transcript;
      Keyboard.properties.value += recognishedText;
      Keyboard.properties.cursorPos = Keyboard.properties.value.length;
      speechRecognitionControl.classList.toggle("keyboard-cp__element__active");
      Keyboard._triggerEvent("oninput");
      }
      };
    });

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(this.properties.value, currentValue => {
          element.selectionStart = element.selectionEnd = this.properties.cursorPos;
          let container = (this.properties.value+this.properties.secondValue).slice(this.properties.cursorPos);
          this.properties.value = (this.properties.value+this.properties.secondValue).slice(0,(this.properties.cursorPos));
          this.properties.secondValue = container; 
          element.value = this.properties.value+this.properties.secondValue;
          element.focus();
          element.selectionStart = element.selectionEnd = this.properties.cursorPos;
        });
      });
      element.addEventListener("click", () => {
        this.properties.cursorPos=element.selectionStart;
        element.selectionStart = element.selectionEnd = this.properties.cursorPos;
        let container = (this.properties.value+this.properties.secondValue).slice(this.properties.cursorPos);
        this.properties.value = (this.properties.value+this.properties.secondValue).slice(0,(this.properties.cursorPos));
        this.properties.secondValue = container; 
      })
    });
  },
  _toggleChangeLang(){
    this.properties.langRu = !this.properties.langRu;
    this.properties.capslock = false;
    this.properties.shift = false;
    
    var cleaner = document.querySelector(".keyboard__keys"); 
    cleaner.remove();
    var parent = document.querySelector(".keyboard");
    this.elements.keysContainer = document.createElement("div");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    parent.appendChild(this.elements.keysContainer);
  },
  _createKeys() {
    const fragment = document.createDocumentFragment(); 
    const KL = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "EN",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "nav-bef", "space" , "nav-aft"
    ];
    const KLRU = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х", "ъ", "RU",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж","э","enter",
      "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
      "nav-bef", "space" , "nav-aft"
    ];
    let keyLayout ="";
    if (this.properties.langRu) keyLayout = KLRU;
    else keyLayout = KL;
    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "enter", "?", "RU", "EN"].indexOf(key) !== -1 || (this.properties.langRu && ["."].indexOf(key) !==-1);
      
      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.addEventListener("click", () => {
            if (this.properties.cursorPos > 0) this.properties.cursorPos--;
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            if (this.properties.sound) this.elements.audioContainer[15 + (this.properties.langRu?5:0)].play();     
            this._triggerEvent("oninput");
            keyElement.classList.toggle("keyboard__key__active");
            setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.addEventListener("click", () => {
            if (this.properties.sound) this.elements.audioContainer[14+(this.properties.langRu?5:0)].play();     
               this._toggleCapsLock();   
            keyElement.classList.toggle("keyboard__key__active");
            keyElement.classList.toggle("keyboard__key--active");
            setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
          });
          break;
        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.addEventListener("click", () => {
            this.properties.cursorPos++;
            this.properties.value += "\n";
            this._triggerEvent("oninput");
            if (this.properties.sound) this.elements.audioContainer[13+(this.properties.langRu?5:0)].play();     
               keyElement.classList.toggle("keyboard__key__active");
            setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
          });
          break;
        case "RU":
            keyElement.classList.add("keyboard__key");
            keyElement.textContent = key;
            keyElement.addEventListener("click", () => {
              this._toggleChangeLang();
              keyElement.classList.toggle("keyboard__key__active");
              if (this.properties.sound) this.elements.audioContainer[Math.floor(Math.random()*6)+(this.properties.langRu?5:0)].play();     
              setTimeout(120, keyElement.classList.toggle("keyboard__key__active"));
            });
            if (this.properties.sound) this.elements.audioContainer[12 + (this.properties.langRu?5:0)].play();     
        
            break;
        case "EN":
              keyElement.classList.add("keyboard__key");
              keyElement.textContent = key;
              keyElement.addEventListener("click", () => {
                this._toggleChangeLang();
                keyElement.classList.toggle("keyboard__key__active");
                if (this.properties.sound) this.elements.audioContainer[Math.floor(Math.random()*6)+(this.properties.langRu?5:0)].play();     
                setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
              });
              if (this.properties.sound) this.elements.audioContainer[12 + (this.properties.langRu?5:0)].play();     
        
              break;
        case "nav-bef":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("navigate_before");
            keyElement.addEventListener("click", () => {
              if (this.properties.cursorPos > 0) this.properties.cursorPos--;
              this._triggerEvent("oninput");
              keyElement.classList.toggle("keyboard__key__active");
              if (this.properties.sound) this.elements.audioContainer[Math.floor(Math.random()*6)+(this.properties.langRu?5:0)].play();     
              setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
            });
            break;  
        case "nav-aft":
              keyElement.classList.add("keyboard__key--wide");
              keyElement.innerHTML = createIconHTML("navigate_next");
              keyElement.addEventListener("click", () => {
                if (this.properties.cursorPos < (this.properties.value+this.properties.secondValue).length) this.properties.cursorPos++;
                this._triggerEvent("oninput");
                if (this.properties.sound) this.elements.audioContainer[Math.floor(Math.random()*6)+(this.properties.langRu?5:0)].play();     
                keyElement.classList.toggle("keyboard__key__active");
                setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
              });
              break;  

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.addEventListener("click", () => {
            this.properties.cursorPos++;
            this.properties.value += " ";
            this._triggerEvent("oninput");
            if (this.properties.sound) this.elements.audioContainer[Math.floor(Math.random()*6)+(this.properties.langRu?5:0)].play();     
            keyElement.classList.toggle("keyboard__key__active");
            setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
          });

          break;

        case "Shift":
          keyElement.classList.add("keyboard__key--advwide", "keyboard__key--activatable");
          keyElement.textContent = "Shift";
          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            this._toggleShift();
            if (this.properties.sound) this.elements.audioContainer[11 + (this.properties.langRu?5:0)].play();     
            keyElement.classList.toggle("keyboard__key--active");
            keyElement.classList.toggle("keyboard__key__active");
            setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.properties.cursorPos++;
            this.properties.value += keyElement.innerText;
            this._triggerEvent("oninput");
            if (this.properties.sound) this.elements.audioContainer[Math.floor(Math.random()*6)+(this.properties.langRu?5:0)].play();     
            keyElement.classList.toggle("keyboard__key__active");
            setTimeout(() => {keyElement.classList.toggle("keyboard__key__active")}, 240);
          });

          break;
      }
      fragment.appendChild(keyElement);
      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.textContent.length == 1) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },
  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    let decider;
    if (this.properties.langRu) decider = this.shiftSwitcherRu;
    else decider=this.shiftSwitcher;
    for (const key of this.elements.keys) {
      if (isFinite(key.textContent) 
       || ([",", ".", "?"].indexOf(key.textContent) != -1)
       || isFinite(decider[key.textContent])
       || ([",", ".", "?"].indexOf(decider[key.textContent]) != -1 )) {
        key.textContent = decider[key.textContent];
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};
document.querySelector(".use-keyboard-input").onkeydown  =
document.querySelector(".use-keyboard-input").onkeypress = handle;
function handle(e) {
  let event = new Event("click");
  e.preventDefault();
  document.querySelectorAll(".keyboard__key").forEach(element => { 
    if (element.innerText==e.key) {
      element.dispatchEvent(event);
    }
    if (e.key=="Enter" && element.outerText=="keyboard_return"){
      element.dispatchEvent(event);
    }
    if (e.key=="CapsLock" && element.outerText=="keyboard_capslock"){
      element.dispatchEvent(event);
    }
    if (e.key=="Backspace" && element.outerText=="backspace"){
      element.dispatchEvent(event);
    }
    if (e.key==" " && element.outerText=="space_bar"){
      element.dispatchEvent(event);
    }
    if (e.key=="ArrowRight" && element.outerText=="navigate_next"){
      element.dispatchEvent(event);
    }
    if (e.key=="ArrowLeft" && element.outerText=="navigate_before"){
      element.dispatchEvent(event);
    }
    if ((e.ctrlKey && e.altKey) && (element.innerText=="RU" || element.innerText=="EN")){
      element.dispatchEvent(event);
    }
  })
}
document.querySelector(".use-keyboard-input").onkeyup  = handleUP;
function handleUP(e) {
  let event = new Event("click");
  e.preventDefault();
  document.querySelectorAll(".keyboard__key").forEach(element => { 
    if (e.key=="CapsLock" && element.outerText=="keyboard_capslock"){
      element.dispatchEvent(event);
    }
  })
}
window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
