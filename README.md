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

### GruntJS

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

## Exemplos

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

## Boas práticas

Os testes automatizados constituem um item importante de controle de qualidade de software e oferecem também uma maneira confiável de se acompanhar o progresso de uma equipe de desenvolvimento em relação aos requisitos do projeto.

Para avaliar a qualidade de testes sobre o código é necessário olhar o código internamente, e testar a implementação específica. Foram utilizados ferramentas de cobertura para avaliar a qualidade dos testes. Executar a bateria de testes e verificar se existe alguma linha de código que não foi exercitada pelos testes. Não apenas os testes de unidade deveriam ser avaliados em relação à cobertura, mas também os testes de sistema e especialmente os testes funcionais. Se a execução dos testes passa por todo o código, podemos confiar que tudo o que foi previsto pelo sistema foi testado.

A cobertura medida em linhas de código pode oferecer uma visão errônea da abrangência dos testes. Uma mesma linha pode participar de vários caminhos de execução diferentes, e cada caminho traz diferentes configurações de objetos em memória.

Hoje já temos ferramentas capazes de cruzar a cobertura medida em termos de linhas exercitadas pelos testes com os caminhos possíveis de execução dentro de um método. Por outro lado, testar todos esses caminhos pode representar esforço excessivo em relação aos benefícios obtidos.

#### Não coloque a carroça na frente dos bois

Não tente avançar o ciclo dos testes. É importante que você se mantenha no ciclo (Red, Green, Refactor), isso vai fazer com que através da prática e disciplina, você se acostume e acabe ganhando agilidade e melhor visão do processo de desenvolvimento.

#### Trate código de teste como código de produção

O código de teste precisa ser legível, separado em etapas bem definidas e possuir um bom report. Isso vai permitir termos nossa documentação, além de facilitar com que outros desenvolvedores entendam o sistema a partir dali. De nada adianta criar um conjunto de testes se eu não souber qual problema aconteceu se algum teste quebrar.

#### Evite acoplamento

Quanto mais desacoplados seus testes, melhor. Isso evita a quebra em cascata, auxiliando na busca de erros. Isso também auxilia até mesmo o seu design de código, garantindo algo modularizado e de bem mais fácil manutenção.

#### Um teste de cada vez

Esse é o padrão do TDD, só escreva um próximo teste, se o primeiro passar. Isso garante que não ficarão coisas pela metade e nem o risco de acabar esquecendo algo no meio do caminho.

#### Não teste o desnecessário

Se você estiver usando um framework, você não precisa testar se o método dele está funcionando, isso já foi amplamente testado no framework e o que você estará fazendo, nada mais é que repetindo testes.

#### Responsabilidade Única

Isso serve para o seu código e para o seu teste também, se você precisa escrever muito para fazer um teste, significa que alguma coisa está errada. Sempre faça testes pequenos, em geral, um teste para um método ou mais testes para um mesmo método, nunca o contrário. Um teste jamais poderá testar mais de um método.

### Testes unitários

Os testes de unidade são apenas parte de um processo bem mais amplo de controle efetivo de qualidade de software.

Nem todas as classes de uma aplicação podem ser testadas de modo isolado, seja porque elas necessitam de outras classes da própria aplicação, ou porque precisam de acesso a recursos externos, como bancos de dados relacionais. Testar uma classe juntamente com seus pré-requisitos consiste em um teste de integração. Então, ou não será possível criar testes de unidade para algumas classes da aplicação, ou então será necessário fornecer “simulações” destas dependências na forma de objetos mock.

É importante perceber que usar objetos mock em todas as camadas de uma aplicação, de modo a ter testes de unidade para todas as classes e métodos de uma aplicação, não elimina a necessidade de se ter também os outros tipos de testes.

Para seguir um padrão legal do seu teste unitário, ele deve ser capaz de responder as seguintes perguntas:

*O que eu estou testando?*

*O que o método deveria fazer?*

*Qual o seu atual retorno?*

*O que eu espero que retorne?*

* “Os nomes dos testes devem descrever o 'o que' e o 'porquê' a partir da perspectiva do usuário” – a ideia é que o desenvolvedor deveria ser capaz de ler o nome do teste e entender qual o comportamento esperado imediatamente.

