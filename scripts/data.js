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

    convert(e) {
        if(e instanceof RegExp)
            return e.source;
        else if(e instanceof Expressao)
            return e.exp;
        else
            return e;
    }

    or(e) {
        return new Expressao(this.exp + '|' + this.convert(e), this.flags);
    }

    prefix(p) {
        return new Expressao(this.convert(p) + this.exp, this.flags);
    }

    sufix(s) {
        return new Expressao(this.exp + this.convert(s), this.flags);
    }

    afix(pre, suf) {
        return new Expressao(this.convert(pre) + this.exp + this.convert(suf), this.flags);
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

    exec(str) {
        return this.regexp.exec(str);
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

dataTribos = [
    { id: 'triboRuben', nome: 'Rúben'},
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
    { id: 'triboLevi', nome: 'Levi', regexp: /Levi|[lL]evitas/},
];
dataTribos.forEach(function(tribo) {
    var prefix = new Expressao('tribo de ').or('descendentes de ').or('de ').or('filhos de ')
                                                                      .afix('(?:', ')?');
    var sufix = new Expressao(', foram recenseados ').or(' foi ').afix('(?:', ')')
                                                          .sufix(/([\d\.]*\b)(?: homens)?/);
    if(!tribo.regexp)
        tribo.regexp = new Expressao(tribo.nome, 'g').prefix(prefix).sufix(sufix);
    else
        tribo.regexp = new Expressao(tribo.regexp, 'g').prefix(prefix).sufix(sufix);
});

dataLugares = [
    { id: 'mundo', nome: '', regexp: /(?:)/,
      lugar: {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[34.25262451171875,31.334871033950602],[33.453369140625,31.109388560814963],[32.607421875,31.043521630684204],[32.255859375,31.2221970321032],[31.431884765624996,31.484893386890164],[30.399169921874996,31.456782472114313],[29.498291015624996,30.949346915468563],[26.455078125,31.44741029142872],[21.62109375,32.84267363195431],[19.51171875,32.175612478499325],[19.6875,30.600093873550072],[44.208984375,10.833305983642491],[40.78125,14.859850400601037],[36.9140625,21.37124437061832],[35.79345703125,23.82555130688476],[33.59619140624999,27.829360859789794],[32.947998046875,28.51696944040106],[32.67333984375,29.084976575985912],[32.58544921875,29.35345166863502],[32.36572265625,29.5830116903775],[32.464599609375,29.888280933159265],[32.5634765625,29.983486718474694],[32.596435546875,29.916852233070173],[32.6953125,29.726222319395504],[32.783203125,29.34387539941801],[33.1787109375,29.017748018496047],[33.24462890625,28.536274512989916],[33.57421875,28.20760859532738],[34.16748046875,27.72243591897343],[34.4091796875,27.97499795326776],[34.4970703125,28.478348692223165],[34.716796875,29.171348850951507],[34.97772216796875,29.487424847484814],[34.64813232421875,28.05259082333986],[35.39520263671875,27.994401411046145],[37.24090576171875,25.16517336866393],[38.82293701171875,21.28937435586041],[41.98699951171875,16.888659787381584],[43.83270263671875,12.726084296948184],[49.19403076171875,14.519780046326073],[52.79754638671875,16.299051014581828],[58.44451904296875,19.414792438099543],[59.63653564453125,22.558220454844047],[58.54339599609375,23.71495350699027],[56.26527786254883,24.766316905851003],[56.35668754577637,26.337037679874786],[55.35781145095825,25.37429386251613],[54.37200844287872,24.294072652463566],[51.85762256383896,24.071854774073064],[51.41341790556908,24.601522365584415],[51.520905420184135,25.77913316555136],[51.201114021241665,26.127132225502585],[50.71467203088105,25.581461786974963],[50.01002525445074,25.961409391745317],[49.042467491235584,27.445328995128204],[48.163371019181795,28.963384342802577],[47.7897407519049,29.542332143759676],[48.767476399516454,30.0780612001631],[50.06933250457223,30.268966559692878],[50.66806360962801,29.354823856563318],[51.50264410302043,27.982218255862733],[53.561986684799194,26.82758452117467],[55.19389629364014,26.781590901134486],[56.448097229003906,27.06799194630793],[57.16529846191406,25.985823184907993],[60.709075927734375,24.912594936400826],[66.566162109375,25.624192441211985],[67.73345947265625,24.02137934290031],[71.29852294921875,24.487148563173438],[70.19989013671875,26.667095801104843],[71.86981201171875,27.994401411046173],[75.03387451171875,32.39851580247402],[71.07879638671875,34.30714385628804],[71.60614013671875,38.13455657705411],[65.19012451171875,37.020098201368135],[61.76239013671875,35.60371874069737],[58.77410888671875,37.50972584293751],[53.94012451171875,37.370157184057504],[50.95184326171875,36.80928470205935],[48.57879638671875,38.479394673276424],[42.16278076171875,41.50857729743936],[39.08111572265625,40.87510302216582],[34.68109130859375,42.15322331239858],[30.80291748046875,41.290189955885644],[26.56219482421875,40.6056120582602],[26.34246826171875,38.66835610151509],[29.41864013671875,36.49197347059371],[32.75848388671875,36.08462129606931],[33.85711669921875,36.25756282630298],[34.69207763671875,36.81808022778526],[35.79071044921875,36.40802070382981],[35.87860107421875,35.17380831799959],[34.82391357421875,32.41706632846285],[34.25262451171875,31.334871033950602]]]},"properties":{}}]}},
    { id: 'neguebe', nome: 'Negueb', regexp: new Expressao(/Neguebe/), 
      lugar: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[34.6563720703125,31.863562548378965],[34.46960449218749,31.59725256170666],[34.20043945312499,31.325486676506983],[34.244384765625,31.28793989264176],[34.266357421875,31.22689446881399],[34.310302734375,31.095278060807935],[34.3597412109375,30.968189296794247],[34.43115234375,30.798474179567823],[34.4915771484375,30.675715404167743],[34.530029296875,30.500750980290693],[34.530029296875,30.424992973925598],[34.595947265625,30.363396239603716],[34.6893310546875,30.14512718337613],[34.8101806640625,29.826348356278118],[34.859619140625,29.67850809103362],[34.859619140625,29.554345125748267],[34.903564453125,29.48742484748479],[34.9639892578125,29.511330027309146],[34.9749755859375,29.5830116903775],[35.00244140625,29.692824739380754],[35.04638671874999,29.816816857649936],[35.07385253906249,29.940655389125002],[35.1507568359375,30.107117887092382],[35.1397705078125,30.287531589298727],[35.19470214843749,30.315987718557867],[35.1727294921875,30.462879341709886],[35.2001953125,30.61427741282775],[35.2606201171875,30.675715404167743],[35.2935791015625,30.755998458321667],[35.3375244140625,30.817346256492073],[35.3704833984375,30.91636380602182],[35.419921875,30.958768570779846],[35.419921875,31.043521630684204],[35.4583740234375,31.12819929911196],[35.39794921875,31.2221970321032],[35.4034423828125,31.306715155075167],[35.4693603515625,31.423975737976722],[35.4638671875,31.50362930577303],[35.4144287109375,31.49426181553272],[35.35400390625,31.475524020001806],[35.28808593749999,31.42866311735861],[35.2276611328125,31.3864682695423],[35.1177978515625,31.358327833411312],[35.0299072265625,31.363018491291182],[34.92553710937499,31.353636941500987],[34.8760986328125,31.400535326863935],[34.91455078125,31.47083898476439],[34.9365234375,31.60193125799097],[34.9090576171875,31.639352364896208],[34.8541259765625,31.737511125687828],[34.7882080078125,31.784216884487385],[34.6563720703125,31.863562548378965]]]}}]}},
    { id: 'canaa', nome: 'Canaã', regexp: /Canaã/g,
      lugar: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[34.727783203125,32.001088607540446],[34.6563720703125,31.863562548378965],[34.46960449218749,31.59725256170666],[34.20043945312499,31.325486676506983],[34.244384765625,31.28793989264176],[34.266357421875,31.22689446881399],[34.310302734375,31.095278060807935],[34.3597412109375,30.968189296794247],[34.43115234375,30.798474179567823],[34.4915771484375,30.675715404167743],[34.530029296875,30.500750980290693],[34.530029296875,30.424992973925598],[34.595947265625,30.363396239603716],[34.6893310546875,30.14512718337613],[34.8101806640625,29.826348356278118],[34.859619140625,29.67850809103362],[34.859619140625,29.554345125748267],[34.903564453125,29.48742484748479],[34.9639892578125,29.511330027309146],[34.9749755859375,29.5830116903775],[35.00244140625,29.692824739380754],[35.04638671874999,29.816816857649936],[35.07385253906249,29.940655389125002],[35.1507568359375,30.107117887092382],[35.1397705078125,30.287531589298727],[35.19470214843749,30.315987718557867],[35.1727294921875,30.462879341709886],[35.2001953125,30.61427741282775],[35.2606201171875,30.675715404167743],[35.2935791015625,30.755998458321667],[35.3375244140625,30.817346256492073],[35.3704833984375,30.91636380602182],[35.419921875,30.958768570779846],[35.419921875,31.043521630684204],[35.4583740234375,31.12819929911196],[35.39794921875,31.2221970321032],[35.4034423828125,31.306715155075167],[35.4693603515625,31.423975737976722],[35.4638671875,31.50362930577303],[35.4913330078125,31.62064369245056],[35.55725097656249,31.76086695137955],[35.540771484375,31.835565983656227],[35.54901123046875,31.963813739260456],[35.518798828125,32.045332838858506],[35.5682373046875,32.22674287041067],[35.5517578125,32.393877575286446],[35.57647705078124,32.648625783736726],[35.7550048828125,32.75032260780972],[35.82916259765625,32.8219030154127],[35.88958740234375,32.9372338139709],[35.83465576171875,33.18813395605041],[35.782470703125,33.273139123013486],[35.8099365234375,33.30987251398259],[35.760498046875,33.33511774753217],[35.61492919921875,33.24098472320831],[35.57098388671875,33.29150775159364],[35.5462646484375,33.23639027157906],[35.4913330078125,33.089240433964726],[35.36773681640625,33.050112271849656],[35.30731201171875,33.10304621868762],[35.09857177734375,33.091541548655215],[35.08209228515625,32.96949953291244],[35.02716064453125,32.810361684869015],[34.96124267578125,32.828827094089085],[34.91455078125,32.61392993783568],[34.8760986328125,32.41938487611333],[34.81292724609375,32.224419385153006],[34.727783203125,32.001088607540446]]]}}]}},
    { id: 'hebrom', nome: 'Hebrom', regexp: /Hebrom/g,
      lugar: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[35.095,31.533333]}}]}},
];

dataLugares.forEach(function(d) {
    d.lugar.features.forEach(function(d) {
        if(d.geometry.type === 'Polygon')
            for(let i = 0; i < d.geometry.coordinates.length; i++){
                console.log(d);
                d.geometry.coordinates[i] = d.geometry.coordinates[i].reverse();
                //console.log('invert', d.geometry.coordinates[i]);
            }
    });
});