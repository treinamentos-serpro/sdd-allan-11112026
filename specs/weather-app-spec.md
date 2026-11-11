# Especificação de Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva, em português (pt-BR), que permite
buscar uma cidade, consultar sua temperatura e condição meteorológica atual e
ver a previsão diária de hoje mais os quatro dias seguintes. A temperatura pode
ser exibida em Celsius ou Fahrenheit.

Esta especificação deriva de [discovery.md](./discovery.md). O público-alvo é
geral; as personas são hipóteses ainda não validadas. A aplicação usará Open-Meteo
sem API key. O uso local continua sujeito aos termos, limites de uso e atribuição
da fonte; não se presume aprovação jurídica nem isenção por ser exercício.

**Objetivo do MVP:** permitir que uma pessoa conclua a busca, selecione uma cidade
e consulte o clima atual e a previsão dentro dos limites de resposta estabelecidos.

**Plataforma:** aplicação web responsiva para mobile e desktop; não é PWA nem app
nativo nesta versão.

**Contexto de entrega:** exercício executado apenas localmente, sem publicação
pública ou operação em produção. Regras funcionais aprovadas, com suporte restrito
a Chrome e Firefox. Esta revisão complementa o discovery e substitui as antigas
pendências de produção pelas verificações locais em **Open Questions**.

**Limite de resposta:** até 15 segundos por operação: envio da busca até resultados
renderizados e seleção da cidade até clima e previsão renderizados. O tempo de
escolha da pessoa não é incluído; não se trata de 15 segundos para a jornada inteira.

## Functional Requirements

| ID | Requisito |
|---|---|
| RF-01 | Buscar cidades por nome usando Enter ou botão, sem autocomplete. Remover espaços externos e exigir pelo menos 2 caracteres. Aceitar acentos, hífen e apóstrofo. Rejeitar entradas exclusivamente numéricas e pares de coordenadas numéricas; não oferecer busca postal. |
| RF-02 | Ordenar somente os resultados válidos recebidos da API conforme as regras abaixo e exibir até 5. Cada resultado deve permitir seleção explícita e identificar cidade, país e estado/província quando disponível, preservando a grafia da fonte. |
| RF-03 | Exibir temperatura e condição da estimativa corrente da Open-Meteo para a cidade selecionada, com identificação de “Estimativa meteorológica” e horário do dado no fuso local da cidade. |
| RF-04 | Exibir hoje e os quatro dias seguintes no fuso da cidade, em ordem cronológica, com data, condição e mínima/máxima por dia. Mostrar o horário da consulta. Não atualizar automaticamente; na mudança do dia local, orientar nova seleção para atualizar, sem relabelar as datas da consulta anterior. |
| RF-05 | Iniciar sem cidade selecionada e com Celsius, orientando a pessoa a buscar uma cidade. Permitir alternância global entre Celsius e Fahrenheit durante a execução da página; recarregar ou reabrir a página inicia nova sessão e restaura Celsius. |
| RF-06 | Aplicar a unidade selecionada a todas as temperaturas, convertendo sempre a partir dos valores originais. Exibir uma casa decimal em pt-BR, conforme a regra de arredondamento abaixo. Não exibir vento ou pressão. |
| RF-07 | Para entradas inválidas de RF-01, informar como corrigir e não chamar a API. Para busca válida sem cidades, exibir “Nenhuma cidade encontrada” e permitir outra busca, sem iniciar consulta meteorológica. |
| RF-08 | Mostrar carregamento e, em falha ou timeout de 15 segundos, encerrar esse estado e oferecer nova tentativa manual. Tratar clima e previsão como consulta integral: dados obrigatórios ausentes/ inválidos resultam em erro, sem sucesso parcial. Repetir os parâmetros da operação que falhou; somente a solicitação mais recente pode atualizar a interface, sem cache ou fallback antigo. |

### Regras de busca e apresentação

