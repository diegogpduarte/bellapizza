var produtos = [
    { id: 1, nome: "Margherita", categoria: "Pizzas", preco: 49.9, icone: "🍕", descricao: "Molho, mussarela e manjericão" },
    { id: 2, nome: "Calabresa", categoria: "Pizzas", preco: 52.9, icone: "🍕", descricao: "Calabresa fatiada e cebola" },
    { id: 3, nome: "Quatro Queijos", categoria: "Pizzas", preco: 58.9, icone: "🧀", descricao: "Mussarela, provolone, gorgonzola e parmesão" },
    { id: 4, nome: "Frango com Catupiry", categoria: "Pizzas", preco: 55.9, icone: "🍗", descricao: "Frango desfiado e catupiry" },
    { id: 5, nome: "Chocolate", categoria: "Doces", preco: 45.9, icone: "🍫", descricao: "Chocolate ao leite e granulado" },
    { id: 6, nome: "Banana com Canela", categoria: "Doces", preco: 44.9, icone: "🍌", descricao: "Banana, açúcar e canela" },
    { id: 7, nome: "Coca-Cola 2L", categoria: "Bebidas", preco: 12, icone: "🥤", descricao: "Gelada, 2 litros" },
    { id: 8, nome: "Suco de Laranja", categoria: "Bebidas", preco: 9, icone: "🍊", descricao: "Natural, 500 ml" },
    { id: 9, nome: "Pão de Alho", categoria: "Entradas", preco: 16, icone: "🥖", descricao: "6 unidades com queijo" },
    { id: 10, nome: "Batata Frita", categoria: "Entradas", preco: 22, icone: "🍟", descricao: "Porção com cheddar e bacon" }
];

var taxaEntrega = 6;
var categoriaAtual = "Todos";

function lerLista(nome) {
    return JSON.parse(localStorage.getItem(nome)) || [];
}

function salvarLista(nome, lista) {
    localStorage.setItem(nome, JSON.stringify(lista));
}

function usuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function formatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function buscarProduto(id) {
    for (var i = 0; i < produtos.length; i++) {
        if (produtos[i].id == id) {
            return produtos[i];
        }
    }
}

function aplicarTema() {
    if (localStorage.getItem("tema") == "escuro") {
        document.body.classList.add("escuro");
    }
}

function trocarTema() {
    document.body.classList.toggle("escuro");
    if (document.body.classList.contains("escuro")) {
        localStorage.setItem("tema", "escuro");
    } else {
        localStorage.setItem("tema", "claro");
    }
}

function mostrarCabecalho() {
    var usuario = usuarioLogado();
    var carrinho = lerLista("carrinho");
    var quantidade = 0;
    for (var i = 0; i < carrinho.length; i++) {
        quantidade = quantidade + carrinho[i].quantidade;
    }

    var botoes = "";
    if (usuario) {
        botoes = '<a href="perfil.html">Olá, ' + usuario.nome.split(" ")[0] + '</a> ' +
                 '<button onclick="sair()">Sair</button>';
    } else {
        botoes = '<a class="botao" href="login.html">Entrar</a> ' +
                 '<a class="botao" href="login.html#cadastro">Cadastrar</a>';
    }

    document.getElementById("cabecalho").innerHTML =
        '<header>' +
        '<a class="logo" href="index.html">Bella Piazza</a>' +
        '<div class="busca">' +
        '<input type="text" id="campoBusca" maxlength="40" placeholder="Buscar pizza, bebida..." style="margin:0">' +
        '<button onclick="buscar()">Buscar</button>' +
        '</div>' +
        '<nav><a href="produtos.html">Produtos</a>' +
        '<a href="pedidos.html">Meus pedidos</a>' +
        '<a href="carrinho.html">Carrinho (' + quantidade + ')</a></nav>' +
        '<div>' + botoes + ' <button class="cinza" onclick="trocarTema()">Claro/Escuro</button></div>' +
        '</header>';
}

function mostrarRodape() {
    document.getElementById("rodape").innerHTML =
        '<footer><p>Bella Piazza Delivery - Rua das Flores, 120 - (31) 3000-0000</p>' +
        '<p>Aberto todos os dias, das 18h às 23h</p></footer>';
}

