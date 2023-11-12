// Função assíncrona para buscar dados da API
async function fetchProducts() {
    try {
        // Faz uma requisição à API e espera pela resposta
        const response = await fetch('https://fakestoreapi.com/products');
        // Converte a resposta para JSON
        const products = await response.json();
        // Retorna os produtos obtidos da API
        return products;
    } catch (error) {
        // Em caso de erro, imprime o erro no console e retorna uma lista vazia
        console.error('Erro ao buscar dados da API:', error);
        return [];
    }
}

// Função para renderizar os cards dos produtos na página
async function renderCards() {
    // Chama a função fetchProducts para obter os dados da API
    const data = await fetchProducts();
    // Para cada elemento nos dados, chama a função createCard para criar um card
    data.forEach(element => {
        createCard(element);
    });
}

// Seleciona a lista principal na qual os cards serão inseridos
const listUl = document.querySelector("#listaPrincipal");

// Função para criar um card com base nos dados fornecidos
function createCard({ id, image, category, title, description, price }) {
    // Insere HTML na lista principal com os dados do produto
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

// Renderiza os cards na página
renderCards();

// Função para filtrar os produtos com base na categoria
function filtraProdutos() {
    // Seleciona todos os botões com o atributo data-btn
    const buttons = document.querySelectorAll('[data-btn]');

    // Adiciona um ouvinte de evento para cada botão
    buttons.forEach(element => {
        element.addEventListener('click', async (e) => {
            // Obtém o valor do atributo data-btn do botão clicado
            const value = e.target.dataset.btn;
            if (value !== "") {
                // Se o valor não for vazio, filtra os produtos por categoria
                listUl.innerHTML = "";
                const products = await fetchProducts();
                const newArray = products.filter(({ category }) => {
                    return category === value;
                });
                newArray.forEach(element => createCard(element));
            } else {
                // Se o valor for vazio, exibe todos os produtos
                listUl.innerHTML = "";
                renderCards();
            }
        });
    });
}

// Função para pesquisar produtos com base no input de busca
function pesquisarProduto() {
    // Seleciona o botão de pesquisa e o campo de input
    const search = document.querySelector('#searchButton');
    const input = document.querySelector('#input');

    // Adiciona um ouvinte de evento para o clique no botão de pesquisa
    search.addEventListener('click', (e) => {
        e.preventDefault();
        listUl.innerHTML = "";
        const produto = input.value;
        // Filtra os produtos com base no nome ou descrição digitados
        const newArray = data.filter(element => {
            return element.nameItem.includes(produto) || element.description.includes(produto);
        });
        newArray.forEach(element => createCard(element));
        return newArray;
    });

    // Adiciona um ouvinte de evento para a mudança no campo de input
    input.addEventListener('change', (e) => {
        e.preventDefault();
        listUl.innerHTML = "";
        const produto = input.value;
        // Filtra os produtos com base no nome ou descrição digitados
        const newArray = data.filter(element => {
            return element.nameItem.includes(produto) || element.description.includes(produto);
        });
        newArray.forEach(element => createCard(element));
    });
}

// Inicia a pesquisa de produtos
pesquisarProduto();

// Aplica o filtro de produtos
filtraProdutos();

// Processo de adicionar itens ao carrinho

// Seleciona a lista de compras e todos os botões de adicionar ao carrinho
const listaSelecionados = document.querySelector('#listaCompras');
const botoesAdd = document.querySelectorAll('.botao');

// Arrays para armazenar itens selecionados e itens na lista
let selecionados = [];
let itensNaLista = [];

// Função para carregar a lista de itens no carrinho
function loadList() {
    if (quantia <= 0) {
        // Se a quantidade for zero, limpa a lista e exibe que o carrinho está vazio
        listaSelecionados.innerHTML = "";
        carroVazio();
    } else {
        listaSelecionados.innerHTML = "";
    }

    for (let l = 0; l < selecionados.length; l++) {
        let currentElement = selecionados[l];
        currentElement.id = l;
        listaSelecionados.appendChild(currentElement);
    }
}

// Função para criar um botão de remoção
function removeButton() {
    listaSelecionados.innerHTML = "";
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', (e) => {
        // Remove o item da lista e recalcula o total e a quantidade
        let itemId = selecionados.filter((_, index) => index === Number(e.path[2].id));
        itemId = itemId[0].id;

        itensNaLista.splice(itemId, 1);
        contaFinal = 0;

        for (let d = 0; d < itensNaLista.length; d++) {
            let item = itensNaLista[d];
            contaFinal += item.value;
        }
        spanPreco.innerText = `R$${contaFinal},00`;

        quantia -= 1;
        spanQuantdTotal.innerText = `${quantia}`;

        if (quantia <= 0) {
            // Se a quantidade for zero, remove a seção de total a pagar
            divTotalPago.classList.remove('totalPagar');
            divTotalPago.innerHTML = "";
        }

        selecionados = selecionados.filter((_, index) => index !== Number(e.path[2].id));
        loadList();
    });
    removeButton.innerText = 'Remover produto';
    removeButton.classList.add('remover');
    return removeButton;
}

