class Expressao {
    constructor(exp, flags) {
        if(exp instanceof Expressao){
            this.exp = String(exp.exp);
            this.flags = String(exp.flags);
        } else if(exp instanceof RegExp) {
            this.exp = exp.source;
            this.flags = exp.flags;
        } else {
            this.exp = arguments.length > 0 ? exp : '';
            this.flags = arguments.length > 1 ? flags : '';
        }
    }

    or(e) {
        if(e instanceof Expressao)
            e = e.exp;
        return new Expressao(this.exp + '|' + e, this.flags);
    }

    prefix(p) {
        if(p instanceof Expressao)
            p = p.exp;
        return new Expressao(p + this.exp, this.flags);
    }

    sufix(s) {
        if(s instanceof Expressao)
            s = s.exp;
        return new Expressao(this.exp + s, this.flags);
    }

    afix(pre, suf) {
        return new Expressao(pre + this.exp + suf, this.flags);
    }

    setFlags(f) {
        return new Expressao(this.exp, f);
    }

    get regexp() {
        return new RegExp(this.exp, this.flags);
    }

    test(str) {
        return this.regexp.test(str);
    }
}

exp = {};
exp.anoJudaico = new Expressao("anos?", 'i');
/*---------------------------- Pessoas ----------------------------*/
expPes = {};
expPes.adao = new Expressao(/Adão/g);
expPes.sete = new Expressao(/Sete/g);
expPes.enos = new Expressao(/Enos/g);
expPes.caina = new Expressao(/Cainã/g);
expPes.maalaleel = new Expressao(/Maalaleel/g);
expPes.jarede = new Expressao(/Jarede/g);
expPes.enoque = new Expressao(/Enoque/g);
expPes.matusalem = new Expressao(/Matusalém/g);
expPes.lameque = new Expressao(/Lameque/g);
expPes.noe = new Expressao(/Noé/g);

expVida = {};
!function() {
    var pes = Object.keys(expPes);
    var vidaPrefix = new Expressao(/duração da vida de /); //gen 5
    for (var i = 0; i < pes.length; i++) {
        var label = pes[i];
        var pessoa = expPes[pes[i]];
        expVida[label] = vidaPrefix.sufix(pessoa).or(pessoa).setFlags("g");
        /*document.body.innerHTML = document.body.innerHTML
                .replace(expVida[label].regexp, "<span class='teste'>$&</span>");*/
    }
}();

/* ---------------------- Unidades ---------------------- */
expNum = {};
expNum.zero = new Expressao(/\bzero\b/i);
expNum.um = new Expressao(/\bum\b/i);
expNum.dois = new Expressao(/\bdois\b/i);
expNum.tres = new Expressao(/\btrês\b/i);
expNum.quatro = new Expressao(/\bquatro\b/i);
expNum.cinco = new Expressao(/\bcinco\b/i);
expNum.seis = new Expressao(/\bseis\b/i);
expNum.sete = new Expressao(/\bsete\b/i);
expNum.oito = new Expressao(/\boito\b/i);
expNum.nove = new Expressao(/\bnove\b/i);
expNum.unidades = expNum.zero.or(expNum.um).or(expNum.dois).or(expNum.tres).or(expNum.quatro)
            .or(expNum.cinco).or(expNum.seis).or(expNum.sete).or(expNum.oito).or(expNum.nove)
            .setFlags('gi');

/* ---------------------- Dezenas ---------------------- */               
exp.dez = new Expressao("dez", "i");
exp.vinte = new Expressao("vinte", "i");

