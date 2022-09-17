'use strict';
class Manatsu {
    #element; // <string>
    #options; // <object>
    #style; // <object>

    constructor(element, options, style) {
        this.#element = element;
        this.#options = options;
        this.#style = style;
    };

    #create() {
        if (typeof this.#element !== 'string') throw new SyntaxError('\"element\" must be a string.');

        const newElement = document.createElement(this.#element);
        
        if (this.#options) {
            for (const key in this.#options) {
                if (typeof key !== 'string') throw new SyntaxError('value must be a string.');
                if (typeof this.#options[key] !== 'string') throw new SyntaxError('value must be a string.');
    
                switch (key) {
                    case 'text': newElement.innerText = this.#options[key];
                        break;
                    case 'html': newElement.innerHTML = this.#options[key];
                        break;
                    case 'content': newElement.textContent = this.#options[key];
                        break;
    
                    default: newElement.setAttribute(key, this.#options[key]);
                };
            };
        };

        return newElement;
    };

    //////// STATIC
    // Remove todos os filhos de um dado elemento.
    static #removeChildren(element) {
        while (element.firstChild) element.removeChild(element.firstChild);
    };

    //////// GETTERS
    get create() {return this.#create};

    static get removeChildren() {return this.#removeChildren};
};