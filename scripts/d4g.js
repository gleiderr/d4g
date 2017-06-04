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
class Tribo extends ItemSemantico {
    constructor(dado) {
        super(dado.id);
        this.nome = dado.nome;
        this.regexp = dado.regexp;
    }
}
class Lugar extends ItemSemantico {
    constructor(dado) {
        super(dado.id);
        this.lugar = dado.lugar;
        this.nome = dado.nome;
    }
}

class ListaSemantica {
    constructor(dados, classe) {
        this.dados = dados;
        this.classe = classe;
        this.map = new Map();
    }

    add(item) {
        this.map.set(item.id, item);
    }

    get(id) {
        return this.map[id];
    }

    /* 
    Preenche [this] ListaSemantica com objetos do tipo [classe] a partir dos trechos encontrados no [texto]. Todas as expressões regulares [regexp] dos dados são avaliadas.
    */
    preencher(texto, classe) {
        var textoNovo = String(texto);
        for (var i = 0; i < this.dados.length; i++)
            if(this.dados[i].regexp.test(texto))
                this.add(new this.classe(this.dados[i]));
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

    montar(texto) {
        if(this.testar(texto)){
            this.listas.forEach(function(lista) {
                lista.preencher(texto);
            });
            return this;
        }
        return false;
    }

    get element() {
        if(!document.querySelector('#' + this.elem)) {
            d3.select('body').append('div')
                .attr('id', this.elem);
        }

        return document.querySelector('#' + this.elem);
    }
    set element(elem) {
        this.elem = elem;
    }
}
class TimeLine extends ContextoSemantico {
    constructor() {
        super();
        //this.filtro = /\banos?\b/i;
        this.elem = 'time_line'

        this.periodos = new ListaSemantica(dataPeriodos, Periodo);
        this.eventos = new ListaSemantica(dataEventos, Evento);

        this.listas = [
            this.periodos,
            this.eventos,
        ];
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
class GraficoDeBarras extends ContextoSemantico {
    constructor() {
        super();
        this.elem = 'bar_chart';
        this.tribos = new ListaSemantica(dataTribos, Tribo);
        this.listas = [
            this.tribos,
        ];
    }

    montar(texto) {
        if(super.montar(texto)){
            this.contabilizar(texto);
            return this;
        }

        return false;
    }

    desenhar(elem, texto) {
        let height = 20;
        let margin = 3;
        var fx = d3.scaleLinear()
                   .domain(this.range)
                   .range([margin, elem.clientWidth - margin]);
        var fy = d3.scaleBand()
                   .domain(this.tribos.keys())
                   .paddingInner(.05)
                   .range([0, this.tribos.size * height])
                   .round(true);

        var svg = d3.select(elem)
                    .append('svg')
                      .attr('width', elem.clientWidth)
                      .attr('height', this.tribos.size * height);

        var g = svg.selectAll('g')
            .data(this.tribos.values()).enter()
            .append('g')
              .attr('class', function(d) { return d.id; })
              .attr("transform", function(d) {
                    return "translate(" + fx(0) + ", " + fy(d.id) +")";
              });

        g.append('rect')
            .attr('height', fy.bandwidth())
            .attr('width', function(d) {
                if(d.n)
                    return fx(d.n) - fx(0); 
                else
                    return 80;
            })

        g.append('text')
            .text(function(d) {
                return d.nome + ' (' + (d.n ? d.n : '?') + ')'; 
            })
            .style("text-anchor", "initial")
            .attr('y', fy.bandwidth()/2)
            .attr('dy', '.35em')
            .attr('dx', '.5em');

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
        var max = 0;
        
        this.tribos.forEach(function(tribo) {
            if(tribo.n > max)
                max = tribo.n;
        });

        return [0, max];
    }

    contabilizar(texto) {
        this.tribos.forEach(function(tribo) {
            var num = tribo.regexp.exec(texto)[1];
            if(num) {
                num = num.replace('.', '');
                num = Number.parseInt(num);
            } else {
                num = null;
            }
            tribo.n = num;
        });
    }
}
class Geografico extends ContextoSemantico {
    constructor() {
        super();
        this.elem = 'geografico';
        this.lugares = new ListaSemantica(dataLugares, Lugar);
        this.listas = [
            this.lugares
        ];
    }

    desenhar(elem, texto) {

        var elemRaiz = d3.select("#mapa");
        var width = elem.clientWidth,
            height = 300;

        //geoOrthographic()
        var projection = d3.geoEquirectangular()
            .center([39, 30])
            .scale(4300)
            //.fitSize([width, height])
            ;

        var pathMap = d3.geoPath()
            .projection(projection);
        
        var svg = d3.select(elem)
            .append('svg');

        svg.style("width", width)
            .style("height", height)
            .style({"background-color": "lightskyblue"});

        var g = svg.selectAll('g')
            .data(this.lugares.values()).enter()
            .append('g');

        g.append('path')
            .attr('d', function(d) {
                return pathMap(d.lugar);
            })
            .style('fill', function(d) { return 'none'; })
            .style('stroke', function(d) { return 'black'; });

        g.append('g')
            .attr("transform", function(d) {
                    let xy = pathMap.centroid(d.lugar);
                    return "translate(" + xy[0] + "," + xy[1] +")";})
            .append('text')
            .text(function(d) {
                //console.log(d);
                return d.nome;
            })
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', '9');

        /*svg.append("g")
            .selectAll('path')
            .data(dataMundo.features).enter()
            .append("path")
            .attr("d", pathMap)
            .style('fill', function(d) { return 'none'; })
            .style('stroke', function(d) { return 'black'; });*/

        /*svg.append("g")
            .selectAll("circle")
            .data([[33.973333, 28.539722, "Monte Sinai"],
                   [31.500000, 29.899722, "Egito"]]).enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection(d)[0];
            })
            .attr("cy", function(d) {
                return projection(d)[1];
            })
            .attr("r", 3)
            .style("fill", function(d) {
                return d[2] == "Monte Sinai" ? "green" : "blue";
            });

        svg.append("g")
            .selectAll("text")
            .data([[33.973333, 28.539722, "Monte Sinai"],
                   [31.500000, 29.899722, "Egito"]]).enter()
            .append("text")
            //.style("font-size", "0.7em")
            .attr("x", function(d) { return projection(d)[0]; })
            .attr("y", function(d) { return projection(d)[1]; })
            //.attr("dy", ".35em")
            .attr("dx", ".35em")
            .attr("text-anchor", "begin")
            .text(function(d) { 
                return d[2];
            });*/
    }
}

!function() {
    var t = performance.now();

    d4g = {};
    d4g.texto = document.querySelector('body').innerHTML;
    d4g.contextos = [
        new TimeLine(),
        new GraficoDeBarras(),
        new Geografico()
    ];

    var c = new TimeLine();
    d4g.contextos.forEach(function(c) {
        if(c.montar(d4g.texto)){
            var elem = c.element;
            c.desenhar(elem, document.querySelector("#texto"));
            //console.log(c);
        }
    });

    // dataTribos.forEach(function(d) {
    //     var tribo = new Tribo(d.id, d.nome);

    //     var body = document.querySelector('body');
    //     body.innerHTML = body.innerHTML.replace(tribo.exp.regexp, '<span class="teste">$&</span>');
    //     /*body.innerHTML = body.innerHTML.replace(tribo.exp_n.regexp, 
    //         '<span class="teste">$&</span>(' + tribo.n(body.innerHTML) +'#)');*/

    //     console.log(tribo);
    // });

    console.log("Performace", performance.now() - t, "ms");
}();