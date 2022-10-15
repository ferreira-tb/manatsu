# Manatsu

- [Construtor](#construtor)
- Instância
    - [Manatsu.prototype.addOptions()](#addoptionsoptions-overwrite)
    - [Manatsu.prototype.create()](#create)
    - [Manatsu.prototype.createBefore()](#createbeforereferencenode)
    - [Manatsu.prototype.createInside()](#createinsideelement-parent-options)

- Classe: Manatsu
    - [Manatsu.createAll()](#createallarray)
    - [Manatsu.fromTemplate()](#fromtemplatereference-options)
    - [Manatsu.repeat()](#repeatamount-element-parent-options-create)
    
- Classe: DOM
    - [Manatsu.addTextContent()](#addtextcontentitems-text)
    - Manatsu.createCheckbox()
    - Manatsu.disableChildren()
    - Manatsu.enableChildren()
    - Manatsu.remove()
    - Manatsu.removeChildren()

## Construtor

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

Cria um objeto representando o elemento HTML desejado. Todos os parâmetros são opcionais.
Caso um parâmetro de determinado tipo for fornecido mais de uma vez, apenas a última ocorrência é considerada.

Para atribuir `textContent` deve-se adicionar `text` aos itens escolhidos em `options`.
Para `innerText`, usa-se `inner`. Não há suporte para `innerHTML`.

```javascript
const myElement = new Manatsu('span', { text: 'Olá, Mundo!' }).create()
console.log(myElement.textContent) // 'Olá, Mundo!'
```

## Instância

### addOptions(options[, overwrite])

- **options**: Object - Lista com novos atributos para o elemento.
- **overwrite**: boolean - Determina se os atributos serão sobrescritos caso já existam. Padrão: `true`.
- **Returns**: O próprio objeto Manatsu, agora modificado.

```javascript
const myElement = new Manatsu()
myElement.addOptions({ class: 'myClass' })
console.log(myElement.options) // 'Object { class: 'myClass' }'

myElement.addOptions({ id: 'myDiv', class: 'anotherClass' }, false)
console.log(myElement.options) // 'Object { id: 'myDiv', class: 'myClass' }'
```

Adiciona novos atributos ao objeto Manatsu.

### create()

- **Returns**: HTMLElement

```javascript
const myElement = new Manatsu().create()
```

Cria um elemento a partir do objeto Manatsu.

### createBefore(referenceNode)

- **referenceNode**: Node | null - Elemento antes do qual o novo será inserido.
- **Returns**: HTMLElement

```javascript
const parent = document.querySelector('#myDiv')
const referenceNode = document.querySelector('#myParagraph')
const myElement = new Manatsu('h1', parent, { text: 'Olá, Mundo!' })
myElement.createBefore(referenceNode)
```

Cria um elemento a partir do objeto Manatsu e o insere antes do elemento indicado como referência.
Caso `referenceNode` seja `null`, o método terá o mesmo efeito de [`Manatsu.prototype.create()`](#create).

É necessário que `parent` tenha sido definido no objeto Manatsu.

### createInside([element, parent, options])

- **element**: string - Define o tipo do elemento que será usado como envelope. Padrão: `div`.
- **parent**: HTMLElement
- **options**: Object - Lista com os atributos do elemento.
- **Returns**: HTMLElement - O objeto Manatsu original, agora como elemento.

```javascript
const parent = document.querySelector('#myDiv')
let myElement = new Manatsu('span', parent, { text: 'Brasil!' })
myElement = myElement.createInside('p', { id: '#newParent' })

const newParent = document.querySelector('#newParent')
console.log(myElement.parentElement === newParent) // true
```
Cria um elemento e o envelopa com outro. Esse outro elemento será criado com base nos argumentos fornecidos ao método,
que são os mesmos normalmente fornecidos ao [construtor](#construtor) da classe.

## Classe: Manatsu

Métodos que envolvem diretamente a manipulação de objetos Manatsu.

### createAll(array)

- **array**: Manatsu[]
- **Returns**: HTMLElement[]

Cria vários elementos de uma só vez, a partir de uma array de objetos Manatsu.
É equivalente a usar [`Manatsu.prototype.create()`](#create) separadamente em cada um dos objetos.

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
console.log(anotherElement.getAttribute('class')) // 'myClass'
```

### repeat([amount, element, parent, options, create])

- **amount**: number - Quantidade de cópias. Padrão: `1`.
- **element**: string | string[] - Define o tipo do elemento. Padrão: `div`.
- **parent**: HTMLElement
- **options**: Object - Lista com os atributos do elemento.
- **create**: boolean - Determina se os objetos devem ou não ser transformados em elementos HTML.
- **Returns**: Manatsu[] | HTMLElement[]

Cria vários objetos Manatsu a partir dos parâmetros especificados.
É possível designar vários tipos diferentes para os elementos, mas apenas um `parent` e um objeto `options`.

Caso vários tipos sejam fornecidos, o método os atribuirá em ordem.
Se a quantidade de cópias desejada for maior que a quantidade de tipos fornecidos,
a atribuição será feita em ordem para esses quem foram fornecidos e atribuirá `div` ao restante.

```javascript
const anotherElement = document.querySelector('#myDiv')
const array = ['span', 'p', 'br', 'p', 'br']

const myElements = Manatsu.repeat(6, array, anotherElement, { class: 'myClass' })

console.log(myElements[0].element) // 'span'
console.log(myElements[1].options) // 'Object { class: 'myClass' }'
console.log(myElements[2].options) // 'Object { class: 'myClass' }'
console.log(myElements[5].element) // 'div'
```

## Classe: DOM

Ferramentas para manipulação do DOM.

### addTextContent(items, text)

- **items**: (Element | Manatsu)[] - Elementos ou objetos Manatsu aos quais adicionar o texto.
- **text**: string[] - Array de strings contendo o texto a ser adicionado aos itens.

Adiciona texto em vários elementos ou objetos Manatsu de uma única vez.

Se as arrays forem de tamanhos diferentes e a array de strings for a maior, o método irá ignorar qualquer string extra.

Se a array contendo os elementos ou objetos Manatsu for maior, o método adicionará o texto respeitando a ordem,
até chegar ao ponto onde a diferença ocorre. Dali em diante, passará a adicionar a string no índice zero ao restante dos itens.

É interessante observar seu uso em conjunto com [Manatsu.repeat()](#repeatamount-element-parent-options-create):

```javascript
const quotes = [
    'Vós que viveis e sempre atribuís tudo o que ocorre na terra',
    'aos movimentos celestes, como se tal movimento imprimisse',
    'em todas as coisas uma necessidade,',
    'Se assim fosse, em vós seria destruído',
    'o livre-arbítrio, e não seria justo que o homem tivesse',
    'por bem a alegria e por mal a dor.'
];

const parent = document.querySelector('#myDiv')
const paragraphs = Manatsu.repeat(6, parent, { class: 'myParagraphs' }, true);
Manatsu.addTextContent(paragraphs, quotes);
```

### disableChildren(parent[, selector])

- **parent**: HTMLElement
- **selector**: string - Seletor CSS identificando quais elementos-filho serão alvo.

Adiciona o atributo `disabled` a todos os filhos do elemento indicado.
Caso um seletor CSS seja fornecido, adiciona somente aos filhos que o satisfaçam.

### enableChildren(parent[, selector])

- **parent**: HTMLElement
- **selector**: string - Seletor CSS identificando quais elementos-filho serão alvo.

Remove o atributo `disabled` de todos os filhos do elemento indicado.
Caso um seletor CSS seja fornecido, remove somente dos filhos que o satisfaçam.

### removeChildren(parent[, selector])

- **parent**: HTMLElement
- **selector**: string | string[] - Seletor CSS identificando quais elementos-filho serão alvo.

Remove todos os filhos do elemento indicado. Caso um seletor CSS seja fornecido, remove apenas os filhos que o satisfaçam.

```javascript
const myElement = document.querySelector('#myDiv');
Manatsu.removeChildren(myElement);
```