* “Os testes são códigos também” – código-fonte em produção não é o único local em que você deve fazer suas refatorações. Testes legíveis são mais fáceis de se manter e mais fáceis de serem compreendidos por outras pessoas. “Eu detesto, destesto testes longos e complexos. Se você tem um teste com 30 linhas de configuração (setup), por favor, coloque-a em um método de criação. Um teste longo é irritante e confunde o desenvolvedor. Se eu não tenho métodos longos no código em produção, por que eu deixaria que eles existam nos códigos de nossos testes?”

* “Não se atenha em um padrão ou estilo organizacional para fixtures” – Às vezes, mesmo tendo uma padronização para suas classes, pode ser que não tenha como aplicá-la a seus fixtures.

* Uma assertiva (assert) por teste (sempre que possível). 

* Se houver qualquer condicional dentro de um teste, mova os blocos do "if" e do "else" para métodos individuais. 

* No caso de os métodos em teste também tiverem blocos if else, então o método deve ser refatorado.

* O nome do método deve ser um tipo de teste. Por exemplo, TesteFazerReserva() é diferente de TesteNaoFazerReserva().

### Testes de integração

Os testes serão influenciados por nomes de classes, protocolos de rede e outros detalhes de implementação. Mas ainda irão exigir a presença de várias classes; por exemplo um objeto de negócios e vários objetos persistentes. Também poderão ser necessários recursos externos ao código da aplicação, como um servidor de banco de dados.

A execução de testes de sistema dentro de ambientes de integração contínua pode ser complexa, dependendo das tecnologias adotadas e da forma como a arquitetura e design das classes foi definido.

Mesmo a execução de testes de sistema sem integração contínua pode ser complicada, pela necessidade de se configurar todo o ambiente de execução, por exemplo o servidor de aplicações, o banco de dados e um diretório LDAP. Isso além do tempo gasto em tarefas como o deployment de pacotes e a carga de massas de dados de testes no banco de dados. É nessas tarefas que os frameworks especializados em testes de sistema ajudam o desenvolvedor.

Para que um teste rode de forma isolada, ele deve iniciar sempre em um estado limpo e válido, e com seu término, ele deve sempre desfazer qualquer sujeira que ele tenha deixado no caminho. A sujeira pode ser desde uma variável de ambiente ou da JVM, um arquivo ou diretório no sistema de arquivos, recursos abertos do OS, entre outros.

### Testes de regressão

Quando qualquer sistema é exposto ao usuário final, é inevitável a constatação da existência de erros na aplicação. Uma prática bastante efetiva de QA é gerar testes que exercitam cada bug em particular. Estes testes são utilizados para ajudar o desenvolvedor a isolar a causa do erro, e permitem ao gerente de projeto verificar se o bug foi realmente eliminado.

Se estes testes forem incorporados à bateria de testes da aplicação, e forem re-executados a cada release evita-se que o bug apareça novamente. Os “bugs recorrentes”, ou regressões, são um dos problemas mais comuns com sistemas que já sofreram vários releases ou que sofreram várias mudanças em sua equipe de desenvolvimento.

### Testes de desempenho

Qualquer tipo de recurso do sistema (hardware, software, banda de rede, etc.) que limite o fluxo dos dados ou a velocidade de processamento cria um gargalo. Nas aplicações web, eles afetam o desempenho e até mesmo a escalabilidade, limitando o throughput de dados e/ou o número de conexões suportadas pela aplicação.

Os gargalos podem ocorrer em todos os níveis de arquitetura de um sistema, tais como a camada de rede, servidor de aplicações, servidor de dados e servidor web. Entretanto, conforme apontam muitos estudos e experiências, quem causa a maior parte dos gargalos de desempenho é o código do aplicativo.

#### Throughput

Basicamente, throughput ou vazão é a capacidade da aplicação ou uma parte da mesma de executar uma operação de forma repetida, em um determinado período de tempo. Por exemplo, o throughput de uma página é a quantidade de vezes por segundo que conseguimos receber uma resposta dessa página.

Esses números são muito importantes porque definem a capacidade da aplicação, medida em acessos por segundo, páginas por segundo ou megabits por segundo. A maior parte de todos os problemas de desempenho é causada por limitações no throughput.

#### Tempos de resposta