- **Entrada:** tamanho contado em caracteres Unicode após remover espaços externos.
  Preservar espaços internos e grafia no termo enviado; não executar autocorreção.
  “Exclusivamente numérica” significa apenas dígitos; par de coordenadas significa
  dois números com sinal opcional, ponto decimal opcional e separados por vírgula.
  Não implementar detecção de todos os formatos postais internacionais.
- **Ordenação:** para comparação, normalizar nome e termo em Unicode NFD, remover
  marcas diacríticas e ignorar caixa. Classificar por igualdade, prefixo, ocorrência
  parcial e, por último, demais correspondências retornadas pelo provedor. Desempatar
  por cidade, estado/província e país usando comparação pt-BR sem diferença de caixa
  ou acento; estado ausente fica depois de estados presentes. Persistindo empate,
  usar o identificador do provedor em ordem crescente. Ordenar antes de limitar a 5;
  não prometer cobertura global além do conjunto retornado pela API.
- **Dados válidos:** cidade com identificador, nome, país e coordenadas válidas;
  estado/província é opcional. Na previsão, exigir cinco datas locais distintas e
  consecutivas, temperaturas numéricas finitas com mínima ≤ máxima e condição
  meteorológica reconhecida para cada dia. No atual, exigir temperatura finita,
  condição reconhecida e horário do dado. Exigir fuso válido. Resposta vazia de
  geocoding é ausência de resultados; item estruturalmente inválido ou resposta
  meteorológica incompleta é erro, não ausência de cidades.
- **Temperaturas:** F = C × 9/5 + 32 e C = (F − 32) × 5/9. Arredondar apenas para
  apresentação ao décimo mais próximo, com empates afastados de zero; mostrar
  separador decimal por vírgula e unidade explícita. Exemplos: 20 °C → 68,0 °F;
  1,25 °C → 1,3 °C; −1,25 °C → −1,3 °C. Voltar à unidade inicial usa o original,
  nunca o valor exibido já arredondado.
- **Ciclo de consulta:** uma nova busca válida limpa os resultados e dados
  meteorológicos anteriores; uma nova seleção limpa o clima/previsão anterior.
  Exibir carregamento na área consultada e manter busca e seleção utilizáveis.
  Substituir uma operação invalida a anterior e reinicia seu prazo; trocar somente
  a unidade não consulta a API nem reinicia o prazo. Respostas substituídas ou
  expiradas não alteram dados, mensagens ou carregamento.
- **Atualização:** consultar clima/previsão somente por seleção ou nova tentativa,
  sem polling. Uma consulta atravessando meia-noite precisa conter a janela de
  cinco dias vigente na apresentação, ou deve resultar em indisponibilidade
  recuperável, sem datas fabricadas.

## User Stories

As personas são as hipóteses definidas no [discovery](./discovery.md), ainda não
validadas por pesquisa. Cada story está vinculada ao requisito funcional e aos
respectivos critérios de aceite na seção seguinte.

| ID | User Story | Requisito funcional |
|---|---|---|
| US-01 | Como pessoa que consulta o clima no dia a dia, quero buscar uma cidade pelo nome para localizar o lugar cujo clima desejo consultar. | RF-01 |
| US-02 | Como pessoa que consulta o clima no dia a dia, quero selecionar uma cidade em resultados ordenados que identifiquem estado/província e país para distinguir cidades homônimas e consultar o lugar correto. | RF-02 |
| US-03 | Como pessoa que consulta o clima no dia a dia, quero ver a temperatura, a condição e o horário da estimativa atual da cidade selecionada para decidir como me preparar antes de sair. | RF-03 |
| US-04 | Como pessoa que planeja atividades com antecedência, quero consultar as datas locais, condições e temperaturas mínima e máxima de hoje e dos quatro dias seguintes para escolher quando realizar uma atividade. | RF-04 |
| US-05 | Como pessoa familiarizada com Fahrenheit, quero alternar de Celsius para Fahrenheit e manter essa escolha ao mudar de cidade durante a sessão para consultar temperaturas na unidade que compreendo melhor. | RF-05 |
| US-06 | Como pessoa familiarizada com Fahrenheit, quero visualizar a temperatura atual e todas as mínimas e máximas da previsão na unidade selecionada para interpretar os dados sem fazer conversões manuais. | RF-06 |
| US-07 | Como pessoa que consulta o clima no dia a dia, quero receber orientação quando minha busca for inválida ou não encontrar cidades para ajustar o termo e continuar a consulta. | RF-07 |
| US-08 | Como pessoa que planeja atividades com antecedência, quero receber uma mensagem de erro e poder tentar novamente quando a consulta falhar ou exceder 15 segundos para retomar meu planejamento sem recarregar a página. | RF-08 |

