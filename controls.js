class Controls {
    constructor(type) {
        this.keys = new Set(); 
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type){
            case "KEYS":
                this.#addKeyBoardListeners();
                break;
            case "NPC":
                this.forward = true;
                break;
        }

        
    }

    #updateKeyState(key, isPressed) {
        switch (key) {
            case "ArrowLeft":
                this.left = isPressed;
                break;
            case "ArrowRight":
                this.right = isPressed;
                break;
            case "ArrowUp":
                this.forward = isPressed;
                break;
            case "ArrowDown":
                this.reverse = isPressed;
                break;
        }
    }

    #addKeyBoardListeners() {
        document.onkeydown = (event) => {
            if (!this.keys.has(event.key)) { 
                this.keys.add(event.key);
                this.#updateKeyState(event.key, true);
                console.table(this); 
            }
        }

        document.onkeyup = (event) => {
            if (this.keys.has(event.key)) {
                this.keys.delete(event.key);
                this.#updateKeyState(event.key, false);
                console.table(this); 
            }
        }
    }
}