É o tempo que a aplicação demora para concluir um processo de transação. No caso de uma página, é o tempo que a aplicação demora para dar o retorno apropriado para o usuário final. É importante medir o tempo de resposta porque a aplicação pode ser rejeitada pelo usuário se não responder dentro de um tempo esperado, mesmo tendo disponibilidade imediata – levando o mesmo a abandonar a página ou até mesmo acessar a página de concorrentes.

O tempo de resposta envolve o período necessário para retornar à solicitação realizada no servidor web. Cada solicitação deve ser processada e enviada para o servidor de aplicação, que também pode realizar um pedido ao servidor de banco de dados. Tudo isso voltará pelo mesmo caminho até o usuário. O tempo necessário para o retorno também está relacionado com a latência da rede entre os servidores e o usuário.

#### Antes de tudo, avalie a infraestrutura da rede da aplicação

Antes de executar cada teste de performance, faça uma avaliação minuciosa na infraestrutura da rede que suporta a aplicação. Se o sistema não suportar a carga de usuários dimensionada na aplicação, ele apresentará gargalos. Essa avaliação é de nível básico e validará a largura da banda, taxa de acessos, conexões etc.

Um teste simples otimiza tempo e recursos, pois evita que tarefas demoradas e complexas sejam executadas em uma infraestrutura que futuramente não atenderá à carga esperada. Ao detectar qualquer sinal de gargalo, antes de executar os testes de performance propriamente ditos, a estrutura é readequada para suportar a carga estimada nos cenários de teste.

#### Evite iniciar com cenários complexos

Na maioria das vezes, os testes iniciais são executados com cenários extremamente complexos, que operam muitos componentes da aplicação ao mesmo tempo. Esse tipo de abordagem não deixa os gargalos aparecerem, ocultando futuros problemas de desempenho.

Antes mesmo da aplicação estar totalmente pronta para implantação, o ideal é realizar testes com cenários menos complexos, um de cada vez.

#### Nunca esqueça do think time

Think time (ou tempo de raciocínio) é o tempo definido em uma transação no mesmo ritmo de um usuário real. Os cenários tentam prever aquilo que os usuários normalmente fazem (navegar, pesquisar, login, comprar, etc.), e o tempo que eles levam para ler, pensar, digitar e clicar. Cada etapa de cada transação deve ter seu think time estabelecido. Dependendo do contexto da transação, o valor do think time irá variar e, por isso, não é aconselhável estabelecer um padrão.

Um exemplo: o acesso à página de login pode demorar de 15 a 20 segundos para um usuário completar. Você pode informar à ferramenta de teste para usar um tempo randômico entre 15 e 20 segundos, ao invés de fixar um valor único. De qualquer forma, é sempre melhor definir um valor de think time do que não definir nenhum, caso contrário os cenários executados causarão um enorme impacto nos servidores, uma vez que transações sem think time ou com valores irreais acarretam sobrecarga nos mesmos. Deve-se sempre lembrar de modelar os cenários com tempos reais previstos de think time

#### Ambiente de testes

Além de ser exclusivo para realização dos testes de performance, a infraestrutura da mesma deve ser a mais próxima possível da de produção. Todas as configurações, aplicativos, serviços, massa de dados e outros itens que fazem parte do ambiente de produção devem ser reproduzidos.

Evite testar a aplicação em sistemas de produção, uma vez que o mesmo é acessado por outros usuários e é impossível garantir o que está sendo executado nesse ambiente. Sendo assim, será difícil determinar se as falhas na aplicação são ocasionadas pelos testes ou por outros usuários no sistema.

Uma aplicação simples com apenas um servidor é perfeitamente possível de ser replicada, ao contrário de uma infraestrutura com recursos de grande porte que demandam altos custos de implantação. Nessas situações, mantenha a mesma infraestrutura em proporções menores, mas sempre mantendo a escalabilidade da mesma.

Considere incorporar procedimentos que não são evidentes, pois a degradação do desempenho pode ocorrer em tarefas periódicas que não são identificadas facilmente como backup de base de dados, geração de relatórios demorados, etc.

#### Gargalos de performance podem ocultar outros gargalos

Sistemas que utilizam muitas APIs devem ter atenção redobrada ao identificar gargalos (ler BOX 2). Uma API que não funciona como desejado pode esconder outros possíveis gargalos de outras APIs.