## Acceptance Criteria

Os 10 critérios abaixo cobrem os oito requisitos funcionais e suas respectivas
stories (US-01 a US-08). Casos indicados como alternativas devem ser executados
como variações do mesmo critério nos testes automatizados. Os requisitos
transversais de desempenho e acessibilidade permanecem na seção seguinte.

| ID | Requisito / Story | Given | When | Then |
|---|---|---|---|---|
| AC-01 | RF-01 / US-01 | O campo contém “  São Paulo  ”, “D'Oeste”, um nome com hífen ou um nome de 2 caracteres, e há uma resposta válida controlada. | A pessoa envia por Enter ou pelo botão. | A consulta usa o termo sem espaços externos e preserva os caracteres internos; digitar sem enviar não consulta a API. |
| AC-02 | RF-02 / US-02 | O teste fornece mais de 5 resultados válidos embaralhados, com homônimos, variantes de caixa/acento e estado ausente. | A busca termina com sucesso. | A lista tem exatamente os primeiros 5 itens segundo a ordenação definida; cada item identifica cidade, país e estado quando disponível, e sua seleção consulta as coordenadas correspondentes. |
| AC-03 | RF-03 / US-03 | A cidade foi selecionada e a fonte fornece atual e previsão completos com temperatura atual de 20 °C e horário conhecido. | Os dados são renderizados antes de 15 segundos, com Celsius ativo. | A interface identifica a cidade, mostra 20,0 °C, a condição correspondente ao código recebido, “Estimativa meteorológica” e o horário do dado no fuso da cidade. |
| AC-04 | RF-04 / US-04 | A data local é 11/11/2026 e há resposta válida completa. | A consulta termina e, depois, o relógio local avança para 12/11/2026 sem nova seleção. | Inicialmente aparecem 11 a 15/11/2026 com condição, mínima/máxima e horário da consulta; após a virada, as datas não mudam silenciosamente e há orientação para selecionar novamente a cidade, sem chamada automática. |
| AC-05 | RF-05 / US-05 | Uma cidade está exibida em Celsius ou Fahrenheit. | A pessoa escolhe a outra unidade e seleciona outra cidade. | A unidade escolhida permanece ativa para os dados novos, sem chamada à API causada somente pela troca de unidade. |
| AC-06 | RF-05 / US-05 | A página está exibindo uma cidade em Fahrenheit. | A pessoa recarrega ou reabre a página. | A interface inicia em Celsius, sem cidade selecionada, com orientação para buscar e sem consulta meteorológica automática. |
| AC-07 | RF-06 / US-06 | Valores originais conhecidos preenchem temperatura atual e mínimas/máximas, incluindo 20, 1,25 e −1,25 °C. | A pessoa alterna Celsius → Fahrenheit → Celsius. | Todas as temperaturas seguem a fórmula e o arredondamento definidos, com uma casa decimal e unidade explícita: 20 °C aparece como 68,0 °F; ao voltar, 1,25 e −1,25 °C aparecem como 1,3 e −1,3 °C, sem alteração dos originais; vento/pressão não aparecem. |
| AC-08 | RF-07 / US-07 | O campo está vazio, contém espaços, um caractere, apenas dígitos ou um par numérico como “-23.55, -46.63”. | A pessoa envia a busca. | Nenhuma API é chamada; entradas curtas recebem orientação de mínimo de 2 caracteres e formatos não suportados recebem orientação para buscar pelo nome da cidade. |
| AC-09 | RF-07 / US-07 | Uma busca válida foi enviada e a API retorna uma lista vazia. | A resposta é processada. | A interface informa que nenhuma cidade foi encontrada, sem apresentar erro de rede, e permite enviar outra busca. |
| AC-10 | RF-08 / US-08 | Uma busca ou seleção foi iniciada, podendo substituir uma anterior ainda pendente. | A operação vigente falha, recebe dados inválidos/parciais ou atinge 15 segundos sem sucesso; depois chegam respostas substituídas ou expiradas. | O carregamento vigente termina com erro e nova tentativa, sem dados antigos/parciais; respostas inválidas por vigência não mudam a tela. Tentar novamente repete os parâmetros que falharam e reinicia o prazo, sem recarregar a página. |