// Elemento HTML para exibir o total a pagar
let divTotalPago = document.createElement('div');

// Elemento HTML para exibir a quantidade de itens no carrinho
let p1 = document.createElement('p');

// Elemento HTML para exibir a label 'Quantidade'
let spanQuantd = document.createElement('span');
spanQuantd.innerText = 'Quantidade';

// Elemento HTML para exibir o número total de itens no carrinho
let spanQuantdTotal = document.createElement('span')
spanQuantdTotal.innerText = ""

// Adiciona os elementos à estrutura HTML
p1.append(spanQuantd, spanQuantdTotal)

// Elemento HTML para exibir o total do carrinho
let p2 = document.createElement('p');

// Elemento HTML para exibir a label 'Total'
let spanTotal = document.createElement('span');
spanTotal.innerText = 'Total'

// Elemento HTML para exibir o preço total do carrinho
let spanPreco = document.createElement('span');
spanPreco.innerText = ""

// Adiciona os elementos à estrutura HTML
p2.append(spanTotal, spanPreco)

// Adiciona as estruturas HTML à divTotalPago
divTotalPago.append(p1, p2);

// Variáveis para armazenar o total e a quantidade de itens no carrinho
let contaFinal = 0;
let quantia = 0;

// Loop para adicionar ouvinte de evento a cada botão de adicionar ao carrinho
for (let z = 0; z < botoesAdd.length; z++) {
    let botao = botoesAdd[z]

    botao.addEventListener('click', (e) => {

        // Troca a classe da lista de seleção para exibir a lista de itens no carrinho
        listaSelecionados.classList.replace('listaSelecionados', 'listaComItens')

        // Obtém os dados do produto na posição z
        let dataPosicao = data[z]

        // Incrementa a quantidade de itens no carrinho e atualiza a exibição
        quantia += 1
        spanQuantdTotal.innerText = `${quantia}`
        
        // Se houver itens no carrinho, exibe a seção de total a pagar
        if(quantia !== 0){
            carroComItens()
        }

        // Adiciona o preço do produto ao total e atualiza a exibição
        contaFinal += data[z].value
        spanPreco.innerText = `R$${contaFinal},00`

        // Cria um novo item na lista de seleção (carrinho)
        let newItem = document.createElement("li");

        // Cria uma imagem do produto
        let imgCarrinho = document.createElement('img');
        imgCarrinho.src = dataPosicao.img;
        newItem.appendChild(imgCarrinho)

        // Cria uma div para o item do carrinho
        let divItemCarrinho = document.createElement('div');
        divItemCarrinho.classList.add('carrinhoItem')

        // Cria um título (nome do produto) para o item do carrinho
        let h3Item = document.createElement('h3');
        h3Item.innerText = dataPosicao.nameItem
        divItemCarrinho.appendChild(h3Item);

        // Cria um parágrafo para exibir o preço do produto no carrinho
        let pCarrinho = document.createElement("p");
        pCarrinho.innerText = `R$${dataPosicao.value},00`;
        divItemCarrinho.appendChild(pCarrinho)

        // Cria um botão de remoção e adiciona à divItemCarrinho
        let removerButton = removeButton();
        divItemCarrinho.appendChild(removerButton)

        // Adiciona a divItemCarrinho ao newItem
        newItem.appendChild(divItemCarrinho)

        // Adiciona o newItem à lista de itens selecionados (carrinho)
        selecionados.push(newItem);
        // Adiciona o produto à lista de itens na lista
        itensNaLista.push(data[z])
        // Carrega a lista de itens no carrinho
        loadList();
        // Atualiza a exibição dos produtos na página
        filtraProdutos();
        // Atualiza a exibição dos produtos pesquisados
        pesquisarProduto();
    })
}

// Função para exibir mensagem quando o carrinho está vazio
function carroVazio() {

    // Troca a classe da lista de seleção para exibir a mensagem de carrinho vazio
    listaSelecionados.classList.replace('listaComItens', 'listaSelecionados')

    // Insere HTML na listaSelecionados para exibir a mensagem
    listaSelecionados.insertAdjacentHTML('beforeend', `
        <h3 id="carrinhoVazio">Carrinho Vazio</h3>
        <small id="small">Adicione Itens</small>
    `)
}

// Função para exibir a seção de total a pagar quando o carrinho possui itens
function carroComItens() {
    divTotalPago.classList.add('totalPagar')
    divTotalPago.append(p1, p2);
    // Seleciona o elemento com a classe 'carrinho' e adiciona a divTotalPago
    let carrinho = document.querySelector('.carrinho')
    carrinho.appendChild(divTotalPago)
}