Por exemplo, uma determinada aplicação possui três APIs. Ao final dos testes de performance, a análise dos resultados detectou que a API problemática gerou um tempo de resposta muito alto para uma certa página. Essa API não está respondendo como esperado, mas não há como garantir que as outras APIs estejam funcionando como deveriam. Se uma API demora para responder, o número de requests encaminhados para as APIs posteriores é reduzido, ocultando possíveis problemas nas mesmas.

#### O equipamento gerador de carga também deve ser testado

Em um ambiente de testes, além da infraestrutura dos servidores utilizados pela aplicação (servidor web, de dados, etc.), existe também a estrutura geradora de carga. São equipamentos configurados para que uma determinada ferramenta de testes execute os cenários de testes, submetendo toda a estrutura utilizada pela aplicação à carga determinada.

Uma estrutura geradora de carga pode esconder problemas e limitações que geram ruídos nos testes, ocasionando falsos resultados (como um número reduzido de throughput). Cada equipamento desse ambiente deve ser avaliado e os resultados individuais comparados em busca de inconsistências. O objetivo é identificar se um desses equipamentos tem consumo diferenciado (CPU, memória, banda, etc.).

#### Monitore os recursos do ambiente submetido à carga

Durante a execução dos testes de performance, é importante utilizar alguma ferramenta que monitore os diferentes recursos dos servidores como forma de acompanhar o seu comportamento conforme o crescimento e estabilidade da carga. Esse tipo de monitoramento se torna fundamental para verificar quando o hardware está se tornando um gargalo.

Caso o testador possua conhecimentos avançados no sistema operacional do servidor, existem ferramentas nativas que monitoram os recursos, gravando os contadores selecionados conforme a necessidade de cada teste (ver seção Links).

#### Nunca inicie a carga de uma única vez

Em cada ciclo de testes, a carga de usuários deve subir de forma gradativa durante um período longo de tempo, seguido de um tempo estável de pelo menos uma hora, para então descer gradativamente. Devem ser consideradas apenas as métricas do período estável, tanto no comportamento dos servidores quanto da aplicação. Ou seja, o que deve ser avaliado é apenas o tempo de carga estável de uma hora.

Submeter o sistema à carga máxima de uma vez pode sobrecarregar a aplicação Web, e os resultados apresentados durante o período de testes podem não corresponder à realidade.

#### O poder da regeneração do ambiente de testes

Um ambiente de testes é composto pelo gerador de carga e também pela aplicação que será submetida aos testes. É extremamente importante que antes de cada ciclo de teste executado, todos os ambientes estejam iguais, pois qualquer alteração pode acarretar resultados não correspondentes à realidade da aplicação.

Um exemplo: após o primeiro ciclo de testes, no servidor de dados, um dos bancos teve um acréscimo considerável de dados nas tabelas devido a um dos cenários que alimentava um formulário de dados. Se esse ambiente não for regenerado nos próximos ciclos de testes, o mesmo banco terá mais dados carregados e seu desempenho pode ficar abaixo do esperado, ocasionando consultas mais lentas. Nessa situação, é importante restaurar o banco de dados a um estado conhecido antes de cada ciclo de teste.

Se esses ambientes forem criados em uma solução virtualizada, fica muito mais simples manter esse controle, pois essa tecnologia permite criar “checkpoints” que salvam um instantâneo do servidor, podendo este ser restaurado a qualquer momento revertendo a máquina virtual a um ponto específico do tempo.

#### Teste a aplicação considerando o uso após determinado período

Muitos testes de performance não consideram a utilização de toda a estrutura após determinado período. Uma pergunta que sempre deve ser feita é: “Como meu sistema vai se comportar daqui a um ano, quando quase 70.000 usuários forem registrados nos bancos?”.

As ferramentas de teste possuem relativa facilidade para preenchimento do banco com grande quantidade de dados. Como é utilizada a mesma interface dos usuários reais, existe a garantia de que os dados passaram pelas regras de limpeza e verificação da aplicação. Os próprios cenários podem ser utilizados para realizar esse preenchimento.

