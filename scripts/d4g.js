class Data {
    constructor(data) {
        var aux = data.split('/');
        this.dia = +aux[0];
        this.mes = +aux[1];
        this.ano = +aux[2];
    }

    get abs() { 
        return (this.ano * 365) + 
              ((this.mes-1) * 30) + 
                this.dia;
    }

    static dif(d1, d2) {
        let dia = d2.dia - d1.dia;
        let mes = d2.mes - d1.mes;
        let ano = d2.ano - d1.ano;
        let s = String(dia) + '/' + String(mes) + '/' + String(ano);
        return new Data(s);
    }
}

class ItemSemantico {
    constructor(id){
        this.id = id;
    }
};
class Evento extends ItemSemantico {
    constructor(dado) {
        super(dado.id);
        this.data = new Data(dado.data);
        this.label = dado.label;
        this.regexp = dado.regexp;
    }
}
class Periodo extends ItemSemantico {
    constructor(dado){
        super(dado.id);
        this.inicio = new Data(dado.inicio);
        this.fim = new Data(dado.fim);
        this.label = dado.label;
        this.regexp = dado.regexp;
    }
};

class ListaSemantica {
    constructor(dados) {
        this.dados = dados;
        this.map = new Map();
    }

    add(item) {
        this.map.set(item.id, item);
    }

    get(id) {
        return this.map[id];
    }

    /* 
    Preenche [this] ListaSemantica com objetos do tipo [classe] a partir dos trechos encontrados no [texto]. Todas as expressões regulares [regexp] dos dados são avaliadas. Ao encontrar um texto relacionado ele é substituído pela tag <span>
    */
    preencher(texto, classe) {
        var textoNovo = String(texto);
        for (var i = 0; i < this.dados.length; i++)
            if(this.dados[i].regexp.test(texto)) {
                this.add(new classe(this.dados[i]));
                //textoNovo = textoNovo.replace(this.dados[i].regexp, "<span class='")
            }
    }

    forEach(callBack, thisArg) {
        return this.map.forEach(callBack, thisArg);
    }

    values() {
        var v = [];
        this.forEach(function(d) {
            v.push(d);
        });
        return v;
    }

    keys() {
        var k = [];
        this.forEach(function(d, i) {
            k.push(i);
        });
        return k;   
    }

    get size() {
        return this.map.size;
    }
}

class ContextoSemantico {
    constructor() {
        this.filtro = /()/;
        this.listas = [];
    }
    
    testar(texto) {
        return this.filtro.test(texto);
    }
}
class TimeLine extends ContextoSemantico {
    constructor() {
        super();
        //this.filtro = /\banos?\b/i;

        this.periodos = new ListaSemantica(dataPeriodos);
        this.eventos = new ListaSemantica(dataEventos);
    }
    montar(texto) {
        if(this.testar(texto)){
            this.periodos.preencher(texto, Periodo);
            this.eventos.preencher(texto, Evento);
            return this;
        }
        return false;
    }
    desenhar(elem, texto) {
        let height = 20;
        let margin = 28;
        var fx = d3.scaleLinear()
                   .domain(this.range)
                   .range([margin, elem.clientWidth - margin]);
        var fy = d3.scaleBand()
                   .domain(this.periodos.keys())
                   .range([0, this.periodos.size * (height)])
                   .round(true);

        var svg = d3.select(elem)
                    .append('svg')
                      .attr('width', elem.clientWidth)
                      .attr('height', (this.periodos.size) * 
                                      (height));

        var g = svg.selectAll('g')
            .data(this.periodos.values()).enter()
            .append('g')
              .attr('class', function(d) { return d.id; })
              .attr("transform", function(d) {
                    return "translate(" + fx(d.inicio.abs) + "," + fy(d.id) +")";
              });

        g.append('rect')
            .attr('height', fy.bandwidth())
            .attr('width', function(d) { 
                return fx(d.fim.abs + 1) - fx(d.inicio.abs); 
            })

        g.append('text')
            .text(function(d) {
                let tempo = Data.dif(d.inicio, d.fim);
                return d.label + '(' + tempo.ano + ' anos)'; 
            })
            .style("text-anchor", "middle")
            .attr('y', fy.bandwidth()/2)
            .attr('dy', '.35em')
            .attr('x', function(d) { return (fx(d.fim.abs + 1) - fx(d.inicio.abs))/2; });

        texto.innerHTML_ant = texto.innerHTML;
        g.on('mouseover', function(d) {
            let t1 = "<span class='" + d.id + "'>";
            let t2 = "</span>";
            texto.innerHTML = texto.innerHTML.replace(d.regexp.regexp, t1 + '$&' + t2);
        });
        g.on('mouseleave', function(d) {
            texto.innerHTML = texto.innerHTML_ant;
        });
    }

    get range() {
        var max = 0, min = Infinity;
        
        this.periodos.forEach(function(d) {
            if(d.inicio.abs < min)
                min = d.inicio.abs;
            if(d.fim.abs > max)
                max = d.fim.abs;
        });

        this.eventos.forEach(function(d) {
            if(d.data.abs < min)
                min = d.data.abs;
            if(d.data.abs > max)
                max = d.data.abs;
        })

        return [min, max];
    }
}

!function() {
    var t = performance.now();

    d4g = {};
    d4g.texto = document.querySelector('body').innerHTML;
    d4g.contextos = [];

    var c = new TimeLine();
    if(c.montar(d4g.texto)){
        d4g.contextos.push(c);
        c.desenhar(document.querySelector("#timeline"), document.querySelector("#texto"));
        //console.log(c);
    }

    /*for (var i = 0; i < d4g.contextos.length; i++) {
        d4g.contextos[i].montar();
    }*/

    console.log("Performace", performance.now() - t, "ms");
}();