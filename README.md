# Manatsu

```javascript
new Manatsu([element, parent, options])
```

- **element**: string - Define o tipo do elemento. Padrão: `div`.
- **parent**: HTMLElement
- **options**: Object - Lista com os atributos do elemento.

```javascript
const anotherElement = document.querySelector('#myDiv')
const myElement = new Manatsu('input', anotherElement, {
    id: 'myInput',
    class: 'textInput',
    type: 'text'
})
```

Cria um objeto representando o elemento HTML desejado. Todos os parâmetros são opcionais. Caso um parâmetro de determinado tipo for fornecido mais de uma vez, apenas a última ocorrência é considerada.

Para atribuir `textContent` deve-se adicionar `text` aos itens escolhidos em `options`. Para `innerText`, usa-se `inner`. Não há suporte para `innerHTML`.

```javascript
const myElement = new Manatsu('span', { text: 'Texto dentro do span.' }).create()
console.log(myElement.textContent) // 'Texto dentro do span.'
```

## Instância

### create()

- **Returns**: HTMLElement

```javascript
const myElement = new Manatsu().create()
```

Cria um elemento a partir do objeto Manatsu.

### createBefore(referenceNode)

- **referenceNode**: HTMLElement - Elemento antes do qual o novo será inserido.
- **Returns**: HTMLElement

```javascript
const parent = document.querySelector('#myDiv')
const referenceNode = document.querySelector('#myParagraph')
const myElement = new Manatsu('h1', parent, { text: 'Olá, Mundo!' })
myElement.createBefore(referenceNode)
```

Cria um elemento a partir do objeto Manatsu e o insere antes do elemento indicado como referência.

O método `createBefore()` só funcionará caso `parent` tenha sido definido no objeto Manatsu.

### addOptions(options[, overwrite])

- **options**: Object - Lista com novos atributos para o elemento.
- **overwrite**: boolean - Determina se os atributos serão sobrescritos caso já existam. Padrão: `true`.
- **Returns**: O próprio objeto.

```javascript
const myElement = new Manatsu()
myElement.addOptions({ class: 'myClass' })
console.log(myElement.options) // 'Object { class: 'myClass' }'

myElement.addOptions({ id: 'myDiv', class: 'anotherClass' }, false)
console.log(myElement.options) // 'Object { id: 'myDiv', class: 'myClass' }'
```

Adiciona novos atributos ao objeto Manatsu.

## Classe - Manatsu

### createAll(array)

- **array**: Manatsu[]
- **Returns**: HTMLElement[]

Cria vários elementos de uma só vez, a partir de uma array de objetos Manatsu. É equivalente a usar `create()` separadamente em cada um dos objetos.

Retorna uma array com todos os elementos criados.

```javascript
const array = [new Manatsu(), new Manatsu(), new Manatsu()]
Manatsu.createAll(array)
```

### fromTemplate(reference[, options])

- **reference**: Manatsu | Element - Objeto Manatsu ou elemento a ser usado como base.
- **options**: Object - Lista com novos atributos para o elemento.
- **Returns**: Manatsu

Cria um objeto Manatsu a partir de outro já existente ou tendo algum elemento como referência.

```javascript
const myElement = new Manatsu('span', { class: 'myClass' })
const anotherElement = Manatsu.fromTemplate(myElement)
```

### repeat([amount, element, parent, options])

- **amount**: number - Quantidade de cópias. Padrão: `1`.
- **element**: string | string[] - Define o tipo do elemento. Padrão: `div`.
- **parent**: HTMLElement
- **options**: Object - Lista com os atributos do elemento.
- **Returns**: Manatsu[]

Cria vários objetos Manatsu a partir dos parâmetros especificados. É possível designar vários tipos diferentes para os elementos, mas apenas um `parent` e um objeto `options`.

Caso vários tipos sejam fornecidos, `repeat()` os atribuirá em ordem. Se a quantidade de cópias desejada for maior que a quantidade de tipos fornecidos, `repeat()` fará normalmente a atribuição em ordem para esses fornecidos e atribuirá `div` ao restante.

```javascript
const anotherElement = document.querySelector('#myDiv')
const elements = ['span', 'p', 'br', 'p', 'br']

const myElements = Manatsu.repeat(6, elements, anotherElement, { class: 'myClass' })

console.log(myElements[0].element) // 'span'
console.log(myElements[1].options) // 'Object { class: 'myClass' }'
console.log(myElements[2].options) // 'Object { class: 'myClass' }'
console.log(myElements[5].element) // 'div'
```

## Classe - Geral

### disableChildren(parent[, selector])

- **parent**: HTMLElement
- **selector**: string - Seletor CSS identificando quais elementos-filho serão alvo.

Adiciona o atributo `disabled` a todos os filhos do elemento indicado. Caso um seletor CSS seja fornecido, adiciona somente aos filhos que o satisfaçam.

### enableChildren(parent[, selector])

- **parent**: HTMLElement
- **selector**: string - Seletor CSS identificando quais elementos-filho serão alvo.

Remove o atributo `disabled` de todos os filhos do elemento indicado. Caso um seletor CSS seja fornecido, remove somente dos filhos que o satisfaçam.

### removeChildren(parent[, selector])

- **parent**: HTMLElement
- **selector**: string - Seletor CSS identificando quais elementos-filho serão alvo.

Remove todos os filhos do elemento indicado. Caso um seletor CSS seja fornecido, remove apenas os filhos que o satisfaçam.

```javascript
const myElement = document.querySelector('#myDiv');
Manatsu.removeChildren(myElement);
```