Os mesmos testes de performance executados anteriormente serão rodados com o intuito de alimentar os bancos, simulando a utilização prevista daqui a um determinado período. Assim é possível comparar os testes executados com poucos dados e os testes executados com muitos dados já inseridos no banco.

#### Se for possível, replique o ambiente do seu cliente

Se a aplicação a ser testada é um produto que já funciona em seu cliente, não seria ideal realizar os testes de performance com dados reais? É sempre importante manter o ambiente de testes o mais próximo possível do real e isso será de grande valia se existir a possibilidade de oferecer o teste utilizando os dados reais do cliente.

O importante nessa situação é sempre garantir que dados críticos do cliente serão protegidos ou removidos, com sua ciência e autorização prévia.

#### Isole o ambiente de testes

Utilizando um ambiente de testes dedicado, é importante isolar a sua rede do restante da rede da empresa para que nenhuma das duas seja afetada durante as atividades de teste. Além dos testes utilizarem uma parte considerável da banda de rede, a própria atividade da empresa pode afetar as simulações e seus resultados, pois obviamente utiliza uma parte da banda. Também se deve garantir que somente usuários virtuais autorizados acessarão seu aplicativo em teste.

#### Participe ativamente desde o início do projeto

É natural que o teste de performance seja executado somente ao final do projeto (caso a metodologia de desenvolvimento não envolva processos ágeis). Na maior parte das vezes, só é possível executar os testes no final do desenvolvimento da aplicação ou quando a mesma já está em implantação pelo cliente. De qualquer forma, é importante que o testador participe também do projeto durante o desenvolvimento do produto. Devemos lembrar que os cenários propostos devem combinar e simular um cenário real com a maior fidelidade possível. Participando do ciclo de vida do produto, o testador terá mais condições de criar os cenários de teste com entendimento adequado dos padrões comuns de uso.

Objetivos mal definidos para os testes de performance são ocasionados por entendimento inadequado das expectativas dos testes, e muitas vezes vão acarretar na criação demorada de cenários complexos de forma desnecessária. Isto resulta em dados de performance inadequados para uma análise do real desempenho da aplicação.

#### Testes de performance devem procurar problemas de performance

Em alguns casos, as equipes procuram os testes de performance para confirmar seus requisitos ao invés de tentar identificar problemas. Essa visão pode até mesmo influenciar na criação dos cenários de teste. Se o objetivo é pura e simplesmente executar testes buscando confirmar os requisitos de desempenho da aplicação, a equipe dificilmente pensará em um cenário hipotético fora dos padrões para incluir nos testes. Um cenário não previsto pode deixar potenciais problemas ocultos.

#### Teste muitas vezes

Quando finalizar um determinado ciclo de teste de performance, utilize-o como um ponto de comparação e execute-o novamente com as mesmas definições mais de uma vez com o objetivo de procurar possíveis regressões de desempenho. Uma mudança simples não prevista pode causar algum problema inesperado, acarretando perdas de desempenho que não seriam detectadas em apenas um ciclo de avaliação. Por exemplo: foram definidos ciclos de teste de 100, 250, 300 e 500 usuários simultâneos. Nessa situação, não será executado apenas um ciclo de teste para cada carga de usuários, e sim cinco ciclos de teste para cada carga de usuários comparando os resultados entre si. Caso seja encontrada uma discrepância ao comparar os resultados, o problema deverá ser investigado em detalhes.

#### Para o tempo de resposta, considere a proporção de usuários que atingem a meta

O tempo de resposta é o que define a satisfação de um usuário do sistema. Para esse valor, não consideramos o tempo médio que cada transação demora a responder. Deve-se buscar nos registros do teste quantos por cento dessas transações estão abaixo de um tempo de resposta estabelecido.

Supondo que para determinada aplicação, o tempo de resposta estabelecido como aceitável é igual ou inferior a sete segundos. Ao executar os testes, se o tempo médio de resposta foi de seis segundos, o resultado atingindo poderia ser considerado dentro do esperado. Entretanto, há um problema nessa análise. Ao analisar em detalhes os resultados, observou-se que o tempo de resposta dessa transação foi variável, estando tão baixo e tão alto que o tempo médio fez parecer que estava baixo.

Portanto, o ideal é sempre determinar uma quantidade de usuários que serão atendidos por este tempo de resposta, por exemplo: 85% das transações devem responder no tempo máximo de sete segundos.