**Execução dos testes:** controlar relógio, fuso e respostas da API. Exercitar os
casos alternativos como variações parametrizadas, sem multiplicar critérios.
Validar sucesso renderizado antes de 15 segundos e timeout aos 15 segundos sem
sucesso; o prazo inclui rede, processamento e renderização. Validar também que
uma resposta substituída não sobrepõe um sucesso mais recente. Testes com respostas
controladas comprovam o comportamento do app, não a disponibilidade real do provedor.

## Non-Functional Requirements

| ID | Categoria | Requisito verificável |
|---|---|---|
| RNF-01 | Responsividade | Aplicação utilizável em larguras de 320 px a 1920 px, sem rolagem horizontal. Alvos de toque têm pelo menos 44 × 44 px. Em telas pequenas, toda informação prevista continua acessível. |
| RNF-02 | Desempenho | Medir do envio da busca até resultados renderizados e da seleção até clima e previsão renderizados. Cada operação tem prazo de 15 segundos, incluindo rede e renderização; atingir o prazo sem sucesso resulta em timeout. Verificar a integração real no ambiente local e registrar navegador e condições de rede; não exigir teste de carga nem prometer SLA do provedor. |
| RNF-03 | Acessibilidade | WCAG 2.1 AA permanece como requisito de qualidade do exercício. Campo e controles têm nomes acessíveis; todas as ações funcionam por teclado, com foco visível e sem armadilhas. Texto tem contraste mínimo de 4,5:1; resultados, carregamento, erros e mudança de unidade são comunicados a leitores de tela sem depender só de cor ou ícones. Validar manualmente teclado/leitor de tela e executar verificações automatizadas. |
| RNF-04 | Resiliência | Sem cache de aplicação, fallback antigo, polling ou retry automático. Falhas, dados inválidos e timeout produzem erro recuperável; tentativas manuais reiniciam o prazo e respostas expiradas/substituídas não alteram a interface. |
| RNF-05 | Dependência externa | Open-Meteo é a fonte definida e não requer API key. Conferir os termos, limites aplicáveis ao exercício e exigências de atribuição antes de usar os dados reais; registrar a atribuição exigida na interface. Não exigir processo corporativo de aprovação para este exercício. |
| RNF-06 | Privacidade | Não há autenticação, geolocalização, histórico, analytics nem persistência de dados no servidor nesta versão. Logs técnicos não incluem texto pesquisado nem identificadores de usuário. |
| RNF-07 | Localização | Textos, datas e números em pt-BR; previsão e horários no fuso local da cidade, identificado na consulta. Nomes de lugares preservam a grafia recebida da fonte, sem tradução/transliteração própria. Condições meteorológicas têm descrição textual em pt-BR correspondente ao código da fonte. |
| RNF-08 | Compatibilidade | Homologar apenas Chrome e Firefox: versões estáveis desktop e Android vigentes no início da homologação. Registrar versões exatas, SO e dispositivos utilizados. Outros navegadores e plataformas não integram a matriz de suporte desta versão. |
| RNF-09 | Segurança | Permitir servir a aplicação por HTTP em localhost; manter HTTPS nas chamadas à Open-Meteo. Tratar entradas e textos da API como texto, nunca HTML executável; validar estrutura e tipos das respostas antes de exibir dados. |
| RNF-10 | Observabilidade | Usar somente o console local para registrar operação (busca/clima), resultado técnico, duração e status HTTP quando existente. Não registrar termo, cidade, coordenadas, respostas completas ou identificadores de usuário. Não enviar logs a serviços externos nem implementar armazenamento, retenção ou infraestrutura de monitoramento. |