function mascaraCPF(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

function mascaraTelefone(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "($1) $2");
    v = v.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    return v;
}

function mascaraCEP(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    return v;
}

function mascaraData(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    return v;
}

function mostrarProdutos(lista, idDiv) {
    var html = "";
    for (var i = 0; i < lista.length; i++) {
        var p = lista[i];
        html = html + '<div class="card">' +
            '<div class="icone">' + p.icone + '</div>' +
            '<h3>' + p.nome + '</h3>' +
            '<p>' + p.descricao + '</p>' +
            '<p><b>' + formatarPreco(p.preco) + '</b></p>' +
            '<button onclick="adicionarCarrinho(' + p.id + ')">Adicionar</button>' +
            '</div>';
    }
    if (html == "") {
        html = "<p>Nenhum produto encontrado.</p>";
    }
    document.getElementById(idDiv).innerHTML = html;
}

function iniciarProdutos() {
    var parametros = location.search;
    if (parametros.indexOf("busca=") != -1) {
        document.getElementById("campoBusca").value = decodeURIComponent(parametros.split("busca=")[1]);
    }
    filtrarProdutos();
}

function filtrarCategoria(categoria) {
    categoriaAtual = categoria;
    filtrarProdutos();
}

function filtrarProdutos() {
    var texto = document.getElementById("campoBusca").value.toLowerCase();
    var resultado = [];
    for (var i = 0; i < produtos.length; i++) {
        var p = produtos[i];
        var textoProduto = (p.nome + " " + p.descricao).toLowerCase();
        if ((categoriaAtual == "Todos" || p.categoria == categoriaAtual) && textoProduto.indexOf(texto) != -1) {
            resultado.push(p);
        }
    }
    mostrarProdutos(resultado, "listaProdutos");
}

function buscar() {
    if (document.getElementById("listaProdutos")) {
        filtrarProdutos();
    } else {
        location.href = "produtos.html?busca=" + encodeURIComponent(document.getElementById("campoBusca").value);
    }
}

function adicionarCarrinho(id) {
    var carrinho = lerLista("carrinho");
    var achou = false;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id == id) {
            carrinho[i].quantidade++;
            achou = true;
        }
    }
    if (!achou) {
        carrinho.push({ id: id, quantidade: 1 });
    }
    salvarLista("carrinho", carrinho);
    alert("Produto adicionado ao carrinho!");
    mostrarCabecalho();
}

function mudarQuantidade(id, valor) {
    var carrinho = lerLista("carrinho");
    var novo = [];
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id == id) {
            carrinho[i].quantidade = carrinho[i].quantidade + valor;
        }
        if (carrinho[i].quantidade > 0) {
            novo.push(carrinho[i]);
        }
    }
    salvarLista("carrinho", novo);
    mostrarCarrinho();
    mostrarCabecalho();
}

function mostrarCarrinho() {
    var carrinho = lerLista("carrinho");
    var html = "";
    var subtotal = 0;

    for (var i = 0; i < carrinho.length; i++) {
        var p = buscarProduto(carrinho[i].id);
        subtotal = subtotal + p.preco * carrinho[i].quantidade;
        html = html + '<div class="item">' + p.icone + ' <b>' + p.nome + '</b> - ' + formatarPreco(p.preco) +
            '<br><button onclick="mudarQuantidade(' + p.id + ', -1)">-</button> ' + carrinho[i].quantidade +
            ' <button onclick="mudarQuantidade(' + p.id + ', 1)">+</button>' +
            ' <button class="cinza" onclick="mudarQuantidade(' + p.id + ', -999)">Remover</button></div>';
    }

    if (carrinho.length == 0) {
        html = '<p>Seu carrinho está vazio. <a href="produtos.html">Ver cardápio</a></p>';
    } else {
        html = html + '<p>Subtotal: ' + formatarPreco(subtotal) + '<br>Entrega: ' + formatarPreco(taxaEntrega) +
            '<br><b>Total: ' + formatarPreco(subtotal + taxaEntrega) + '</b></p>' +
            '<button onclick="finalizarPedido()">Finalizar pedido</button>';
    }
    document.getElementById("listaCarrinho").innerHTML = html;
}