Nessa situação, analisando novamente os resultados, conclui-se que 78% das transações responderam no máximo em sete segundos, e as demais atingiram tempo de resposta superior a sete segundos. Considerando essa forma de análise, o sistema seria reprovado nos testes de desempenho.

#### Faça a sondagem com um único usuário

Enquanto o aplicativo está sob carga, acesse-o e procure explorá-lo para ajudá-lo a compreender a experiência do usuário (como tempos de resposta). Por exemplo, acesse a aplicação pelo browser e navegue pelos cenários propostos, executando ações não previstas.

Muitos problemas no comportamento do sistema só são detectados ao interagir diretamente com a aplicação quando ela está sendo submetida aos testes de performance. Uma lentidão em uma rotina que não estava no plano de testes pode esconder possíveis gargalos da aplicação.

Percebe-se que o sucesso do teste de performance de uma aplicação não depende apenas das ferramentas utilizadas. Desde o planejamento, desenvolvimento de teste, execução e análise, são necessários testadores competentes com conhecimento do sistema, da rede e das aplicações de testes, além de uma boa experiência com servidores e, principalmente, habilidade para descobrir problemas ocultos e isolados.

## Más práticas

Construir e programar testes unitários ou outros tipos de testes pode não ser um exercício tão simples quanto se imagina. Não pela dificuldade da programação em si, mas pela criatividade e experiência necessária para se imaginar testes eficazes e concretos.

#### Se não deu erro, é por que funcionou

O teste chama algum método de negócios, que não retorna nada, e não verifica se os efeitos colaterais que seriam gerados pelo método foram efetivamente realizados.

Por exemplo, foi testado o envio de uma mensagem de e-mail, mas não se verificou se ela chegou à caixa postal correta. Ou então foram modificados registros no banco de dados, mas estes registros não foram lidos para confirmar que estão com os valores corretos ao fim da transação.

Em suma, caímos nesse erro se considerarmos que o teste só “falha” se houver alguma exceção. Mas não ter ocorrido nenhum problema de rede, nem de sintaxe SQL, por exemplo, não significa que foi gerado o resultado correto.

Note que em geral este tipo de problema ocorre em testes que não são verdadeiros testes de unidade, e sim testes de sistema, devido à dificuldade em se verificar os “efeitos colaterais”. Mas podem ocorrer variações deste anti-pattern até em cálculos simples; por exemplo o teste verifica apenas se o resultado é positivo, em vez de verificar o valor real esperado.

#### Fazer rollback no final do teste

O teste chama um ou mais métodos cujo efeito é modificar registros no banco de dados, mas para evitar o problema de se ter que “zerar” as tabelas envolvidas (para manter a repetibilidade do teste), é feito um rollback no final.

Especialmente em aplicações transacionais, esta forma de teste não funciona, pois não considera a possibilidade do próprio commit falhar. Na maioria dos casos um banco relacional irá executar regras de integridade (constraints) e triggers imediatamente, de modo que uma falha no commit seria causada por falta de espaço em disco ou algum outro motivo fora do controle da lógica da aplicação. Mas em situações mais sofisticadas, como um banco replicado, ou com transações distribuídas, pode haver falha apenas no commit, e não nos comandos que inseriram ou modificaram registros.

Além disso, caso sejam usados Entity Beans ou frameworks de persistência objeto-relacional, as atualizações reais sobre o banco de dados podem ser postergadas para o momento do commit, mascarando erros causados por lógica incorreta em métodos executados no início da transação.

Não podemos deixar de considerar que o commit da transação deve ser feito nos momentos corretos. O commit é parte integral da lógica sendo testada. Por exemplo, se o commit estiver fora do método que representa todo o processo de negócio, a camada de apresentação da aplicação poderá até mesmo “esquecer” de fazer o commit.

#### O próprio método de testes calcula o resultado esperado

Um dado método de negócios implementa um algoritmo com diversas variações. Em vez de criar vários testes, cada qual chamando o mesmo método, porém variando os parâmetros de entrada (e as respostas esperadas), cria-se um teste “genérico” que calcula as respostas esperadas e então chama o método de negócios apropriado.

