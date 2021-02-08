// alert("Привет! Не проверяй, пожалуйста, работу, до воскресенья, не успел доделать. Очень прошу! Заранее спасибо за понимание!");

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false
    },

    init() { // initializes the keyboard, after the page loads

        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard-hidden");
        this.elements.keysContainer.classList.add("keyboard-keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard-key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() { // this method creates all the html(design) of the keyboard

        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "shift", "space", "left", "right"
        ];
        const keyLayoutRu = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ]

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
        // Add attributes/classes
        keyElement.setAttribute("type", "button");
        keyElement.classList.add("keyboard-key");

        switch(key) {
            case "backspace":
                keyElement.classList.add("keyboard-key-wide");
                keyElement.innerHTML = createIconHTML("backspace");
                keyElement.addEventListener("click", () => {
                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                this._triggerEvent("oninput");
                });

                break;

            case "caps":
                keyElement.classList.add("keyboard-key-wide", "keyboard-key_activatable");
                keyElement.innerHTML = createIconHTML("keyboard_capslock");
                keyElement.addEventListener("click", () => {
                this._toggleCapsLock();
                keyElement.classList.toggle("keyboard-key_active", this.properties.capsLock);
                });

                break;

            case "enter":
                keyElement.classList.add("keyboard-key-wide");
                keyElement.innerHTML = createIconHTML("keyboard_return");
                keyElement.addEventListener("click", () => {
                this.properties.value += "\n";
                this._triggerEvent("oninput");
                });

                break;

            case "space":
                keyElement.classList.add("keyboard-key-extra-wide");
                keyElement.innerHTML = createIconHTML("space_bar");
                keyElement.addEventListener("click", () => {
                this.properties.value += " ";
                this._triggerEvent("oninput");
                });

                break;
            case "done":
                keyElement.classList.add("keyboard-key-wide", "keyboard-key-dark");
                keyElement.innerHTML = createIconHTML("check_circle");
                keyElement.addEventListener("click", () => {
                this.close();
                this._triggerEvent("onclose");
                document.querySelector(".use-keyboard-input").onblur = null;
                });

                break;

                case "left":
                    keyElement.classList.add("keyboard-key-wide");
                    keyElement.innerHTML = '&#8592;' + createIconHTML('')
                    keyElement.addEventListener("click", () => {
                    let position = this.getPosition()
                      this.move(+position - 1);
                      position--
                      this._triggerEvent("oninput");
                    });

                    break;

                  case "right":
                  keyElement.classList.add("keyboard-key-wide");
                  keyElement.innerHTML = '&#8594;' + createIconHTML('')
                  keyElement.addEventListener("click", () => {
                  let position = this.getPosition()
                    this.move(+position + 1);
                    position--
                    this._triggerEvent("oninput");
                  });

                  break;

            case "shift":
                keyElement.classList.add("keyboard-key-wide", "keyboard-key_activatable");
                keyElement.innerHTML = createIconHTML("arrow_upward") + 'Sh';
                keyElement.addEventListener("click", () => {
                this._toggleCapsLock1();
                keyElement.classList.toggle("keyboard-key_active", this.properties.capsLock);
                });
                break;

            default:
                keyElement.textContent = key.toLowerCase();

                keyElement.addEventListener("click", () => {
                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
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
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleCapsLock1() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    getPosition() {
        let objCursor = document.querySelector("body > textarea");
        objCursor.focus();
        if (objCursor.selectionStart) return objCursor.selectionStart;
        else if (document.selection) {
          this.sel = document.selection.createRange();
          this.clone = sel.duplicate();
          this.sel.collapse(true);
          this.clone.moveToElementText(objCursor);
          this.clone.setEndPoint("EndToEnd", sel);
          return this.clone.text.length;
        }

        return 0;
      },

      move(n) {
        let moveText = document.querySelector("body > textarea");

        if (!document.all) {
          let end = moveText.value.length;
          moveText.setSelectionRange(n, n);
          moveText.focus();
        } else {
          let r = moveText.createTextRange();
          r.collapse(true);
          r.moveStart("character", n);
          r.moveEnd("character", 0);
          r.select();
        }
      },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard-hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard-hidden");
    }

};

window.addEventListener("DOMContentLoaded", function (){
    Keyboard.init();
});
