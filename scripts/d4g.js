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
        this.cor = dado.cor;
        this.regexp = dado.regexp;
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
            console.log(this.elem);
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
        this.elem = 'time_line';

        this.periodos = new ListaSemantica(dataPeriodos, Periodo);
        this.eventos = new ListaSemantica(dataEventos, Evento);

        this.listas = [
            this.periodos,
            this.eventos,
        ];
    }
    
    desenhar(elem, texto) {
        let height = 20;
        let margin = 5;
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
        var width = elem.clientWidth,
            height = 340;

        //Se apenas o mundo for identificado, retorna sem desenhar
        if(this.lugares.values().length == 1)
            return

        /* Incluir função para atribuir melhor o objeto de fitSize() abaixo.
           Sugestão: criação de um objeto auxiliar do tipo Polygon que atribuia a área abordada.
           Este objeto deve ser compatível com o padrão GeoJSON. 
        y2 --------------------
           |                  |
           |                  |
           |                  |
        y1 --------------------
           x1                 x2
           */
        let coord = this.lugares.values().reduce(function(obj, b, c) {
            if(b.id == 'mundo')
                return obj;

            let bounds = d3.geoBounds(b.lugar);

            obj[0][0] = bounds[0][0] < obj[0][0] ? bounds[0][0] : obj[0][0];
            obj[0][1] = bounds[0][1] < obj[0][1] ? bounds[0][1] : obj[0][1];

            obj[1][0] = bounds[1][0] > obj[1][0] ? bounds[1][0] : obj[1][0];
            obj[1][1] = bounds[1][1] > obj[1][1] ? bounds[1][1] : obj[1][1];

            return obj;
        }, [[Number.MAX_VALUE, Number.MAX_VALUE], [Number.MIN_VALUE, Number.MIN_VALUE]]);
        let dx = coord[1][0] - coord[0][0];
        let dy = coord[1][1] - coord[0][1];
        coord[0][0] -= 0.05 * dx;
        coord[1][0] += 0.05 * dx;
        coord[0][1] -= 0.05 * dy;
        coord[1][1] += 0.05 * dy;

        let fitSize = {"type":"LineString","coordinates": coord};

        //geoOrthographic()
        var projection = d3.geoEquirectangular()
            .fitSize([width, height], fitSize);

        var pathMap = d3.geoPath()
            .projection(projection);
        
        var svg = d3.select(elem)
            .append('svg')
            .style('background', 'cornflowerblue');

        svg.style("width", width)
            .style("height", height);

        var g = svg.selectAll('g')
            .data(this.lugares.values()).enter()
            .append('g');

        var initStroke = function() {
            g.style('stroke-width', function(d) {
                if(d.lugar.type === 'LineString')
                    return 1;
                return 0;
            });
        };
        initStroke();

        g.append('path')
            .attr('d', function(d) {
                return pathMap(d.lugar);
            })
            .attr('class', function(d) { return d.id; });

        g.append('g')
            .attr("transform", function(d) {
                    let xy = pathMap.centroid(d.lugar);
                    return "translate(" + xy[0] + "," + xy[1] +")";})
            .style('display', function(d) {
                if(d.lugar.type === 'Polygon')
                    return 'none';
                else
                    return 'block';
            })
            .append('text')
            .text(function(d) { return d.nome; })
            .style('fill', 'black')
            .style('text-anchor', function(d) {
                if(d.lugar.type === 'LineString')
                    return 'left'
                return 'middle';
            })
            .style('font-size', '9')
            .style('cursor', 'default');

        var legenda = svg.append('g')
            .append('text')
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', '9')
            .style('cursor', 'default');


        var selectText = function() {
            let paragraph = d3.selectAll('p').nodes();
            let mousePos = d3.mouse(this);
            let longLat = projection.invert(mousePos);

            g.each(function(d) {
                if(d.id === 'mundo')
                    return;

                let contains = d3.geoContains(d.lugar, longLat);
                let t1 = '<span class="' + d.id + '">';
                let t2 = "<\/span>";
                if(contains && !d.selected) {
                    d.selected = true;
                    paragraph.forEach(function(p) {
                        if(d.regexp.test(p.innerHTML))
                            p.innerHTML = p.innerHTML.replace(d.regexp.regexp, t1 + '$&' + t2);
                    })
                } else if(!contains) {
                    d.selected = false;
                    let e = d.regexp.afix(t1 + '(', ')' + t2);
                    paragraph.forEach(function(p) {
                        if(e.test(p.innerHTML))
                            p.innerHTML = p.innerHTML.replace(e.regexp, '$1');
                    })
                }

            });
        }

        svg.on('mousemove.selectText', selectText);
        svg.on('mousemove.destaque', function() {
            let mousePos = d3.mouse(this);
            let longLat = projection.invert(mousePos);

            g.style('stroke-width', function(d) {
                if(d.id == 'mundo') 
                    return 0;
                if(d.lugar.type === 'LineString')
                    return d3.geoContains(d.lugar, longLat) ? 3 : 1;

                return d3.geoContains(d.lugar, longLat) ? 2 : 0;
            });

            //Controlando exibição da legenda de territórios
            g.each(function(d) {
                let contains = d3.geoContains(d.lugar, longLat);
                if(d.lugar.type === 'Polygon') {
                    if(contains) {
                        if(!legenda.text().includes(d.nome))
                            legenda.text(legenda.text() + ', ' + d.nome);
                    } else {
                        let r = new RegExp('(?:, )?' + d.nome);
                        legenda.text(legenda.text().replace(r, ''))
                    }
                    legenda.text(legenda.text().replace(/^, /, ''));

                    legenda.attr('transform', function() {
                        let xy = mousePos;
                        return "translate(" + xy[0] + "," + xy[1] +")";
                    });
                }
            });
        });
        svg.on('mouseout', initStroke);
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

    //var c = new TimeLine();
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