function finalizarPedido() {
    var usuario = usuarioLogado();
    if (!usuario) {
        alert("Faça login para finalizar o pedido.");
        location.href = "login.html";
        return;
    }

    var carrinho = lerLista("carrinho");
    var itens = [];
    var total = taxaEntrega;
    for (var i = 0; i < carrinho.length; i++) {
        var p = buscarProduto(carrinho[i].id);
        itens.push({ nome: p.nome, quantidade: carrinho[i].quantidade });
        total = total + p.preco * carrinho[i].quantidade;
    }

    var pedidos = lerLista("pedidos");
    pedidos.push({
        numero: Date.now(),
        email: usuario.email,
        data: new Date().toLocaleString("pt-BR"),
        itens: itens,
        total: total,
        status: "pendente"
    });
    salvarLista("pedidos", pedidos);
    salvarLista("carrinho", []);
    location.href = "pedidos.html";
}

function mostrarPedidos() {
    var usuario = usuarioLogado();
    if (!usuario) {
        document.getElementById("listaPedidos").innerHTML = '<p>Faça <a href="login.html">login</a> para ver seus pedidos.</p>';
        return;
    }

    var pedidos = lerLista("pedidos");
    var html = "";
    for (var i = pedidos.length - 1; i >= 0; i--) {
        var p = pedidos[i];
        if (p.email != usuario.email) {
            continue;
        }
        var textoItens = "";
        for (var j = 0; j < p.itens.length; j++) {
            textoItens = textoItens + p.itens[j].quantidade + "x " + p.itens[j].nome + "; ";
        }
        html = html + '<div class="item"><b>Pedido nº ' + p.numero + '</b> - ' + p.status +
            '<br>' + p.data + '<br>' + textoItens + '<br><b>' + formatarPreco(p.total) + '</b><br>';
        if (p.status == "pendente") {
            html = html + '<button onclick="cancelarPedido(' + p.numero + ')">Cancelar</button>';
        }
        if (p.status == "cancelado") {
            html = html + '<button class="cinza" onclick="excluirPedido(' + p.numero + ')">Excluir</button>';
        }
        html = html + '</div>';
    }
    if (html == "") {
        html = '<p>Você ainda não fez pedidos.</p>';
    }
    document.getElementById("listaPedidos").innerHTML = html;
}

function cancelarPedido(numero) {
    var pedidos = lerLista("pedidos");
    for (var i = 0; i < pedidos.length; i++) {
        if (pedidos[i].numero == numero) {
            pedidos[i].status = "cancelado";
        }
    }
    salvarLista("pedidos", pedidos);
    mostrarPedidos();
}

function excluirPedido(numero) {
    var pedidos = lerLista("pedidos");
    var novo = [];
    for (var i = 0; i < pedidos.length; i++) {
        if (pedidos[i].numero != numero) {
            novo.push(pedidos[i]);
        }
    }
    salvarLista("pedidos", novo);
    mostrarPedidos();
}

function mostrarErro(idErro, mensagem) {
    document.getElementById(idErro).innerText = mensagem;
}

function cadastrar() {
    var usuario = {
        nome: document.getElementById("cadNome").value.trim(),
        email: document.getElementById("cadEmail").value.trim(),
        cpf: document.getElementById("cadCpf").value,
        telefone: document.getElementById("cadTelefone").value,
        nascimento: document.getElementById("cadNascimento").value,
        cep: document.getElementById("cadCep").value,
        endereco: document.getElementById("cadEndereco").value.trim(),
        numero: document.getElementById("cadNumero").value,
        senha: document.getElementById("cadSenha").value
    };

    for (var campo in usuario) {
        if (usuario[campo] == "") {
            mostrarErro("erroCadastro", "Preencha todos os campos.");
            return;
        }
    }
    if (usuario.email.indexOf("@") == -1 || usuario.email.indexOf(".") == -1) {
        mostrarErro("erroCadastro", "Digite um e-mail válido.");
        return;
    }
    if (usuario.cpf.length != 14) {
        mostrarErro("erroCadastro", "CPF incompleto.");
        return;
    }
    if (usuario.telefone.length != 15) {
        mostrarErro("erroCadastro", "Telefone incompleto.");
        return;
    }
    var partes = usuario.nascimento.split("/");
    if (usuario.nascimento.length != 10 || partes[0] > 31 || partes[1] > 12 || partes[2] < 1900) {
        mostrarErro("erroCadastro", "Data de nascimento inválida.");
        return;
    }
    if (usuario.cep.length != 9) {
        mostrarErro("erroCadastro", "CEP incompleto.");
        return;
    }
    if (usuario.senha.length < 6) {
        mostrarErro("erroCadastro", "A senha precisa ter no mínimo 6 caracteres.");
        return;
    }

    var usuarios = lerLista("usuarios");
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email == usuario.email) {
            mostrarErro("erroCadastro", "Já existe uma conta com este e-mail.");
            return;
        }
    }

    usuarios.push(usuario);
    salvarLista("usuarios", usuarios);
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    alert("Conta criada com sucesso!");
    location.href = "produtos.html";
}