Para RNF-01, verificar o fluxo completo em 320, 375, 768 e 1920 px, além de
inspecionar a adaptação entre essas larguras; nomes longos devem quebrar linha
sem ocultar identificação da cidade. Evidências de homologação devem registrar
resultados, não apenas comandos executados.

## Edge Cases

| Situação | Comportamento esperado |
|---|---|
| Campo vazio ou contendo apenas espaços | Não chamar a API; solicitar pelo menos 2 caracteres. |
| Entrada curta, numérica ou de coordenadas | Remover espaços externos e aplicar RF-01; rejeitar entradas curtas ou formatos não suportados sem chamar a API, com orientação específica. |
| Nome com acentos, hífen ou apóstrofo | Aceitar nomes como “São Paulo” e “D'Oeste”, preservar os caracteres e enviar o termo como texto, sem interpretá-lo como HTML. |
| Cidade inexistente ou geocoding sem resultados | Exibir “Nenhuma cidade encontrada”, permitir corrigir o nome e pesquisar novamente; não tratar como falha técnica nem iniciar consulta meteorológica sem uma cidade selecionada. |
| Resultados numerosos, homônimos ou sem estado/província | Mostrar até 5 resultados conforme a ordenação definida, com cidade, país e estado/província quando disponível; a ausência desse último campo não invalida o resultado. Exigir seleção explícita. |
| Nova busca ou seleção antes da resposta anterior | Invalidar a anterior, limpar os dados substituídos e exibir carregamento; somente a operação mais recente pode atualizar a interface, mesmo se a anterior terminar depois. |
| API retorna erro, resposta inválida ou falha de rede | Encerrar o carregamento, informar indisponibilidade e oferecer nova tentativa; não mostrar dados não validados nem dados antigos como atuais. |
| Busca ou consulta atinge 15 segundos sem sucesso | Encerrar o carregamento, informar timeout e oferecer nova tentativa com os mesmos parâmetros; ignorar resposta tardia da tentativa expirada. |
| Resposta parcial ou inválida | Se faltar campo obrigatório do atual ou dos cinco dias, houver valor não finito, mínima maior que máxima, condição desconhecida ou fuso inválido, exibir erro para a consulta meteorológica integral. Não inventar valores nem exibir sucesso parcial. Estado/província ausente no geocoding é permitido; estrutura inválida não equivale a lista vazia. |
| Mudança de dia ou diferença de fuso | Usar o calendário local da cidade. Após a virada, manter datas/horários explícitos e orientar nova seleção, sem atualização automática. Se a consulta atravessar meia-noite sem conter a janela vigente, mostrar erro recuperável. |

## Assumptions

- Open-Meteo será usada tanto para geocoding quanto para dados meteorológicos,
  sem API key, conforme o discovery; termos e permissão de uso ainda são
  pré-requisitos pendentes.
- “Hoje + quatro dias” refere-se ao calendário local da cidade consultada.
- Busca com 2 ou mais caracteres é enviada somente por Enter ou pelo botão,
  nunca por autocomplete.
- A sessão é a execução atual da página; recarregar ou reabrir restaura Celsius.
  Não utilizar armazenamento persistente para unidade, cidade ou histórico.
