let data = [];
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        // Atribui os produtos à variável globalData
        data = products;
        return products;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return [];
    }
}

async function renderCards() {
    const data = await fetchProducts();
    data.forEach(element => {
        createCard(element);
    });
}

const listUl = document.querySelector("#listaPrincipal");

function createCard({ id, image, title,  price }) {
    listUl.insertAdjacentHTML("beforeend", `
    <div class="card" style="width: 18rem;" id="${id}">
      <img src="${image}" class="card-img-top" alt="${title}">
        <h3 class="card-title">${title}</h3>
        <p class="preco">$${price}</p>
        <button class="botao" id="b_${id}">Adicionar ao carrinho</button>
        </div>
    </div>
`);
}
renderCards();




// Função para filtrar os produtos com base na categoria
async function filtraProdutos() {
    const buttons = document.querySelectorAll('[data-btn]');

    buttons.forEach(element => {
        element.addEventListener('click', async (e) => {
            const value = e.target.dataset.btn;
            if (value !== "") {
                listUl.innerHTML = "";
                const products = await fetchProducts(); // Assumindo que fetchProducts é uma função assíncrona
                const newArray = products.filter(({ category }) => {
                    return category === value;
                });
                newArray.forEach(element => createCard(element));
            } else {
                listUl.innerHTML = "";
                renderCards();
            }
        });
    });
}


// Função para pesquisar produtos
async function pesquisarProduto() {
    const search = document.querySelector('#searchButton');
    const input = document.querySelector('#input')

    search.addEventListener('click', async (e) => {
        e.preventDefault();
        listUl.innerHTML = "";
        const produto = input.value;
        const newArray = await filterProducts(produto);
        newArray.forEach(element => createCard(element));
        return newArray;
    });

    input.addEventListener('input', async (e) => {
        e.preventDefault();
        listUl.innerHTML = "";
        const produto = input.value;
        const newArray = await filterProducts(produto);
        newArray.forEach(element => createCard(element));
    });
}

// Função auxiliar assíncrona para filtrar produtos
async function filterProducts(produto) {
    return data.filter(element => {
        return element.title.includes(produto) || element.description.includes(produto);
    });
}

pesquisarProduto()
filtraProdutos();
//# FIM DA REGIÃO DE CONSULTA.



const listaSelecionados = document.querySelector('#listaCompras');
const botoesAdd = document.querySelectorAll('.botao');

let selecionados = [];
let itensNaLista = [];

// Função para carregar a lista de itens no carrinho
function loadList() {
    if (quantia <= 0) {
        // Se a quantidade for zero, limpa a lista e exibe que o carrinho está vazio
        listaSelecionados.innerHTML = "";
        atualizarEstadoCarrinho();
    } else {
        listaSelecionados.innerHTML = "";
    }

    for (let l = 0; l < selecionados.length; l++) {
        let currentElement = selecionados[l];
        currentElement.id = l;
        listaSelecionados.appendChild(currentElement);
    }
}


function removeButton(itemId) {
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', () => {
        itensNaLista.splice(itemId, 1);
        contaFinal = 0;

        for (let d = 0; d < itensNaLista.length; d++) {
            let item = itensNaLista[d];
            contaFinal += item.price;
        }
        spanPreco.innerText = `$${contaFinal}`;

        quantia -= 1;
        spanQuantdTotal.innerText = `${quantia}`;

        if (quantia <= 0) {
            divTotalPago.classList.remove('totalPagar');
            divTotalPago.innerHTML = "";
        }

        selecionados.splice(itemId, 1);
        loadList();
    });
    removeButton.innerText = 'Remover produto';
    removeButton.classList.add('remover');
    return removeButton;
}


let divTotalPago = document.createElement('div');

let p1 = document.createElement('p');

let spanQuantd = document.createElement('span');
spanQuantd.innerText = 'Quantidade';

let spanQuantdTotal = document.createElement('span')
spanQuantdTotal.innerText = ""

p1.append(spanQuantd, spanQuantdTotal)

let p2 = document.createElement('p');

let spanTotal = document.createElement('span');
spanTotal.innerText = 'Total'

let spanPreco = document.createElement('span');
spanPreco.innerText = ""

p2.append(spanTotal, spanPreco)

divTotalPago.append(p1, p2);

let contaFinal = 0;
let quantia = 0;

function addToCart(productId) {
    console.log(`Produto com ID ${productId} adicionado ao carrinho.`);

    listaSelecionados.classList.replace('listaSelecionados', 'listaComItens');
    
    const dataPosicao = data.find(item => item.id == productId);

    quantia += 1;
    spanQuantdTotal.innerText = `${quantia}`;
    if (quantia !== 0) {
        atualizarEstadoCarrinho();
    }

    contaFinal += dataPosicao.price;
    spanPreco.innerText = `$${contaFinal}`;

    const newItem = document.createElement("li");

    const imgCarrinho = document.createElement('img');
    imgCarrinho.src = dataPosicao.image;
    newItem.appendChild(imgCarrinho);

    const divItemCarrinho = document.createElement('div');
    divItemCarrinho.classList.add('carrinhoItem');

    const h3Item = document.createElement('h3');
    h3Item.innerText = dataPosicao.title;
    divItemCarrinho.appendChild(h3Item);

    const pCarrinho = document.createElement("p");
    pCarrinho.innerText = `$${dataPosicao.price}`;
    divItemCarrinho.appendChild(pCarrinho);

    const removerButton = removeButton();
    divItemCarrinho.appendChild(removerButton);

    newItem.appendChild(divItemCarrinho);
    selecionados.push(newItem);
    itensNaLista.push(dataPosicao);
    loadList();
    filtraProdutos();
    pesquisarProduto();
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('botao')) {
        const productId = e.target.id.split('_')[1];

        addToCart(productId);
    }
});
function atualizarEstadoCarrinho() {
    if (quantia <= 0) {
        listaSelecionados.classList.replace('listaComItens', 'listaSelecionados');
        listaSelecionados.innerHTML = `
            <h3 id="carrinhoVazio">Carrinho Vazio</h3>
            <small id="small">Adicione Itens</small>
        `;
    } else {
        listaSelecionados.classList.add('listaComItens');
        listaSelecionados.innerHTML = '';
        divTotalPago.classList.add('totalPagar');
        divTotalPago.append(p1, p2);
        let carrinho = document.querySelector('.carrinho');
        carrinho.appendChild(divTotalPago);
    }
}
