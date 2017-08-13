# Guia de Boas Práticas
Um guia de boas práticas que possam reduzir as dificuldades de implementação, adaptação e manutenção de ambientes de integração contínua utilizando Node e GruntJS

## Ferramentas
* [NodeJS](https://nodejs.org/en/download/)
* [Visual Code](https://code.visualstudio.com/Download)
* [Git](https://git-scm.com/downloads)

## Instalações
### Ferramentas
Recomendamos a instalação do Visual Code para IDE de codificação por ser open source, com vários plugins que ajudam no desenvolvimento e por ter uma boa integração com as linguagens web utilizadas (HTML, CSS, JavaScript). Suporta tambem outras linguagens como c++, java, python e .net.
![Visual Code](/img/VisualCode.png)

Após a instalação do Git, podemos ver sua versão na linha de comando
```shell
$ git version
```
![Versão do Git](/img/VersaoGit.png)

Com a instalação do NodeJs, instalamos a plataforma `node` e o gerenciador de pacotes `npm`.
```shell
$ node -v
```
![Versão do Node](/img/NodeVersion.png)
```shell
$ npm -v
```
![Versão do Npm](/img/NpmVersion.png)

### Pacotes
Inicialmente, os pacotes que devemos instalar globalmente são `grunt`, `grunt-cli`, `karma-cli`.
```shell
$ npm install -g grunt grunt-cli karma-cli
```
![Setup Inicial](/img/InitialSetup.png)

Após a instalação, podemos executar o comando:
```shell
$ grunt -v
```
![Versão do Grunt](/img/GruntCli.png)

## Configurações


## Exemplos
