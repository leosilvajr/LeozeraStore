// Busca dados da API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return [];
    }
}

// Geração Dos Produtos
async function renderCards() {
    const data = await fetchProducts();
    data.forEach(element => {
        createCard(element);
    });
}

const listUl = document.querySelector("#listaPrincipal");

function createCard({ id, image, category, title, description, price }) {
    const listUl = document.querySelector("#listaPrincipal");

    listUl.insertAdjacentHTML("beforeend", `
    <div class="card" style="width: 18rem;" id="${id}">
      <img src="${image}" class="card-img-top" alt="${title}">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="preco">$${price}</p>
        <button class="btn btn-primary botao" id="b_${id}">Adicionar ao carrinho</button>
      </div>
    </div>
`);

}

renderCards();

function filtraProdutos() {
    const buttons = document.querySelectorAll('[data-btn]');

    buttons.forEach(element => {
        element.addEventListener('click', async (e) => {
            const value = e.target.dataset.btn;
            if (value !== "") {
                listUl.innerHTML = "";
                const products = await fetchProducts();
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


function pesquisarProduto() {

    const search = document.querySelector('#searchButton');
    const input = document.querySelector('#input')
    
    search.addEventListener('click', (e) => {
        e.preventDefault();
        listUl.innerHTML = ""
        const produto = input.value
        const newArray = data.filter(element => {
            return element.nameItem.includes(produto) || element.description.includes(produto)
            
        })
        newArray.forEach(element => createCard(element))
        return newArray
    })
    input.addEventListener('change', (e) => {
        e.preventDefault()
        listUl.innerHTML = ""
        const produto = input.value;
        const newArray = data.filter(element => {
            return element.nameItem.includes(produto) || element.description.includes(produto)
        })
        newArray.forEach(element => createCard(element))
    })
}

pesquisarProduto()

filtraProdutos()

// Processo de por os itens no carrinho

const listaSelecionados = document.querySelector('#listaCompras')
const botoesAdd = document.querySelectorAll('.botao')

let selecionados = [];
let itensNaLista = [];

function loadList(){
    if(quantia <= 0){
        listaSelecionados.innerHTML = ""
        carroVazio()
    }else{
        listaSelecionados.innerHTML = ""

    }
    
    for (let l = 0; l < selecionados.length; l++) {
        let currentElement = selecionados[l];
        currentElement.id = l;
        listaSelecionados.appendChild(currentElement);
    }
}

function removeButton(){
    listaSelecionados.innerHTML = ""
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', (e) => {

        let itemId = selecionados.filter((_, index) => index === Number(e.path[2].id));
        itemId = itemId[0].id
        
        itensNaLista.splice(itemId,1)
        contaFinal = 0

        for (let d = 0; d < itensNaLista.length; d++) {
            let item = itensNaLista[d];
            contaFinal += item.value
        }
        spanPreco.innerText = `R$${contaFinal},00`

        quantia -= 1 
        spanQuantdTotal.innerText = `${quantia}`

        if(quantia <= 0){
            divTotalPago.classList.remove('totalPagar')
            divTotalPago.innerHTML = ""
        }

        selecionados = selecionados.filter((_, index) => index !== Number(e.path[2].id));
        loadList()
    });
    removeButton.innerText = 'Remover produto'
    removeButton.classList.add('remover')
    return removeButton
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

divTotalPago.append(p1,p2);


let contaFinal = 0;
let quantia = 0

for (let z = 0; z < botoesAdd.length; z++) {
    let botao = botoesAdd[z]
    
    botao.addEventListener('click', (e) => {
        
        listaSelecionados.classList.replace('listaSelecionados', 'listaComItens')
        
        let dataPosicao = data[z]

        quantia += 1
        spanQuantdTotal.innerText = `${quantia}`
        if(quantia !== 0){
            carroComItens()
        }

        contaFinal += data[z].value
        spanPreco.innerText = `R$${contaFinal},00`
        
        let newItem = document.createElement("li");
        
        let imgCarrinho = document.createElement('img');
        imgCarrinho.src = dataPosicao.img;
        newItem.appendChild(imgCarrinho)
        
        let divItemCarrinho = document.createElement('div');
        divItemCarrinho.classList.add('carrinhoItem')
        
        let h3Item = document.createElement('h3');
        h3Item.innerText = dataPosicao.nameItem
        divItemCarrinho.appendChild(h3Item);
        
        let pCarrinho = document.createElement("p");
        pCarrinho.innerText = `R$${dataPosicao.value},00`;
        divItemCarrinho.appendChild(pCarrinho)
        
        let removerButton = removeButton();
        divItemCarrinho.appendChild(removerButton)
    
        newItem.appendChild(divItemCarrinho)
        selecionados.push(newItem);
        itensNaLista.push(data[z])
        loadList();
        filtraProdutos();
        pesquisarProduto();
    })
    
}

function carroVazio(){

    listaSelecionados.classList.replace('listaComItens','listaSelecionados')

    listaSelecionados.insertAdjacentHTML('beforeend', `
        <h3 id="carrinhoVazio">Carrinho Vazio</h3>
        <small id="small">Adicione Itens</small>
    `)
}

function carroComItens(){
    divTotalPago.classList.add('totalPagar')
    divTotalPago.append(p1,p2);
    let carrinho = document.querySelector('.carrinho')
    carrinho.appendChild(divTotalPago)
}




