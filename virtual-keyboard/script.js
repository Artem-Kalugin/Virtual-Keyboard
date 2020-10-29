const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
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
  },
  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    cursorPos: "",
    capsLock: false,
    shift: false,
    langRu : false

  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
     
    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
          element.focus();
        });
      });
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
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active");
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });
          break;
        case "RU":
            keyElement.classList.add("keyboard__key");
            keyElement.textContent = key;
            keyElement.addEventListener("click", () => {
              this._toggleChangeLang();
            });
            break;
        case "EN":
              keyElement.classList.add("keyboard__key");
              keyElement.textContent = key;
              keyElement.addEventListener("click", () => {
                this._toggleChangeLang();
              });
              break;
        case "nav-bef":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("navigate_before");
            keyElement.addEventListener("click", () => {
              this.properties.cursorPos--;
              this._triggerEvent("oninput");
            });
            break;  
        case "nav-aft":
              keyElement.classList.add("keyboard__key--wide");
              keyElement.innerHTML = createIconHTML("navigate_next");
              keyElement.addEventListener("click", () => {
                this.properties.cursorPos++;
                this._triggerEvent("oninput");
              });
              break;  

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });

          break;

        case "Shift":
          keyElement.classList.add("keyboard__key--advwide", "keyboard__key--activatable");
          keyElement.textContent = "Shift";
          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += keyElement.innerText;
            this._triggerEvent("oninput");
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

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});