Além de representar uma duplicação desnecessária de lógica (implementando o algoritmo de cálculo duas vezes, uma no teste e outra no método de negócios), é possível que o programador cometa o mesmo erro nas duas vezes, ou pior, que haja cópia de código do método para o teste, ou vice-versa.

Do jeito que foi apresentado, pode parecer uma situação trivial, fácil de se identificar. Mas o programador pode tomar “atalhos” para produzir rapidamente o teste. Por exemplo, quando o resultado de um método depende de uma tabela de consulta e o teste é codificado para usar a mesma tabela.

#### Testar apenas o funcionamento correto

O método nunca é chamado com argumentos inválidos, então não se sabe se ele irá gerar as exceções esperadas ou de alguma forma dar o feebdack correto para o usuário

Aqui não temos exatamente um erro de um teste em especial, mas um erro na concepção de toda uma suíte de testes. É importante testar se cada método faz sua validação de argumentos e tratamento de erros da forma correta. Especialmente quando um método pode ser chamado usando-se argumentos derivados de fontes externas, como um formulário HTML, um banco de dados ou um arquivo em disco. As falhas de segurança mais comuns em aplicações web decorrem deste anti-pattern.

#### Testar várias situações diferentes em um único teste

Um único método de negócios pode gerar múltiplas situações de teste, de acordo com apenas os valores dos seus argumentos, e um único teste exercita todas essas variações.

Este anti-pattern ocorre quando o programador acredita que deve haver um teste para cada método (afinal é assim que a maioria dos IDEs geram automaticamente classes de teste a partir de classes da aplicação).

Um teste construído desta forma pode até servir para indicar se o método como um todo funcionou, mas uma falha no teste, no meio de um relatório que pode conter milhares de outros testes, diz pouco sobre exatamente qual situação falhou.

Outra variação deste anti-pattern é na verdade um erro de projeto da aplicação. Se existe uma seqüência de métodos que deve ser chamada na ordem correta para gerar certo resultado, esta seqüência deveria estar encapsulada em um único método de negócios, e é este método que seria testado. Mas ter a seqüência correta dentro de um método de teste não garante que a mesma seqüência foi implementada corretamente dentro da aplicação.

#### Confundir Testes de Unidade com Testes de Sistema

Cria-se um teste de unidade onde o sucesso ou falha do teste depende de métodos e classes diferentes do alvo do teste.

Um teste de unidade deve testar uma classe ou um método isoladamente, sem nenhuma dependência externa. A idéia é que uma falha no teste indique precisamente qual método ou classe o programador deve depurar e corrigir, ou completar. Mas, caso o teste dependa de outros métodos chamados em cascata, ou de recursos externos como bancos de dados, uma falha no teste pode significar simplesmente um erro de configuração do ambiente, ou uma falha no trabalho de outro desenvolvedor.

Nem sempre será possível ou viável criar verdadeiros testes de unidade para todas as classes e métodos. Já os testes de sistema devem ser isolados para que, antes da sua execução (ou em caso de falhas), seja fácil verificar falhas de ambiente, ou acionar o desenvolvedor responsável pelo componente que causou a falha. Isso também ajuda a separar testes longos de testes rápidos, e a agendar freqüências de execução diferenciadas para cada um. Em projetos envolvendo uma equipe grande ou muitos casos de uso, pode se tornar inviável executar sempre todos os testes. Assim, será necessário ter agendas separadas para a execução de diferentes tipos de testes.

#### Construir testes que não podem ser repetidos

O funcionamento do teste depende do programador ajustar manualmente algum pré-requisito, como inserir dados de teste no banco de dados.

Um teste automatizado deve funcionar sempre. Deve ser possível executá-lo diversas vezes, sem que o programador tenha que realizar tarefas de limpeza, como recarregar uma massa de testes no banco de dados. Falhar em observar estas diretivas leva a vários alarmes falsos, pois faz com que testes falhem quando o código testado está totalmente correto.

Todo o ambiente de execução de um teste deve ser configurado pelo próprio teste (por exemplo, usando comandos SQL delete e insert executados via JDBC), ou pelo script que comanda a sua execução. Para facilitar esta tarefa, existem vários frameworks, alguns dos quais apresentados na seção sobre testes de sistema neste artigo (ex.: Cactus e DbUnit).
