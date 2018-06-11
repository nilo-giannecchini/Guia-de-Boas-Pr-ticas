# Guia de Boas Práticas

Este documento é um guia de boas práticas que tem por objetivo reduzir as dificuldades de implementação, adaptação e manutenção de ambientes de integração contínua (IC) utilizando NodeJS e GruntJS

## Ferramentas utilizadas

* [NodeJS](https://nodejs.org/en/download/)
* [Visual Code](https://code.visualstudio.com/Download)
* [Git](https://git-scm.com/downloads)

## Instalações

### Ferramentas

Recomendamos a instalação do Visual Code para IDE como editor de codificação por ser open source, com vários plugins que ajudam no desenvolvimento e por ter uma boa integração com as linguagens web utilizadas (HTML, CSS, JavaScript). Suporta tambem outras linguagens como C++, Java, Python e .net. A Figura 1 apresenta a interface inicial do Visual Code.
![Visual Code](/img/VisualCode.png)

Figura 1: Interface Inicial do Visual Code

Outra ferramenta a ser instalada no ambiente é o Git que fará o controle de versão dos artefatos produzidos. Após a instalação do Git, podemos ver sua versão na linha de comando como mostra a Figura 2.

```shell
    git version
```

![Versão do Git](/img/VersaoGit.png)

Figura 2: Interface go Git apresentando a versão corrente

Com a instalação do NodeJs, instala-se simultaneamente a plataforma `node` e o gerenciador de pacotes `npm`. A Figura 3 apresenta a versão do `node` enquanto que a versão do `npm` é apresentada na Figura 4. 

```shell
    node -v
```

![Versão do Node](/img/NodeVersion.png)

Figura 3: Versão do `node` instalada no ambiente de IC

```shell
    npm -v
```

![Versão do Npm](/img/NpmVersion.png)

Figura 4: Versão do `npm` instalada no ambiente de IC

### Pacotes

Inicialmente, os pacotes que devemos instalar globalmente são `grunt`, `grunt-cli`, `karma-cli`. A linha de comando a seguir, também apresentada na Figura 5, permite a instalação desses pacotes.

```shell
    npm install -g grunt grunt-cli karma-cli
```

![Setup Inicial](/img/InitialSetup.png)

Figura 5: Interface mostrando a instalação dos pacotes necessários para o processo de IC

Após a instalação, podemos executar o comando para verificar se o grunt-cli foi instalado corretamente. Um alerta (warning) ocorre quando o comando não encontrou o arquivo gruntfile para executar as tarefas, conforme mostra a Figura 6.

```shell
    grunt -v
```

![Versão do Grunt](/img/GruntCli.png)

Figura 6: Interface apresentada na verificação do grunt-cli 

## Configurações

### Karma

O Karma é uma ferramenta que permite a execução do código-fonte (ou seja, JavaScript) contra navegadores reais através da interface de linha de comando (CLI). Como as implementações de DOM (Document Object Model) variam em todos os navegadores, a idéia é usar os navegadores reais para ampliar a correção. O trecho de código apresentado na Figura 7 sugere uma configuração do Karma para um ambiente de IC.

```javascript
// Karma configuration
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "./",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: [
      "app/bower_components/angular/angular.js",
      "app/bower_components/angular-mocks/angular-mocks.js",
      "app/bower_components/angular-route/angular-route.js",
      "app/bower_components/angular-ui-router/release/angular-ui-router.js",
      "app/js/*.js",
      "app/js/**/**/*.js",
      "test/unit/*.js",
      "test/unit/**/*.js"
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
   preprocessors: { "app/js/**/**/*.js": ["coverage"] },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "coverage", "junit"],
    
    coverageReporter: {
      dir: "reports/coverage/",
      reporters: [
        { type: "html", subdir: "report-html" },
        { type: "cobertura", subdir: ".", file: "cobertura-coverage.xml" }
      ]
    },
    
    junitReporter: {
      outputDir: "reports/unit-tests",
      outputFile: "test-results.xml",
      suite: "unit-tests",
      useBrowserName: false
    },
    
    plugins : [
      "karma-jasmine",
      "karma-phantomjs-launcher",
      "karma-chrome-launcher",
      "karma-coverage",
      "karma-junit-reporter"
    ],
    
    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["PhantomJS"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
```

Figura 7: Configuração do Karma para o ambiente de IC

### GruntJS

O Grunt é uma aplicação de linha de comando que tem como objetivo automatizar tarefas, principalmente tarefas em aplicações JavaScript. Para que o Grunt atue, escreve-se as tarefas em JavaScript e roda-se no Node.JS. A Figura 8 apresenta um trecho de código para a execução e análise de resultados.

```javascript
var grunt = require('grunt');
var bootlint = require('grunt-bootlint');
var gutil = require("grunt-util");
var Server = require('karma').Server;

var itensRelatorioBootlint = []; //Itens do relatório do bootlint

// Run test once and exit
grunt.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

// Análise dos arquivos html
grunt.task("bootlint", function () {
    var fileIssues = [];
    console.log();

    gutil.log(gutil.colors.blue("Consulte o glossário de códigos em: https://github.com/twbs/bootlint/wiki/"));

    console.log();

    return grunt.src("./app/views/*.html")
        .pipe(bootlint({
            stoponerror: false,
            stoponwarning: false,
            loglevel: "debug",
            disabledIds: [], //desabilitar regras específicas
            issues: fileIssues,
            reportFn: function (file, lint, isError, isWarning, errorLocation) {

                var message = (isError) ? gutil.colors.red("ERROR! - ") : gutil.colors.yellow("WARN! - ");
                if (errorLocation) {
                    message += file.path + " (line:" + (errorLocation.line + 1) + ", col:" + (errorLocation.column + 1) + ") [" + lint.id + "] " + lint.message;
                } else {
                    message += file.path + ": " + lint.id + " " + lint.message;
                }

                gutil.log(message + "\n");
                message = message + "\n";

                var item = {};
                item.arquivo = file.path;
                item.temErro = false;
                item.isWarning = isWarning;
                item.isError = isError;

                if (isError || isWarning) {
                    item.temErro = true;
                    item.idErro = lint.id;
                    item.mensagemErro = lint.message.replace(/[<>]/g, "");
                    if (errorLocation) {
                        item.coluna = (errorLocation.column + 1);
                        item.linha = (errorLocation.line + 1);
                    }
                }
                itensRelatorioBootlint.push(item);
            },
            summaryReportFn: function (file, errorCount, warningCount) {
                if (errorCount > 0 || warningCount > 0) {
                    if (errorCount > 0) {
                        gutil.log(gutil.colors.red("Por favor, corrija  " + errorCount + " erros") + " no arquivo: " + file.path);
                    }
                    if (warningCount > 0) {
                        gutil.log(gutil.colors.yellow("Por favor, corrija  " + warningCount + " warnings") + " no arquivo: " + file.path)
                    }
                } else {
                    gutil.log(gutil.colors.green("Nenhum problema encontrado no arquivo " + file.path + "\n"));
                }
                console.log();
            }
        }));
});

grunt.task("default", ["test", "bootlint"]);
```
Figura 8: Exemplo de uso do GruntJS

## Exemplos

Esta parte do manual traz exemplos dos tipos de testes unitário (Figura 9) e de integração (Figura 10). 


### Unitários

```javascript
describe("poc SPA - Módulo Principal", function() {
    
    beforeEach(angular.mock.module('ui.router'));

    var pocSPA = module("pocSPA");
    
    it("deve ter o módulo de pocSPA definido", function(){
       expect(pocSPA).toBeDefined(); 
    });
});
```

Figura 9: Exemplo de Teste Unitário

### Integração

```javascript
describe("poc SPA - Módulo Ajuste Lista", function () {
	
	beforeEach(function () {
        angular.module("arq-spa.navegacao", []);
    });

    // Criar mocks dos providers da arquitetura
    beforeEach(module(function ($provide) {
        $provide.provider("navigator", function () {
            this.addNavigator = jasmine.createSpy("addNavigator");
            this.createNavigator = function () {
                return {
                    adicionarEstado: function () { return this; },
                    definirEstadoInicial: function () { return this; }
                }
            };
            this.$get = function () {
                return {
                    navegar: jasmine.createSpy("navegar"),
                    iniciarFluxo: jasmine.createSpy("iniciarFluxo"),
                    encadeamento: function() { return {}; },
                    voltar: jasmine.createSpy("voltar"),
                };
            };
        });
		$provide.service("context", function () {
            this.getValueContext = jasmine.createSpy("getValueContext");
            this.getValueContext = function() { return "123132"; };
            this.setValueContext = jasmine.createSpy("setValueContext");
        });
		$provide.service("memory", function () {
            this.obter = function() { return {}; };
        });
    }));

    // Mock do provider window
    beforeEach(module(function ($provide) {
        $provide.service("$window", function() { 
            return { ga: function() {} }; 
        });
    }));

    // Módulo do serviceExport
	beforeEach(module(function ($provide) {
		$provide.service("serviceExport", function () {
            this.relatorio_ajustes_data = function() { return { save: function() {} } };
			this.exportCSVNew = function() { return null; };
        });
    }));

    // Carrega o módulo no contexto
	beforeEach(module("ajustes"));
	beforeEach(module("comunicacao"));

    // Pega o controller
    var $controller;
    var executeService;
    beforeEach(inject(function(_$controller_, _executeService_){
        $controller = _$controller_;
        executeService = _executeService_;
    }));

    // Executa os testes
    it("fluxo padrão", function () {
        var ctrl = $controller("ctrlAjustes", { executeService: executeService });
        ctrl.visualizarMais();
        ctrl.exportarPDF();
        ctrl.exportarCSVClick();
        ctrl.goBack();
    });
});
```

Figura 10: Exemplo de Teste de Integração

### Boas práticas

Os testes automatizados constituem um item importante de controle de qualidade de software e oferecem também uma maneira confiável de se acompanhar o progresso de uma equipe de desenvolvimento em relação aos requisitos do projeto.

Para avaliar a qualidade de testes sobre o código é necessário estimar uma cobertura sobre a parte do código que foi submetida aos testes, isto é, a cada execução de uma bateria de testes, verificar se existe alguma linha de código que não foi exercitada pelos testes. Não apenas os testes de unidade deveriam ser avaliados em relação à cobertura, mas também os testes de sistema e especialmente os testes funcionais. De uma maneira simplificada, se a execução dos testes passa por todo o código, podemos confiar que tudo o que foi previsto pelo sistema foi testado. Porém, a cobertura medida em linhas de código pode oferecer uma visão errônea da abrangência dos testes. Uma mesma linha pode participar de vários caminhos de execução diferentes, e cada caminho traz diferentes configurações de objetos em memória.

Hoje já temos ferramentas capazes de cruzar a cobertura medida em termos de linhas exercitadas pelos testes com os caminhos possíveis de execução dentro de um método. Por outro lado, testar todos esses caminhos pode representar esforço excessivo em relação aos benefícios obtidos.

#### Não se precipite

Não tente pular o ciclo dos testes por conhecer o método. É importante manter o ciclo Red, Green, Refactor, uma vez que vai fazer com que se acostume através da prática e disciplina, e com o tempo ganha-se agilidade e melhor visão do processo de desenvolvimento.

#### O código de teste é o mesmo que o código produtivo

O código de teste deve ser bem estruturado e legível para facilitar o entendimento por todos os desenvolvedores. Ficando separado em etapas bem definidas e possuir um bom report, vai permitir termos nossa documentação dos testes.

#### Não acople os testes

Se os testes foram fortemente acoplados, ocorre a quebra em cascata, chamado de efeito dominó dificultando a busca de erros. Com os testes desacoplados auxilia o design de código, garantindo a modularidade e manutenção.

#### Somente um teste por vez

No padrão TDD, escrevemos um teste de cada vez. Somente iniciamos o próximo teste quando o primeiro estiver validado. Assim, evitamos testes escritos pela metade e mitigamos a possibilidade de esquecer algo inacabado no desenvolvimento.

#### Teste somente o necessário

Se o código utilizar bibliotecas de mercado, não é necessário testar os métodos expostos por elas uma vez que a empresa ou a comunidade já testaram amplamente essas bibliotecas, evitando criação de testes desnecessários.

#### Um teste único por função

Os testes desenvolvidos devem ser pequenos, funcionais e específicos para um método. Testes desenvolvidos para vários métodos é um erro que dificulta a manutenção e a leitura dos testes.

#### Testes unitários

Os testes de unidade são apenas parte de um processo bem mais amplo de controle efetivo de qualidade de software.

Nem todas as classes de uma aplicação podem ser testadas de modo isolado, seja porque elas necessitam de outras classes da própria aplicação, ou porque precisam de acesso a recursos externos como, por exemplo, bancos de dados relacionais. Testar uma classe juntamente com seus pré-requisitos consiste em um teste de integração. Então, ou não será possível criar testes de unidade para algumas classes da aplicação, ou então será necessário fornecer “simulações” destas dependências na forma de objetos mock.

É importante perceber que usar objetos mock em todas as camadas de uma aplicação, de modo a ter testes de unidade para todas as classes e métodos de uma aplicação, não elimina a necessidade de se ter também os outros tipos de testes.

O teste unitário deve ser escrito observando as perguntas abaixo:

*O que eu estou testando?*

*O que o método deveria fazer?*

*Qual o seu atual retorno?*

*O que eu espero que retorne?*

* "Os nomes dos testes devem conter o 'o que' e o 'porquê' na perspectiva do usuário" – o desenvolvedor deve ser capaz de ler o nome do teste e identificar para qual funcionalidade ele foi escrito.

* Se houver uma condicional no teste, os blocos do "se" e do "senão" devem ser métodos diferentes. 

* Se no teste também tiverem blocos de condição, então o teste deve ser refatorado.

#### Testes de integração

Os testes de integração serão influenciados por nomes de classes, protocolos de rede e outros detalhes de implementação, mas ainda irão exigir a presença de várias classes. Por exemplo, um objeto de negócios e vários objetos persistentes poderão ser necessários para um único teste. Também poderão ser necessários recursos externos ao código da aplicação como, por exemplo, um servidor de banco de dados. Também para esse tipo de teste, em muitos casos, será necessário fornecer “simulações” das dependências na forma de objetos mock.

#### Testes de sistemas

A execução de testes de sistema dentro de ambientes de integração contínua pode ser complexa, dependendo das tecnologias adotadas e da forma como a arquitetura e design das classes foram definidos.

#### Testes de regressão

Quando qualquer sistema é exposto ao usuário final, é inevitável a constatação da existência de erros na aplicação. Uma prática bastante efetiva de SQA é gerar testes que exercitam cada bug em particular. Estes testes são utilizados para ajudar o desenvolvedor a isolar a causa do erro, e permitem ao gerente de projeto verificar se o bug foi realmente eliminado.

Se estes testes forem incorporados à bateria de testes da aplicação, e forem re-executados a cada release evita-se que o bug apareça novamente. Os “bugs recorrentes”, ou regressões, são um dos problemas mais comuns com sistemas que já sofreram vários releases ou que sofreram várias mudanças em sua equipe de desenvolvimento.

#### Testes de desempenho

Qualquer tipo de recurso do sistema (hardware, software, banda de rede, etc.) que limite o fluxo dos dados ou a velocidade de processamento cria um gargalo. Nas aplicações web, eles afetam o desempenho e até mesmo a escalabilidade, limitando o throughput de dados e/ou o número de conexões suportadas pela aplicação.

Os gargalos podem ocorrer em todos os níveis de arquitetura de um sistema, tais como a camada de rede, servidor de aplicações, servidor de dados e servidor web. Entretanto, conforme apontam muitos estudos e experiências, quem causa a maior parte dos gargalos de desempenho é o código do aplicativo.

#### Throughput

Basicamente, throughput ou vazão é a capacidade da aplicação ou uma parte da mesma executar uma operação de forma repetida, em um determinado período de tempo. Por exemplo, o throughput de uma página é a quantidade de vezes por segundo que conseguimos receber uma resposta dessa página.

Esses números são muito importantes porque definem a capacidade da aplicação, medida em acessos por segundo, páginas por segundo ou megabits por segundo. A maior parte de todos os problemas de desempenho é causada por limitações no throughput.

#### Tempos de resposta

É o tempo que a aplicação demora para concluir um processo de transação. No caso de uma página, é o tempo que a aplicação demora para dar o retorno apropriado para o usuário final. É importante medir o tempo de resposta porque a aplicação pode ser rejeitada pelo usuário se não responder dentro de um tempo esperado, mesmo tendo disponibilidade imediata – levando o mesmo a abandonar a página ou até mesmo acessar a página de concorrentes.

O tempo de resposta envolve o período necessário para retornar à solicitação realizada no servidor web. Cada solicitação deve ser processada e enviada para o servidor de aplicação, que também pode realizar um pedido ao servidor de banco de dados. Tudo isso voltará pelo mesmo caminho até o usuário. O tempo necessário para o retorno também está relacionado com a latência da rede entre os servidores e o usuário.

#### Antes de tudo, avalie a infraestrutura de rede da aplicação

Antes de executar cada teste de desempenho, faça uma avaliação minuciosa na infraestrutura de rede que suporta a aplicação. Se o sistema não suportar a carga de usuários dimensionada na aplicação, ele apresentará gargalos. Essa avaliação é de nível básico e validará a largura da banda, taxa de acessos, conexões etc.

Um teste simples otimiza tempo e recursos, pois evita que tarefas demoradas e complexas sejam executadas em uma infraestrutura que futuramente não atenderá à carga esperada. Ao detectar qualquer sinal de gargalo, antes de executar os testes de desempenho propriamente ditos, a estrutura é readequada para suportar a carga estimada nos cenários de teste.

#### Evite iniciar com cenários complexos

Na maioria das vezes, os testes iniciais são executados com cenários extremamente complexos, que operam muitos componentes da aplicação ao mesmo tempo. Esse tipo de abordagem não deixa os gargalos aparecerem, ocultando futuros problemas de desempenho.

Antes mesmo da aplicação estar totalmente pronta para implantação, o ideal é realizar testes com cenários menos complexos, um de cada vez.

#### Nunca esqueça do think time

Think time (ou tempo de raciocínio) é o tempo definido em uma transação no mesmo ritmo de um usuário real. Os cenários tentam prever aquilo que os usuários normalmente fazem (navegar, pesquisar, login, comprar, etc.), e o tempo que eles levam para ler, pensar, digitar e clicar. Cada etapa de cada transação deve ter seu think time estabelecido. Dependendo do contexto da transação, o valor do think time irá variar e, por isso, não é aconselhável estabelecer um padrão.

Um exemplo: o acesso à página de login pode demorar de 15 a 20 segundos para um usuário completar. Você pode informar à ferramenta de teste para usar um tempo randômico entre 15 e 20 segundos, ao invés de fixar um valor único. De qualquer forma, é sempre melhor definir um valor de think time do que não definir nenhum, caso contrário os cenários executados causarão um enorme impacto nos servidores, uma vez que transações sem think time ou com valores irreais acarretam sobrecarga nos mesmos. Deve-se sempre lembrar de modelar os cenários com tempos reais previstos de think time.

#### Ambiente de testes

Além de ser exclusivo para realização dos testes de desempenho, a infraestrutura da mesma deve ser a mais próxima possível da estrutura de produção. Todas as configurações, aplicativos, serviços, massa de dados e outros itens que fazem parte do ambiente de produção devem ser reproduzidos.

Evite testar a aplicação em sistemas de produção, uma vez que o mesmo é acessado por outros usuários e é impossível garantir o que está sendo executado nesse ambiente. Sendo assim, será difícil determinar se as falhas na aplicação são ocasionadas pelos testes ou por outros usuários no sistema. Além disso, uma possível falha grave em decorrência dos testes pode impactar negativamente usuários reais do ambiente de produção.

Uma aplicação simples com apenas um servidor é perfeitamente possível de ser replicada, ao contrário de uma infraestrutura com recursos de grande porte que demandam altos custos de implantação. Nessas situações, mantenha a mesma infraestrutura em proporções menores, mas sempre mantendo a escalabilidade da mesma.

Considere incorporar procedimentos que não são evidentes, pois a degradação do desempenho pode ocorrer em tarefas periódicas que não são identificadas facilmente como backup de base de dados, geração de relatórios demorados, entre outros.

#### Gargalos de desempenho podem ocultar outros gargalos

Sistemas que utilizam muitas APIs devem ter atenção redobrada ao identificar gargalos. Uma API que não funciona como desejado pode esconder outros possíveis gargalos de outras APIs.

#### O equipamento gerador de carga também deve ser testado

Em um ambiente de testes, além da infraestrutura dos servidores utilizados pela aplicação (servidor web, de dados, etc.), existe também a estrutura geradora de carga. São equipamentos configurados para que uma determinada ferramenta de testes execute os cenários de testes, submetendo toda a estrutura utilizada pela aplicação à carga determinada.

#### Monitore os recursos do ambiente submetido à carga

Durante a execução dos testes de desempenho, é importante utilizar alguma ferramenta que monitore os diferentes recursos dos servidores como forma de acompanhar o seu comportamento conforme o crescimento e estabilidade da carga. Esse tipo de monitoramento se torna fundamental para verificar quando o hardware está se tornando um gargalo.

#### Nunca inicie a carga de uma única vez

Em cada ciclo de testes, a carga de usuários deve subir de forma gradativa durante um período longo de tempo, seguido de um tempo estável de pelo menos uma hora, para então descer gradativamente. Devem ser consideradas apenas as métricas do período estável, tanto no comportamento dos servidores quanto da aplicação. Ou seja, o que deve ser avaliado é apenas o tempo de carga estável de uma hora.

#### O poder da regeneração do ambiente de testes

Um ambiente de testes é composto pelo gerador de carga e também pela aplicação que será submetida aos testes. É extremamente importante que antes de cada ciclo de teste executado, todos os ambientes estejam iguais, pois qualquer alteração pode acarretar resultados não correspondentes à realidade da aplicação.

#### Teste a aplicação considerando o uso após determinado período

Muitos testes de desempenho não consideram a utilização de toda a estrutura após determinado período. Deve-se pensar como o sistema irá se comprotar no futuro, como por exemplo, daqui uns anos, quando possuir mais de 50 mil usuários no banco de dados.

#### Se for possível, replique o ambiente do seu cliente

É sempre importante manter o ambiente de testes o mais próximo possível do real e isso será de grande valia se existir a possibilidade de oferecer o teste utilizando os dados reais do cliente.

#### Isole o ambiente de testes

Utilizando um ambiente de testes dedicado, é importante isolar a sua rede do restante da rede da empresa para que nenhuma das duas seja afetada durante as atividades de teste. Além dos testes utilizarem uma parte considerável da banda de rede, a própria atividade da empresa pode afetar as simulações e seus resultados, pois obviamente utiliza uma parte da banda. Também se deve garantir que somente usuários virtuais autorizados terão acesso seu aplicativo em teste.

#### Participe ativamente desde o início do projeto

Objetivos mal definidos para os testes de desempenho são ocasionados por entendimento inadequado das expectativas dos testes, e muitas vezes vão acarretar na criação demorada de cenários complexos de forma desnecessária. Isto resulta em dados de desempenho inadequados para uma análise do real da aplicação.

#### Testes de desempenho devem procurar problemas de desempenho

Se o objetivo é pura e simplesmente executar testes buscando confirmar os requisitos de desempenho da aplicação, a equipe dificilmente pensará em um cenário hipotético fora dos padrões para incluir nos testes. Um cenário não previsto pode deixar potenciais problemas ocultos.

#### Teste muitas vezes

Uma mudança simples não prevista pode causar algum problema inesperado, acarretando perdas de desempenho que não seriam detectadas em apenas um ciclo de avaliação. Caso seja encontrada uma discrepância ao comparar os resultados, o problema deverá ser investigado em detalhes.

#### Para o tempo de resposta, considere a proporção de usuários que atingem a meta

O tempo de resposta é o que define a satisfação de um usuário do sistema. Para esse valor, não consideramos o tempo médio que cada transação demora a responder. Deve-se buscar nos registros do teste qual a percentagem dessas transações estão abaixo de um tempo de resposta estabelecido.
O ideal é sempre determinar uma quantidade de usuários que serão atendidos por este tempo de resposta. 

#### Faça a sondagem com um único usuário

Muitos problemas no comportamento do sistema só são detectados ao interagir diretamente com a aplicação quando ela está sendo submetida aos testes de desempenho. Uma lentidão em uma rotina que não estava no plano de testes pode esconder possíveis gargalos da aplicação.

## Más práticas

Construir e programar testes unitários ou outros tipos de testes pode não ser um exercício tão simples quanto se imagina. Não pela dificuldade da programação em si, mas pela criatividade e experiência necessária para se imaginar testes eficazes e concretos.

#### Se não deu erro, é por que funcionou

O teste chama um método de negócios, que não retorna nada, e não verifica se os efeitos colaterais que seriam gerados pelo método foram efetivamente realizados.

Caímos nesse erro de considerarmos que o teste só "falha" se houver alguma exceção. Mas não ter ocorrido nenhum problema de rede, nem de sintaxe SQL, por exemplo, não significa que foi gerado o resultado correto.

#### O próprio método de testes calcula o resultado esperado

Um dado método de negócios implementa um algoritmo com diversas variações. Em vez de criar vários testes, cada qual chamando o mesmo método, porém variando os parâmetros de entrada (e as respostas esperadas), cria-se um teste “genérico” que calcula as respostas esperadas e então chama o método de negócios apropriado.

#### Testar várias situações diferentes em um único teste

Um único método de negócios pode gerar múltiplas situações de teste, de acordo com os valores dos seus argumentos, e um único teste exercita todas essas variações.

Este anti-pattern ocorre quando o programador acredita que deve haver um teste para cada método (afinal é assim que a maioria dos IDEs geram automaticamente classes de teste a partir de classes da aplicação).

Um teste construído desta forma pode até servir para indicar se o método como um todo funcionou, mas uma falha no teste, no meio de um relatório que pode conter milhares de outros testes, diz pouco sobre exatamente qual situação falhou.

#### Confundir Testes de Unidade com Testes de Sistema

Um teste de unidade deve testar uma classe ou um método isoladamente, sem nenhuma dependência externa. A idéia é que uma falha no teste indique precisamente qual método ou classe o programador deve depurar e corrigir, ou completar. Mas, caso o teste dependa de outros métodos chamados em cascata, ou de recursos externos como bancos de dados, uma falha no teste pode significar simplesmente um erro de configuração do ambiente, ou uma falha no trabalho de outro desenvolvedor.

#### Construir testes que não podem ser repetidos

Um teste automatizado deve funcionar sempre. Deve ser possível executá-lo diversas vezes, sem que o programador tenha que realizar tarefas de limpeza, como recarregar uma massa de testes no banco de dados. Falhar em observar estas diretivas leva a vários alarmes falsos, pois faz com que testes falhem quando o código testado está totalmente correto.