dataPeriodos = [
    { id:"anoJudaico", inicio: "1/1/0", fim: "5/13/0", label: "Ano Judaico", subPeriodos: ["abibe", "zive", "sivã", "tamuz", "abe", "elul", "etanim", "bul", "quisleu", "tebete", "sebate", "adar", "adar2"],
      regexp: /#/},
    { id:"abibe", regexp: /#/, inicio: "1/1/0",  fim: "30/1/0",  label: "Abibe",   subPeriodos: [] },
    { id:"zive", regexp: /#/, inicio: "1/2/0",  fim: "30/2/0",  label: "Zive",    subPeriodos: [] },
    { id:"sivã", regexp: /#/, inicio: "1/3/0",  fim: "30/3/0",  label: "Sivã",    subPeriodos: [] },
    { id:"tamuz", regexp: /#/, inicio: "1/4/0",  fim: "30/4/0",  label: "Tamuz",   subPeriodos: [] },
    { id:"abe", regexp: /#/, inicio: "1/5/0",  fim: "30/5/0",  label: "Abe",     subPeriodos: [] },
    { id:"elul", regexp: /#/, inicio: "1/6/0",  fim: "30/6/0",  label: "Elul",    subPeriodos: [] },
    { id:"etanim", regexp: /#/, inicio: "1/7/0",  fim: "30/7/0",  label: "Etanim",  subPeriodos: [] },
    { id:"bul", regexp: /#/, inicio: "1/8/0",  fim: "30/8/0",  label: "Bul",     subPeriodos: [] },
    { id:"quisleu", regexp: /#/, inicio: "1/9/0",  fim: "30/9/0",  label: "Quisleu", subPeriodos: [] },
    { id:"tebete", regexp: /#/, inicio: "1/10/0", fim: "30/10/0", label: "Tebete",  subPeriodos: [] },
    { id:"sebate", regexp: /#/, inicio: "1/11/0", fim: "30/11/0", label: "Sebate",  subPeriodos: [] },
    { id:"adar", regexp: /#/, inicio: "1/12/0", fim: "30/12/0", label: "Adar",    subPeriodos: [] },
    { id:"adar2", regexp: /#/, inicio: "1/13/0", fim: "5/13/0",  label: "",        subPeriodos: [] },
    
    { id:"anoGregoriano", regexp: /#/, inicio: "1/1/0", fim: "5/13/0", label: "Ano Gregoriano", subPeriodos: ["mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez", "jan", "fev", "mar2"],},
    { id:"mar", regexp: /#/, inicio: "1/1/0",   fim: "10/1/0",  label: "Mar", subPeriodos: []},
    { id:"abr", regexp: /#/, inicio: "11/1/0",  fim: "10/2/0",  label: "Abr", subPeriodos: []},
    { id:"mai", regexp: /#/, inicio: "11/2/0",  fim: "11/3/0",  label: "Mai", subPeriodos: []},
    { id:"jun", regexp: /#/, inicio: "12/3/0",  fim: "11/4/0",  label: "Jun", subPeriodos: []},
    { id:"jul", regexp: /#/, inicio: "12/4/0",  fim: "12/5/0",  label: "Jul", subPeriodos: []},
    { id:"ago", regexp: /#/, inicio: "13/5/0",  fim: "13/6/0",  label: "Ago", subPeriodos: []},
    { id:"set", regexp: /#/, inicio: "14/6/0",  fim: "13/7/0",  label: "Set", subPeriodos: []},
    { id:"out", regexp: /#/, inicio: "14/7/0",  fim: "14/8/0",  label: "Out", subPeriodos: []},
    { id:"nov", regexp: /#/, inicio: "15/8/0",  fim: "14/9/0",  label: "Nov", subPeriodos: []},
    { id:"dez", regexp: /#/, inicio: "15/9/0",  fim: "15/10/0", label: "Dez", subPeriodos: []},
    { id:"jan", regexp: /#/, inicio: "16/10/0", fim: "16/11/0", label: "Jan", subPeriodos: []},
    { id:"fev", regexp: /#/, inicio: "17/11/0", fim: "14/12/0", label: "Fev", subPeriodos: []},
    { id:"mar2", regexp: /#/, inicio: "15/12/0", fim: "5/13/0",  label: "Mar", subPeriodos: []},
    
    { id:"contextoGenesis5", regexp: /#/, inicio: "1/1/0", fim: "5/13/2006", label: "Contexto Histórico de Gênesis 5", subPeriodos: [], },
    { id:"vidaAdao", inicio: "6/1/0", fim: "6/1/930", label: "Adão", subPeriodos: [], 
      regexp: expVida.adao},
    { id:"vidaSete", regexp: expVida.sete, inicio: "6/1/130", fim: "6/1/1042", label: "Sete", subPeriodos: []},
    { id:"vidaEnos", regexp: expVida.enos, inicio: "6/1/235", fim: "6/1/1140", label: "Enos", subPeriodos: []},
    { id:"vidaCaina", regexp: expVida.caina, inicio: "6/1/325", fim: "6/1/1235", label: "Cainã", subPeriodos: []},
    { id:"vidaMaalaleel", regexp: expVida.maalaleel, inicio: "6/1/395", fim: "6/1/1290", label: "Maalaleel", subPeriodos: []},
    { id:"vidaJarede", regexp: expVida.jarede, inicio: "6/1/460", fim: "6/1/1422", label: "Jarede", subPeriodos: []},
    { id:"vidaEnoque", regexp: expVida.enoque, inicio: "6/1/622", fim: "6/1/987", label: "Enoque", subPeriodos: []},
    { id:"vidaMatusalem", regexp: expVida.matusalem, inicio: "6/1/687", fim: "6/1/1656", label: "Matusalém", subPeriodos: []},
    { id:"vidaLameque", regexp: expVida.lameque, inicio: "6/1/874", fim: "6/1/1651", label: "Lameque", subPeriodos: []},
    { id:"vidaNoe", regexp: expVida.noe, inicio: "6/1/1056", fim: "6/1/2006", label: "Noé", subPeriodos: []},
    { id:"contextoNumeros1", regexp: /#/, inicio: "1/1/0", fim: "5/13/1",  label: "Contexto Histórico de Números 1", subPeriodos: ["anoSaidaEgito","ano1Recenceamento",], },
    { id:"anoSaidaEgito", regexp: /#/, inicio: "1/1/0", fim: "5/13/0", label: "Ano de saída do Egito", subPeriodos: [], },
    { id:"ano1Recenceamento", regexp: /#/, inicio: "1/1/1", fim: "5/13/1", label: "Ano do primeiro Recenseamento", subPeriodos: [], },
];

dataEventos = [
    { id: "recenseamento1", data: "1/2/1",  label: "Recenseamento" ,     regexp: /Recenseamento/},
    { id: "saidaEgito",     data: "15/1/0", label: "Saída do Egito",     regexp: /Saída do Egito/},
    { id: "nascimentoSete", data: "15/1/0", label: "Nascimento de Sete", regexp: /Nascimento de Sete/i},
];
