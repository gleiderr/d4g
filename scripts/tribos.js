class Tribo {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;

        var prefix = new Expressao('tribo de ').or('descendentes de ').or('de ').or('filhos de ')
                                               .afix('(?:', ')').sufix('?');
        this.exp = new Expressao(nome, 'g').prefix(prefix);

        var sufix_n = new Expressao(', foram recenseados ').or(' foi ')
                                                .afix('(?:', ')')
                                                .sufix("([\\d\\.]*\\b)")
                                                .sufix('(?: homens)?');
        this.exp_n = this.exp.sufix(sufix_n);
    }

    // Identifica a partir do [text] quantos indivíduos da tribo são citados.
    n(text) {
        var n;
        if(n = this.exp_n.regexp.exec(text))
            if(n.length > 0)
                n = n[1].replace('.','');

        n = Number.parseInt(n);
        return n;
    }
}

dataTribos = [
    { id: 'triboRuben', nome: 'Rúben' },
    { id: 'triboSimeao', nome: 'Simeão' },
    { id: 'triboJuda', nome: 'Judá' },
    { id: 'triboIssacar', nome: 'Issacar' },
    { id: 'triboZebulom', nome: 'Zebulom' },
    { id: 'triboEfraim', nome: 'Efraim' },
    { id: 'triboManasses', nome: 'Manassés' },
    { id: 'triboBenjamim', nome: 'Benjamim' },
    { id: 'triboDa', nome: 'Dã' },
    { id: 'triboAser', nome: 'Aser' },
    { id: 'triboGade', nome: 'Gade' },
    { id: 'triboNaftali', nome: 'Naftali' },
    { id: 'triboLevi', nome: 'Levi|[lL]evitas'},
];

//var tribos = new Map();
dataTribos.forEach(function(d) {
    var tribo = new Tribo(d.id, d.nome);

    var body = document.querySelector('body');
    body.innerHTML = body.innerHTML.replace(tribo.exp.regexp, '<span class="teste">$&</span>');
    /*body.innerHTML = body.innerHTML.replace(tribo.exp_n.regexp, 
        '<span class="teste">$&</span>(' + tribo.n(body.innerHTML) +'#)');*/

    console.log(tribo);
});


//texto.innerHTML = texto.innerHTML.replace(d.regexp.regexp, t1 + '$&' + t2);