- A busca não corrige automaticamente erros de digitação. Acentos, hífen e
  apóstrofo são preservados e tratados como texto.
- A interface não precisa suportar funcionamento offline nesta versão.
- As personas do discovery são hipóteses e não representam pesquisa validada.
- As exclusões de favoritos, alertas, mapas, notificações push e previsão de
  longo prazo estão confirmadas para esta versão.
- A entrega é local e individual: não requer hospedagem pública, SLA, dimensionamento
  multiusuário ou aprovação corporativa. O aceite é a conclusão dos critérios
  funcionais e das verificações de qualidade pelo próprio autor do exercício.
- Usar o tema dark glassmorphism do projeto, respeitando contraste, sem depender
  de guia de marca corporativa ou métricas de adoção.

## Risks

| Risco | Impacto | Mitigação |
|---|---|---|
| Open-Meteo indisponível, lenta ou com contrato alterado | A consulta local pode ficar sem resultados ou dados meteorológicos. | Tratar erro e timeout em até 15 segundos, validar a integração real e usar respostas controladas nos testes. Cache/fallback não fazem parte desta versão. |
| Estimativa corrente ser interpretada como observação em tempo real | Perda de confiança e interpretação incorreta do dado. | Exibir “Estimativa meteorológica” e horário do dado no fuso da cidade; não prometer observação de estação nem atualização automática. |
| Homônimos, ordenação ou dados de localização incompletos | Seleção da cidade errada. | Exibir cidade, estado/província quando disponível e país; aplicar ordenação definida e seleção explícita. |
| Resultados do provedor diferirem da expectativa em nomes com acentos ou erros de digitação | Busca sem correspondência ou cidade incorreta. | Preservar o termo, testar normalização da ordenação e homônimos; informar ausência de resultados sem prometer autocorreção ou cobertura global. |
| Latência da rede local ou da API atingir 15 segundos | Consulta interrompida durante a demonstração. | Manter o timeout e a tentativa manual; testar falhas com respostas controladas e verificar a conexão antes da demonstração. |
| Uso da Open-Meteo contrariar termos ou limites aplicáveis | Restrição de acesso ou uso indevido dos dados, mesmo localmente. | Conferir as condições aplicáveis ao exercício e cumprir limites e atribuição; evitar chamadas reais repetitivas nos testes automatizados. |
| Acessibilidade ou responsividade não atendidas em celulares/leitores de tela | Parte do público não consegue usar o fluxo principal. | Validar critérios WCAG 2.1 AA, teclado, leitor de tela e viewports mobile durante testes. |
| Console local registrar conteúdo de consultas indevidamente | Exposição desnecessária durante a demonstração. | Restringir os registros aos metadados técnicos permitidos em RNF-10, sem enviar dados a serviços de monitoramento. |

## Out of Scope

- Autenticação, contas de usuário e persistência de dados no servidor.
- Geolocalização automática, favoritos e histórico de cidades.
- Analytics e personalização baseada em perfil.
- Busca por coordenadas, CEP ou código postal.
- Autocorreção de nomes de cidades e validação de todos os formatos postais internacionais.
- Conversão de unidades de vento e pressão.
- Cache offline ou apresentação de dados antigos como fallback.
- Alertas meteorológicos, mapas, notificações push e previsão para além dos
  cinco dias definidos.
- Aplicativos nativos iOS/Android e PWA instalável.
- Dados horários detalhados; a previsão desta versão é diária.
- Atualização meteorológica automática ou fornecimento de observação de estação
  como substituto da estimativa corrente.
- Homologação de navegadores diferentes de Chrome e Firefox.
- Hospedagem pública, deploy de produção, domínio, certificados locais, SLA e
  dimensionamento multiusuário.
- Plataforma externa de logs, analytics, métricas de adoção e processos corporativos
  de aprovação de marca ou entrega.
- Autocomplete, persistência local de preferências, tradução própria dos nomes de
  cidades, tentativas automáticas e sucesso parcial da consulta meteorológica.