function fazerLogin() {
    var email = document.getElementById("loginEmail").value.trim();
    var senha = document.getElementById("loginSenha").value;
    var usuarios = lerLista("usuarios");

    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email == email && usuarios[i].senha == senha) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[i]));
            location.href = "produtos.html";
            return;
        }
    }
    mostrarErro("erroLogin", "E-mail ou senha incorretos.");
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    location.href = "index.html";
}

function mostrarPerfil() {
    var usuario = usuarioLogado();
    if (!usuario) {
        document.getElementById("areaPerfil").innerHTML = '<p>Faça <a href="login.html">login</a> para ver seus dados.</p>';
        return;
    }
    document.getElementById("perfNome").value = usuario.nome;
    document.getElementById("perfEmail").value = usuario.email;
    document.getElementById("perfCpf").value = usuario.cpf;
    document.getElementById("perfTelefone").value = usuario.telefone;
    document.getElementById("perfCep").value = usuario.cep;
    document.getElementById("perfEndereco").value = usuario.endereco;
    document.getElementById("perfNumero").value = usuario.numero;
}

function salvarPerfil() {
    var usuario = usuarioLogado();
    var usuarios = lerLista("usuarios");

    var nome = document.getElementById("perfNome").value.trim();
    var telefone = document.getElementById("perfTelefone").value;
    var cep = document.getElementById("perfCep").value;
    var endereco = document.getElementById("perfEndereco").value.trim();
    var numero = document.getElementById("perfNumero").value;

    if (nome == "" || endereco == "" || numero == "") {
        mostrarErro("erroPerfil", "Preencha todos os campos.");
        return;
    }
    if (telefone.length != 15 || cep.length != 9) {
        mostrarErro("erroPerfil", "Telefone ou CEP incompleto.");
        return;
    }

    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email == usuario.email) {
            usuarios[i].nome = nome;
            usuarios[i].telefone = telefone;
            usuarios[i].cep = cep;
            usuarios[i].endereco = endereco;
            usuarios[i].numero = numero;
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[i]));
        }
    }
    salvarLista("usuarios", usuarios);
    mostrarErro("erroPerfil", "Dados salvos com sucesso!");
    mostrarCabecalho();
}

function excluirConta() {
    if (!confirm("Deseja realmente excluir sua conta?")) {
        return;
    }
    var usuario = usuarioLogado();
    var usuarios = lerLista("usuarios");
    var novo = [];
    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email != usuario.email) {
            novo.push(usuarios[i]);
        }
    }
    salvarLista("usuarios", novo);
    sair();
}

window.onload = function () {
    aplicarTema();
    mostrarCabecalho();
    mostrarRodape();

    if (document.getElementById("listaDestaques")) {
        mostrarProdutos(produtos.slice(0, 4), "listaDestaques");
    }
    if (document.getElementById("listaProdutos")) {
        iniciarProdutos();
    }
    if (document.getElementById("listaCarrinho")) {
        mostrarCarrinho();
    }
    if (document.getElementById("listaPedidos")) {
        mostrarPedidos();
    }
    if (document.getElementById("areaPerfil")) {
        mostrarPerfil();
    }
};