## Open Questions

Não há perguntas de produto que bloqueiem o planejamento ou o desenvolvimento
local. As antigas pendências de hospedagem, SLA, infraestrutura de logs,
aprovação corporativa, marca e métricas de adoção não se aplicam a esta entrega.
Permanecem verificações de execução, não novas decisões de escopo:

| ID | Verificação | Condição de conclusão |
|---|---|---|
| OQ-01 | Condições de uso da Open-Meteo | Antes de usar dados reais, conferir termos, limites e atribuição aplicáveis ao exercício; não presumir isenção por execução local. |
| OQ-02 | Integração e execução local | No plano técnico, definir os comandos locais; antes de concluir, verificar acesso à API pelo navegador, timeout, testes automatizados e fluxos em Chrome/Firefox com viewports responsivos. |

Qualquer publicação futura exige reavaliar hospedagem, segurança de transporte,
capacidade, logs, licença e responsabilidades; não está autorizada implicitamente
por esta especificação local.

## Traceability Matrix

Cada linha vincula a story ao requisito funcional, aos critérios existentes e
aos RNF que devem orientar suas tarefas e testes. RNF-01 (responsividade),
RNF-03 (acessibilidade), RNF-07 (localização) e RNF-08 (compatibilidade) são
transversais e aplicam-se a todas as stories, além dos RNF específicos abaixo.

| User Story | Requisito funcional | Acceptance Criteria | RNF específicos relevantes | Foco das tarefas e testes |
|---|---|---|---|---|
| US-01 — Buscar cidade | RF-01 | AC-01 | RNF-02, RNF-05, RNF-06, RNF-09, RNF-10 | Envio explícito por Enter/botão, preservação do termo, integração com geocoding e limite de resposta. |
| US-02 — Selecionar cidade | RF-02 | AC-02 | RNF-02, RNF-04, RNF-05, RNF-09 | Normalização e desempates, limite de 5 resultados, campos opcionais e seleção das coordenadas corretas. |
| US-03 — Consultar estimativa atual | RF-03 | AC-03 | RNF-02, RNF-04, RNF-05, RNF-09, RNF-10 | Temperatura/condição, identificação como estimativa, horário do dado e validação da resposta integral. |
| US-04 — Consultar cinco dias | RF-04 | AC-04 | RNF-02, RNF-04, RNF-05, RNF-09, RNF-10 | Janela local de hoje + 4 dias, campos obrigatórios, horário da consulta e virada do dia sem atualização automática. |
| US-05 — Escolher unidade na sessão | RF-05 | AC-05, AC-06 | RNF-06 | Estado inicial sem cidade, Celsius ao recarregar e manutenção da unidade ao mudar de cidade, sem persistência ou chamada causada pela alternância. |
| US-06 — Converter temperaturas | RF-06 | AC-07 | RNF-06 | Fórmulas, arredondamento positivo/negativo, apresentação de todas as temperaturas e preservação dos valores originais. |
| US-07 — Corrigir busca inválida ou vazia | RF-07 | AC-08, AC-09 | RNF-02, RNF-05, RNF-06, RNF-09 | Validação sem chamada externa, orientação por tipo de entrada e distinção entre resultado vazio e falha técnica. |
| US-08 — Recuperar falhas | RF-08 | AC-10 | RNF-02, RNF-04, RNF-05, RNF-06, RNF-09, RNF-10 | Timeout de 15 segundos, erro de rede/dados parciais, tentativa manual com mesmos parâmetros e descarte de respostas expiradas/substituídas. |

Os AC não substituem a validação dos RNF: prever verificações próprias de layout,
teclado/leitor de tela, contraste, Chrome/Firefox e logs locais. Conferir os termos
e a atribuição da Open-Meteo antes das consultas reais (RNF-05/OQ-01); usar respostas
controladas para os testes automatizados de falhas, tempo e ordenação.
