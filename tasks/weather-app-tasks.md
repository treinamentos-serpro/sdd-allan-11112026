# Backlog de Tarefas — Weather App

Entrada: [weather-app-plan.md](../plans/weather-app-plan.md).
Requisitos: [weather-app-spec.md](../specs/weather-app-spec.md) (IDs `RF-`, `US-`, `AC-`, `RNF-`, OQ).

Cada tarefa é uma unidade testável, com **no máximo 2 arquivos relevantes** e **um único tipo**.
Os tipos são **UI** (componentes e layout), **Data** (tipos, lógica pura, services, reducer e hooks),
**Test** (testes e validação) e **Infra** (ferramentas e configuração).

**Ordem de implementação:** fundação → tipos → funções puras → services → hook → componentes →
integração → testes → hardening. Os IDs seguem essa ordem, e cada tarefa depende apenas de IDs menores.
A coluna **Dependências** é a fonte de verdade para o agendamento.

Convenções dos critérios de aceite:

- Cada critério cita o requisito rastreado entre colchetes, por exemplo `[AC-08]`.
- Cada critério indica uma verificação observável: comando com resultado esperado, teste com nome
  definido, valor exato, asserção, contagem ou busca no código.
- Testes automatizados que comprovam um AC têm o título iniciado por `AC-NN:`.

## Visão geral

| ID | Título | Camada | Tipo | Dependências |
|---|---|---|---|---|
| T-01 | Decidir o destino do código existente divergente | Fundação | Infra | — |
| T-02 | Adicionar `@axe-core/playwright` ao projeto | Fundação | Infra | T-01 |
| T-03 | Configurar Vitest e jsdom | Fundação | Infra | T-01 |
| T-04 | Configurar os projetos do Playwright | Fundação | Infra | T-02 |
| T-05 | Definir tipos de domínio e de estado | Tipos | Data | T-01 |
| T-06 | Implementar `validateSearchTerm` | Funções puras | Data | T-05 |
| T-07 | Implementar a tabela de códigos WMO | Funções puras | Data | T-05 |
| T-08 | Implementar conversão e formatação de temperatura | Funções puras | Data | T-05 |
| T-09 | Implementar utilitários de data e horário | Funções puras | Data | T-05 |
| T-10 | Implementar `rankCities` | Funções puras | Data | T-05 |
| T-11 | Implementar o reducer puro | Funções puras | Data | T-05 |
| T-12 | Implementar `fetchJson` com erro tipado | Services | Data | T-05 |
| T-13 | Implementar o service de geocoding | Services | Data | T-05, T-12 |
| T-14 | Implementar o service de forecast | Services | Data | T-07, T-09, T-12 |
| T-15 | Implementar o hook `useWeatherApp` | Hook | Data | T-10, T-11, T-13, T-14 |
| T-16 | Implementar `useLocalDayChanged` | Hook | Data | T-09 |
| T-17 | Criar a base visual (tema, foco e bootstrap) | Componentes | UI | T-05 |
| T-18 | Implementar `AttributionFooter` | Componentes | UI | T-17 |
| T-19 | Implementar `SearchForm` | Componentes | UI | T-06, T-18 |
| T-20 | Implementar `CityResults` | Componentes | UI | T-05, T-18 |
| T-21 | Implementar `StatusMessage` | Componentes | UI | T-05, T-18 |
| T-22 | Implementar `CurrentWeatherCard` | Componentes | UI | T-05, T-07, T-08, T-09 |
| T-23 | Implementar `ForecastList` | Componentes | UI | T-05, T-07, T-08, T-09 |
| T-24 | Implementar `UnitToggle` | Componentes | UI | T-08, T-11, T-18 |
| T-25 | Implementar `DayChangedNotice` e ligá-lo à virada do dia | Componentes | UI | T-16, T-18 |
| T-26 | Integrar a busca em `App` | Integração | UI | T-15, T-19, T-20, T-21 |
| T-27 | Integrar seleção e clima em `App` | Integração | UI | T-22, T-23, T-24, T-25, T-26 |
| T-28 | Implementar "Tentar novamente" e troca de cidade após erro | Integração | UI | T-27 |
| T-29 | Criar fixtures da Open-Meteo | Testes | Test | T-03 |
| T-30 | Testar `validateSearchTerm` | Testes | Test | T-03, T-06 |
| T-31 | Testar temperatura e arredondamento | Testes | Test | T-03, T-08 |
| T-32 | Testar `rankCities` e a tabela WMO | Testes | Test | T-03, T-07, T-10 |
| T-33 | Testar os services com fixtures | Testes | Test | T-13, T-14, T-29 |
| T-34 | Testar o reducer | Testes | Test | T-03, T-11 |
| T-35 | Testar o hook com fake timers | Testes | Test | T-03, T-15 |
| T-36 | Testar `SearchForm` e `CityResults` | Testes | Test | T-03, T-19, T-20 |
| T-37 | Testar `StatusMessage` | Testes | Test | T-03, T-21 |
| T-38 | Testar `CurrentWeatherCard` e `ForecastList` | Testes | Test | T-03, T-22, T-23 |
| T-39 | Testar `UnitToggle` e `DayChangedNotice` | Testes | Test | T-03, T-24, T-25 |
| T-40 | Testar o fluxo de integração de `App` | Testes | Test | T-27, T-29 |
| T-41 | Testar o fluxo busca → seleção → clima no E2E | Testes | Test | T-04, T-27, T-29 |
| T-42 | Testar timeout, virada do dia, unidade e recarga no E2E | Testes | Test | T-04, T-25, T-27, T-28 |
| T-43 | Implementar logs locais sem dados sensíveis | Hardening | Data | T-12, T-15 |
| T-44 | Revisar acessibilidade de `SearchForm` e `CityResults` | Hardening | UI | T-27 |
| T-45 | Revisar acessibilidade de `StatusMessage` e `App` | Hardening | UI | T-27 |
| T-46 | Revisar acessibilidade de `CurrentWeatherCard` e `ForecastList` | Hardening | UI | T-27 |
| T-47 | Revisar acessibilidade de `UnitToggle` e `DayChangedNotice` | Hardening | UI | T-27 |
| T-48 | Ajustar layout responsivo de `App` e `DayChangedNotice` | Hardening | UI | T-27 |
| T-49 | Ajustar layout responsivo de `SearchForm` e `CityResults` | Hardening | UI | T-27 |
| T-50 | Ajustar layout responsivo de `CurrentWeatherCard` e `ForecastList` | Hardening | UI | T-27 |
| T-51 | Ajustar layout responsivo de `UnitToggle` e `StatusMessage` | Hardening | UI | T-27 |
| T-52 | Testar responsividade e Pixel 7 no E2E | Hardening | Test | T-04, T-41, T-48, T-49, T-50, T-51 |
| T-53 | Testar acessibilidade automatizada com axe | Hardening | Test | T-02, T-04, T-41, T-44, T-45, T-46, T-47 |
| T-54 | Preparar o checklist manual de acessibilidade | Hardening | Test | T-53 |
| T-55 | Registrar a integração real e os termos de uso da Open-Meteo | Hardening | Test | T-42 |
| T-56 | Validar o pipeline completo e registrar evidências | Hardening | Test | T-30, T-31, T-32, T-33, T-34, T-35, T-36, T-37, T-38, T-39, T-40, T-41, T-42, T-52, T-53 |
| T-57 | Verificar as regras de dependência entre camadas | Hardening | Test | T-56 |

---

## Priorização, tamanho e fatias verticais

Os IDs (T-NN) seguem as **camadas** de implementação e não mudam. A **ordem de execução** sugerida
abaixo segue **fatias verticais**: cada fatia atravessa tipos → lógica → service → hook → UI → testes e
termina em algo visível ou demonstrável. As dependências de cada tarefa continuam valendo, e todas
já estão satisfeitas dentro da própria fatia ou em fatias anteriores.

### Critérios

A spec não define prioridades; os critérios abaixo são uma proposta e podem ser ajustados.

| Prioridade | Significado |
|---|---|
| **P0** | Necessária para o fluxo principal funcionar (busca → seleção → clima atual e previsão; AC-01 a AC-05, AC-08, AC-09), incluindo as predecessoras por dependência. Sem ela o MVP da spec não existe. |
| **P1** | Necessária para atender os demais requisitos e dar confiança ao MVP: erros e nova tentativa, testes de cada camada, E2E, acessibilidade, responsividade e validação final. |
| **P2** | Evidência, verificação ou melhoria sem efeito no uso: logs, checklist manual e verificação de camadas. |

| Tamanho | Significado (relativo, sem estimativa em horas) |
|---|---|
| **P** | 1 arquivo, até 4 critérios, lógica direta. |
| **M** | 5 a 7 critérios ou lógica com armadilhas (arredondamento, fuso, abort, validação) ou 2 arquivos com comportamento. |
| **G** | Orquestração ou validação extensa (8 critérios, timers, abort) ou E2E em vários navegadores com relógio simulado. |

Totais: **P0 = 28**, **P1 = 26**, **P2 = 3**; **P = 26**, **M = 27**, **G = 4** (T-14, T-15, T-41, T-42).

### Fatia 0 — Página no ar (fundação)

**Resultado visível:** o app abre com o tema dark glassmorphism, foco visível e o rodapé de atribuição à Open-Meteo.
**Pré-requisito:** decisão de T-01 — **tomada: substituir o código existente** (ver `plans/weather-app-plan.md`).
Faltam só os dois `grep` de T-01, que passam a valer quando houver código em `src/`.

| Ordem | ID | Título | Prioridade | Tamanho |
|---|---|---|---|---|
| 1 | T-01 | Decidir o destino do código existente divergente | P0 | M |
| 2 | T-03 | Configurar Vitest e jsdom | P0 | P |
| 3 | T-05 | Definir tipos de domínio e de estado | P0 | M |
| 4 | T-17 | Criar a base visual (tema, foco e bootstrap) | P0 | M |
| 5 | T-18 | Implementar `AttributionFooter` | P0 | P |

### Fatia 1 — Buscar e escolher uma cidade (US-01, US-02, AC-01, AC-02, AC-08, AC-09)

**Resultado visível:** digitar uma cidade, ver a validação dos termos inválidos e a lista com até 5 cidades
ordenadas (dados reais da Open-Meteo no navegador). Ainda sem clima.

| Ordem | ID | Título | Prioridade | Tamanho |
|---|---|---|---|---|
| 6 | T-06 | Implementar `validateSearchTerm` | P0 | M |
| 7 | T-07 | Implementar a tabela de códigos WMO | P0 | P |
| 8 | T-09 | Implementar utilitários de data e horário | P0 | M |
| 9 | T-10 | Implementar `rankCities` | P0 | M |
| 10 | T-11 | Implementar o reducer puro | P0 | M |
| 11 | T-12 | Implementar `fetchJson` com erro tipado | P0 | M |
| 12 | T-13 | Implementar o service de geocoding | P0 | M |
| 13 | T-14 | Implementar o service de forecast | P0 | G |
| 14 | T-15 | Implementar o hook `useWeatherApp` | P0 | G |
| 15 | T-19 | Implementar `SearchForm` | P0 | M |
| 16 | T-20 | Implementar `CityResults` | P0 | M |
| 17 | T-21 | Implementar `StatusMessage` | P0 | M |
| 18 | T-26 | Integrar a busca em `App` | P0 | M |
| 19 | T-29 | Criar fixtures da Open-Meteo | P0 | M |
| 20 | T-33 | Testar os services com fixtures | P0 | M |
| 21 | T-30 | Testar `validateSearchTerm` | P1 | P |
| 22 | T-32 | Testar `rankCities` e a tabela WMO | P1 | P |
| 23 | T-34 | Testar o reducer | P1 | P |
| 24 | T-35 | Testar o hook com fake timers | P1 | M |
| 25 | T-36 | Testar `SearchForm` e `CityResults` | P1 | M |
| 26 | T-37 | Testar `StatusMessage` | P1 | P |

> O forecast (T-07, T-09, T-14) entra nesta fatia porque `useWeatherApp` (T-15) depende do service de
> forecast, mesmo que a tela de clima só apareça na fatia 2.

### Fatia 2 — Ver o clima da cidade (MVP completo: US-03 a US-05, AC-03 a AC-07)

**Resultado visível:** selecionar uma cidade e ver clima atual, previsão de 5 dias, troca °C/°F sem
nova requisição e aviso de virada do dia. **É o MVP da spec.**

| Ordem | ID | Título | Prioridade | Tamanho |
|---|---|---|---|---|
| 27 | T-08 | Implementar conversão e formatação de temperatura | P0 | M |
| 28 | T-16 | Implementar `useLocalDayChanged` | P0 | P |
| 29 | T-22 | Implementar `CurrentWeatherCard` | P0 | M |
| 30 | T-23 | Implementar `ForecastList` | P0 | P |
| 31 | T-24 | Implementar `UnitToggle` | P0 | P |
| 32 | T-25 | Implementar `DayChangedNotice` e ligá-lo à virada do dia | P0 | P |
| 33 | T-27 | Integrar seleção e clima em `App` | P0 | M |
| 34 | T-40 | Testar o fluxo de integração de `App` | P0 | M |
| 35 | T-31 | Testar temperatura e arredondamento | P1 | P |
| 36 | T-38 | Testar `CurrentWeatherCard` e `ForecastList` | P1 | P |
| 37 | T-39 | Testar `UnitToggle` e `DayChangedNotice` | P1 | P |
| 38 | T-02 | Adicionar `@axe-core/playwright` ao projeto | P1 | P |
| 39 | T-04 | Configurar os projetos do Playwright | P1 | P |
| 40 | T-41 | Testar o fluxo busca → seleção → clima no E2E | P1 | G |

### Fatia 3 — Resiliência (US-08, AC-10, RNF-02, RNF-10)

**Resultado visível:** erro e timeout de 15 s com "Tentar novamente", troca de cidade após erro e a virada
do dia comprovadas no navegador.

| Ordem | ID | Título | Prioridade | Tamanho |
|---|---|---|---|---|
| 41 | T-28 | Implementar "Tentar novamente" e troca de cidade após erro | P1 | M |
| 42 | T-42 | Testar timeout, virada do dia, unidade e recarga no E2E | P1 | G |
| 43 | T-43 | Implementar logs locais sem dados sensíveis | P2 | M |

### Fatia 4 — Acessibilidade e responsividade (RNF-01, RNF-03, RNF-08)

**Resultado visível:** uso só com teclado, sem rolagem horizontal de 320 a 1920 px, relatório do axe sem
violações e execução no Pixel 7. As tarefas da fatia são independentes entre si e podem ser paralelizadas.

| Ordem | ID | Título | Prioridade | Tamanho |
|---|---|---|---|---|
| 44 | T-44 | Revisar acessibilidade de `SearchForm` e `CityResults` | P1 | M |
| 45 | T-45 | Revisar acessibilidade de `StatusMessage` e `App` | P1 | P |
| 46 | T-46 | Revisar acessibilidade de `CurrentWeatherCard` e `ForecastList` | P1 | P |
| 47 | T-47 | Revisar acessibilidade de `UnitToggle` e `DayChangedNotice` | P1 | P |
| 48 | T-48 | Ajustar layout responsivo de `App` e `DayChangedNotice` | P1 | P |
| 49 | T-49 | Ajustar layout responsivo de `SearchForm` e `CityResults` | P1 | P |
| 50 | T-50 | Ajustar layout responsivo de `CurrentWeatherCard` e `ForecastList` | P1 | P |
| 51 | T-51 | Ajustar layout responsivo de `UnitToggle` e `StatusMessage` | P1 | P |
| 52 | T-52 | Testar responsividade e Pixel 7 no E2E | P1 | M |
| 53 | T-53 | Testar acessibilidade automatizada com axe | P1 | P |

### Fatia 5 — Fechamento e evidências (RNF-05, RNF-08, OQ-01, OQ-02)

**Resultado visível:** relatório com os termos da Open-Meteo, a integração real, o pipeline completo
(`pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e`) e as regras de camadas verificadas.

| Ordem | ID | Título | Prioridade | Tamanho |
|---|---|---|---|---|
| 54 | T-55 | Registrar a integração real e os termos de uso da Open-Meteo | P1 | M |
| 55 | T-56 | Validar o pipeline completo e registrar evidências | P1 | M |
| 56 | T-54 | Preparar o checklist manual de acessibilidade | P2 | P |
| 57 | T-57 | Verificar as regras de dependência entre camadas | P2 | P |

### Observações

- **Acoplamento em T-27:** `App` só integra o clima depois de `UnitToggle` (T-24) e `DayChangedNotice`
  (T-25), por isso T-16, T-24 e T-25 são P0 por dependência, e não por valor. Para mostrar o clima antes,
  dividir T-27 (clima atual e previsão primeiro; unidade e aviso depois) e rebaixar T-16 e T-25 para P1.
- **Testes por fatia:** esta sequência corrige o trade-off da ordenação por camadas, em que os testes
  unitários ficavam depois da integração. Cada fatia entrega seus testes junto com o código.
- **Termos da Open-Meteo (OQ-01):** a parte de T-55 que confirma os termos e a atribuição deve ser feita
  antes da primeira execução manual contra a API real, no fim da fatia 1, e não só na fatia 5.
- **Paralelismo:** na fatia 4, T-44 a T-51 só dependem de T-27 e podem ser feitas em paralelo.

---

## Entrega 1 — Fundação e tipos

### T-01 — Decidir o destino do código existente divergente

- **Tipo:** Infra
- **Descrição:** O commit `Initial commit` continha `src/` e `tests/` com uma implementação anterior que
  divergia da spec. **Decidido: substituir** (registrado em `plans/weather-app-plan.md`). O código antigo
  foi removido no commit `entrega inicial` e não será restaurado. Resta confirmar, durante a fase Code,
  que o código novo não reintroduz as divergências.
- **Requisitos:** RF-06 (sem vento ou pressão), RF-08 (timeout de 15 s), RNF-01 (layout), Plano → Project Structure
- **Critérios de aceite:**
  - [x] `plans/weather-app-plan.md` contém a linha `Decisão:` com `reaproveitar` ou `substituir` e a justificativa.
  - [x] Se a decisão for substituir: a remoção do código antigo está em commit separado do código novo (`git show --stat 9bd0640` lista `src/` e `tests/` apenas como remoções; nenhum arquivo novo em `src/` ou `tests/`).
  - [ ] Ao final da fatia 1, `grep -rnE "windSpeed|pressure|humidity|precipitation" src tests` retorna zero ocorrências [RF-06].
  - [ ] Ao final da fatia 1, `grep -rnE "10_?000" src` retorna zero ocorrências de timeout de 10 s [RF-08].
- **Dependências:** nenhuma
- **Arquivos prováveis:** `plans/weather-app-plan.md`, `src/**`, `tests/**`

### T-02 — Adicionar `@axe-core/playwright` ao projeto

- **Tipo:** Infra
- **Descrição:** O plano exige `@axe-core/playwright`, que ainda não está em `package.json`.
- **Requisitos:** RNF-03 (verificação automatizada de acessibilidade)
- **Critérios de aceite:**
  - [x] `package.json` lista `@axe-core/playwright` em `devDependencies`.
  - [x] `pnpm install --frozen-lockfile` termina com código 0.
  - [x] `pnpm-lock.yaml` contém a entrada `@axe-core/playwright` [RNF-03].
- **Dependências:** T-01
- **Arquivos prováveis:** `package.json`, `pnpm-lock.yaml`

### T-03 — Configurar Vitest e jsdom

- **Tipo:** Infra
- **Descrição:** Configurar o ambiente jsdom e o setup do Testing Library com `jest-dom`.
- **Requisitos:** RNF-03 (nomes acessíveis verificáveis por role e label), Plano → Tech Stack
- **Critérios de aceite:**
  - [ ] `vite.config.ts` define `test.environment` como `jsdom` e `test.setupFiles` apontando para `tests/setup.ts`.
  - [ ] `tests/setup.ts` importa `@testing-library/jest-dom/vitest`.
  - [ ] `test.include` em `vite.config.ts` cobre `tests/unit`, `tests/components` e `tests/integration` e não cobre `tests/e2e` (os `.spec.ts` do Playwright não podem rodar no Vitest).
  - [ ] Um teste de fumaça com `expect(true).toBe(true)` passa em `pnpm test` com código 0.
- **Dependências:** T-01
- **Arquivos prováveis:** `vite.config.ts`, `tests/setup.ts`

### T-04 — Configurar os projetos do Playwright

- **Tipo:** Infra
- **Descrição:** Declarar os projetos Chromium desktop, Firefox desktop e Pixel 7 em `playwright.config.ts`.
- **Requisitos:** RNF-08 (Chrome e Firefox; Android via Pixel 7)
- **Critérios de aceite:**
  - [ ] `playwright.config.ts` declara exatamente os projetos `chromium`, `firefox` e `Pixel 7` [RNF-08].
  - [ ] `pnpm test:e2e --list` termina com código 0 e lista testes nos três projetos.
- **Dependências:** T-02
- **Arquivos prováveis:** `playwright.config.ts`

### T-05 — Definir tipos de domínio e de estado

- **Tipo:** Data
- **Descrição:** Criar os contratos do plano. Temperaturas ficam sempre em °C.
- **Requisitos:** RF-03, RF-04, RF-06, RF-08, RNF-09 (validação de estrutura)
- **Critérios de aceite:**
  - [ ] `src/types/weather.ts` exporta `City`, `CurrentWeather`, `ForecastDay` e `WeatherData`.
  - [ ] `src/types/app.ts` exporta `Unit`, `FailureKind`, `Operation`, `ViewState` e `AppState`.
  - [ ] `FailureKind` é a união exata `'network' | 'http' | 'timeout' | 'invalid_response' | 'out_of_window'` [RF-08].
  - [ ] `WeatherData.days` é a tupla `[ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay]` [RF-04].
  - [ ] `grep -rn "Fahrenheit\|fahrenheit" src/types` retorna zero ocorrências em campos de dados (somente o literal `Unit`) [RF-06].
  - [ ] `pnpm build` termina com código 0.
- **Dependências:** T-01
- **Arquivos prováveis:** `src/types/weather.ts`, `src/types/app.ts`

---

## Entrega 2 — Funções puras (`lib/`)

### T-06 — Implementar `validateSearchTerm`

- **Tipo:** Data
- **Descrição:** Função pura que faz trim, conta code points e rejeita termos curtos, somente dígitos ou par de coordenadas.
- **Requisitos:** RF-01, RF-07, US-01, US-07, AC-01, AC-08
- **Critérios de aceite:**
  - [ ] `""`, `"   "`, `"a"` e `" a "` retornam `too_short` com a mensagem `Digite pelo menos 2 caracteres.` [AC-08].
  - [ ] `"🙂"` (1 code point, 2 unidades UTF-16) retorna `too_short` [AC-08].
  - [ ] `"12345"` retorna `numeric_only` com a mensagem `Busque pelo nome da cidade; códigos postais não são suportados.` [AC-08].
  - [ ] `"-23.55, -46.63"` retorna `coordinates` com a mensagem `Busque pelo nome da cidade; coordenadas não são suportadas.` [AC-08].
  - [ ] `"  São Paulo  "` retorna `ok` com `term = "São Paulo"` (espaços externos removidos, internos preservados) [AC-01].
  - [ ] `"D'Oeste"`, `"Guarda-Costa"` e `"ab"` retornam `ok` sem alteração de grafia [AC-01].
  - [ ] O arquivo não importa `react`, `fetch` nem `Date` (verificado por `grep -nE "from 'react'|fetch\(|Date" src/lib/searchTerm.ts` sem resultados).
- **Dependências:** T-05
- **Arquivos prováveis:** `src/lib/searchTerm.ts`

### T-07 — Implementar a tabela de códigos WMO

- **Tipo:** Data
- **Descrição:** Mapa fechado `Record<number, string>` com descrições em pt-BR e função `isKnownWeatherCode`.
- **Requisitos:** RNF-07 (condições em pt-BR), RF-08 (código fora da tabela é inválido)
- **Critérios de aceite:**
  - [ ] `weatherDescription[0] === 'Céu limpo'`, `weatherDescription[3] === 'Nublado'`, `weatherDescription[61] === 'Chuva fraca'` e `weatherDescription[95] === 'Trovoada'` [RNF-07].
  - [ ] Toda descrição é string não vazia em pt-BR, sem texto em inglês (verificado na revisão de T-32).
  - [ ] `isKnownWeatherCode` retorna `false` para `-1`, `1.5`, `999` e `NaN` [RF-08].
- **Dependências:** T-05
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`

### T-08 — Implementar conversão e formatação de temperatura

- **Tipo:** Data
- **Descrição:** `toDisplayTemperature`, `roundHalfAwayFromZero` e `formatTemperature`. O arredondamento usa 12 dígitos significativos antes de arredondar, e `-0` vira `0`.
- **Requisitos:** RF-06, US-06, AC-07
- **Critérios de aceite:**
  - [ ] `formatTemperature(20, 'fahrenheit') === '68,0 °F'` [AC-07].
  - [ ] `formatTemperature(20, 'celsius') === '20,0 °C'` [AC-03].
  - [ ] `formatTemperature(1.25, 'celsius') === '1,3 °C'` e `formatTemperature(-1.25, 'celsius') === '−1,3 °C'` (sinal U+2212) [AC-07].
  - [ ] `formatTemperature(1.35, 'celsius') === '1,4 °C'`, sem erro de ponto flutuante [RF-06].
  - [ ] `formatTemperature(-0.04, 'celsius') === '0,0 °C'`, nunca `−0,0 °C` [RF-06].
  - [ ] `formatTemperature` recebe sempre o valor original em °C da API, sem conversões encadeadas; teste garante `formatTemperature(20, 'fahrenheit')` a partir de `20` [AC-07].
- **Dependências:** T-05
- **Arquivos prováveis:** `src/lib/temperature.ts`

### T-09 — Implementar utilitários de data e horário

- **Tipo:** Data
- **Descrição:** `localDateKey(timezone, now)`, `formatObservedAt` e `formatQueriedAt` com `Intl.DateTimeFormat('pt-BR')` e fuso IANA. `now` é sempre parâmetro.
- **Requisitos:** RF-03, RF-04, RNF-07, AC-03, AC-04
- **Critérios de aceite:**
  - [ ] `localDateKey('America/Sao_Paulo', new Date('2026-11-12T02:30:00Z')) === '2026-11-11'` [AC-04].
  - [ ] O resultado não muda com `TZ=Asia/Tokyo` nem `TZ=UTC` (teste executado com as três variáveis) [RNF-07].
  - [ ] `formatObservedAt('2026-11-11T18:45') === '11/11/2026, 18:45'`; `observedAt` já vem no fuso da cidade, então a função não recebe fuso nem converte [AC-03].
  - [ ] `formatQueriedAt` inclui o identificador do fuso da cidade na saída (ex.: `America/Sao_Paulo`) [RNF-07].
- **Dependências:** T-05
- **Arquivos prováveis:** `src/lib/dateTime.ts`

### T-10 — Implementar `rankCities`

- **Tipo:** Data
- **Descrição:** Ordena candidatos por categoria (igualdade, prefixo, parcial, demais), depois cidade, estado (ausente por último), país e `id`. Normaliza com NFD, remove `\p{M}` e aplica `toLowerCase()`. Retorna até `MAX_CITY_RESULTS` (5) itens.
- **Requisitos:** RF-02, US-02, AC-02, RNF-07
- **Critérios de aceite:**
  - [ ] `MAX_CITY_RESULTS === 5` e a função retorna no máximo 5 itens com 8 candidatos de entrada [AC-02].
  - [ ] Termo `"sao"` ordena `"São Paulo"` (prefixo normalizado) antes de `"Pousada São"` (parcial) [AC-02].
  - [ ] Homônimos `Springfield` com estados `Illinois`, ausente e `Missouri` saem na ordem `Illinois`, `Missouri`, ausente [AC-02].
  - [ ] Empate total de cidade, estado e país é desempatado pelo `id` em ordem crescente [AC-02].
  - [ ] O array de entrada é idêntico antes e depois da chamada (`toEqual` com cópia feita antes) [RF-02].
- **Dependências:** T-05
- **Arquivos prováveis:** `src/lib/cityRanking.ts`

### T-11 — Implementar o reducer puro

- **Tipo:** Data
- **Descrição:** `weatherReducer` com as ações `OPERATION_STARTED`, `SEARCH_SUCCEEDED`, `WEATHER_SUCCEEDED`, `OPERATION_FAILED` e `UNIT_CHANGED`. Respostas com `opId` antigo devolvem o mesmo `state`.
- **Requisitos:** RF-05, RF-08, US-05, US-08, AC-05, AC-10
- **Critérios de aceite:**
  - [ ] Resposta com `opId !== activeOpId` retorna a mesma referência de `state` (`toBe`) [AC-10].
  - [ ] `OPERATION_STARTED` de clima mantém `cities` e zera `weather` [AC-10].
  - [ ] `UNIT_CHANGED` altera apenas `unit`; `view` mantém a mesma referência [AC-05].
  - [ ] Estado inicial tem `view` igual a `{ status: 'idle' }`, `unit` igual a `'celsius'` e `selectedCity` igual a `null` [RF-05].
  - [ ] `grep -nE "Date\.now|fetch\(" src/lib/weatherReducer.ts` não retorna resultados [RNF-04].
- **Dependências:** T-05
- **Arquivos prováveis:** `src/lib/weatherReducer.ts`

---

## Entrega 3 — Services (`services/`)

### T-12 — Implementar `fetchJson` com erro tipado

- **Tipo:** Data
- **Descrição:** Wrapper de `fetch` que recebe `fetch` e `signal` por parâmetro e converte falhas em `network`, `http` ou `timeout`, sem expor o corpo da resposta.
- **Requisitos:** RF-08, RNF-04, RNF-09, RNF-10, Edge cases (falha de rede, HTTP não-2xx, timeout)
- **Critérios de aceite:**
  - [ ] `fetch` que rejeita com `TypeError` resulta em erro com `kind === 'network'` [RF-08].
  - [ ] Resposta com `status` 500 resulta em `kind === 'http'`, e o teste confirma que `response.text()` e `response.json()` não foram chamados [RNF-09].
  - [ ] `AbortError` com o sinal do prazo de 15 s resulta em `kind === 'timeout'` [RF-08].
  - [ ] `AbortError` causado por substituição da operação não produz `kind === 'timeout'` (teste dedicado) [RNF-04].
- **Dependências:** T-05
- **Arquivos prováveis:** `src/services/http.ts`

### T-13 — Implementar o service de geocoding

- **Tipo:** Data
- **Descrição:** `searchCities` monta a URL com `count=10`, `language=pt` e `format=json`. `parseGeocodingResponse` valida `unknown` e devolve `City[]`.
- **Requisitos:** RF-01, RF-02, RF-07, RNF-07, RNF-09, AC-09, Edge cases (geocoding sem resultados; item inválido)
- **Critérios de aceite:**
  - [ ] A URL começa com `https://geocoding-api.open-meteo.com/v1/search` e contém `count=10`, `language=pt` e `format=json` [RNF-09].
  - [ ] O termo é enviado com `encodeURIComponent`: `São Paulo` aparece como `S%C3%A3o%20Paulo` na URL [RF-01].
  - [ ] Resposta sem a chave `results` retorna `[]` [AC-09].
  - [ ] `results` que não é array, ou item sem `id`, `name` ou `country`, resulta em `invalid_response` e não em lista vazia [RF-08].
  - [ ] Latitude `91`, longitude `181` ou valor `NaN` resultam em `invalid_response` [RNF-09].
  - [ ] Item sem `admin1` é aceito e `city.state` é `undefined` [RF-02].
- **Dependências:** T-05, T-12
- **Arquivos prováveis:** `src/services/openMeteoGeocoding.ts`

### T-14 — Implementar o service de forecast

- **Tipo:** Data
- **Descrição:** `fetchWeatherData` chama a Open-Meteo com `timezone=auto` e `temperature_unit=celsius`. `parseForecastResponse` valida tudo ou nada e confere a janela vigente com `now` injetado.
- **Requisitos:** RF-03, RF-04, RF-06, RF-08, RNF-09, AC-03, AC-04, Edge cases (resposta parcial ou inválida; mudança de dia)
- **Critérios de aceite:**
  - [ ] A URL começa com `https://api.open-meteo.com/v1/forecast` e contém `current=temperature_2m,weather_code`, `daily=weather_code,temperature_2m_max,temperature_2m_min`, `forecast_days=5`, `timezone=auto` e `temperature_unit=celsius` [RF-06].
  - [ ] Campo obrigatório ausente, valor não finito, `min > max` ou `weather_code` fora da tabela resulta em `invalid_response` (uma fixture de T-29 por caso) [RF-08].
  - [ ] `daily` com 4 ou 6 dias resulta em `invalid_response` [RF-04].
  - [ ] `timezone` inválido resulta em `invalid_response` [RF-08].
  - [ ] Com `forecast-valid.json` e `now` igual a `2026-11-11T19:00:00-03:00`, o resultado é sucesso com 5 dias de `2026-11-11` a `2026-11-15` [AC-04].
  - [ ] Com `forecast-out-of-window.json` (primeiro dia é `2026-11-10`), o resultado é `out_of_window` [AC-04].
  - [ ] `queriedAt` é preenchido pelo cliente com o `now` injetado [RF-04].
  - [ ] Campos de vento, pressão e umidade não são lidos (`grep -nE "wind|pressure|humidity" src/services/openMeteoForecast.ts` sem resultados) [RF-06].
- **Dependências:** T-07, T-09, T-12
- **Arquivos prováveis:** `src/services/openMeteoForecast.ts`

---

## Entrega 4 — Hook

### T-15 — Implementar o hook `useWeatherApp`

- **Tipo:** Data
- **Descrição:** Orquestra o reducer, os services, `rankCities` e o prazo de 15 s. Uma `AbortController` ativa por vez. Nova operação aborta a anterior e cancela o timer. `WeatherAppDeps` é injetável para testes.
- **Requisitos:** RF-08, RNF-02, RNF-04, US-08, AC-10
- **Critérios de aceite:**
  - [ ] Em produção, `timeoutMs` vale `15000` (`grep -rn "15_000\|15000" src/hooks` retorna a constante usada) [RNF-02].
  - [ ] Ao expirar `timeoutMs` sem resposta, o estado vira `error` com `kind === 'timeout'` [RF-08].
  - [ ] Resposta aceita antes do prazo cancela o timer (`vi.getTimerCount() === 0` após sucesso) [RNF-04].
  - [ ] `retry()` reenvia a mesma `Operation` (mesmos parâmetros) com novo `id` e novo prazo [AC-10].
  - [ ] Nova operação chama `abort()` na `AbortController` da anterior [AC-10].
  - [ ] `search` chama `rankCities(cities, term, MAX_CITY_RESULTS)` com `MAX_CITY_RESULTS === 5` [AC-02].
- **Dependências:** T-10, T-11, T-13, T-14
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`

### T-16 — Implementar `useLocalDayChanged`

- **Tipo:** Data
- **Descrição:** Hook que, a cada 60 s, compara `localDateKey(data.timezone, agora)` com `data.days[0].date` e devolve um boolean. Não faz request.
- **Requisitos:** RF-04, US-04, AC-04, RNF-04
- **Critérios de aceite:**
  - [ ] Com fake timers, quando o dia local da cidade muda, o hook retorna `true` após `60000` ms [AC-04].
  - [ ] Nenhuma chamada a `fetch` ocorre em `60000` ms de fake timers [AC-04].
  - [ ] Após `unmount`, `vi.getTimerCount() === 0` [RNF-04].
- **Dependências:** T-09
- **Arquivos prováveis:** `src/hooks/useLocalDayChanged.ts`

---

## Entrega 5 — Componentes

### T-17 — Criar a base visual (tema, foco e bootstrap)

- **Tipo:** UI
- **Descrição:** Tema dark glassmorphism com Tailwind, estilo global de foco visível e bootstrap do React em `main.tsx`.
- **Requisitos:** RNF-01, RNF-03
- **Critérios de aceite:**
  - [ ] Texto principal sobre o fundo tem razão de contraste ≥ 4,5:1, calculada pela fórmula WCAG para os tokens Tailwind usados; os valores são registrados no PR [RNF-03].
  - [ ] `src/styles/index.css` contém a regra `:focus-visible` com `outline` de pelo menos `2px` [RNF-03].
  - [ ] Em Playwright, `Tab` a partir do início leva o foco a um elemento cujo `outline-style` computado é diferente de `none` [RNF-03].
  - [ ] `pnpm build` termina com código 0.
- **Dependências:** T-05
- **Arquivos prováveis:** `src/main.tsx`, `src/styles/index.css`

### T-18 — Implementar `AttributionFooter`

- **Tipo:** UI
- **Descrição:** Rodapé com a atribuição à Open-Meteo, sempre visível, sem props de dados.
- **Requisitos:** RNF-05, OQ-01
- **Critérios de aceite:**
  - [ ] O texto contém `Open-Meteo.com` e há um link para `https://open-meteo.com/` [RNF-05].
  - [ ] O componente não recebe props de dados e não chama `fetch` (`grep -n "fetch\|props" src/components/AttributionFooter.tsx` sem resultados) [RNF-06].
  - [ ] O texto exato de atribuição é conferido com os termos (OQ-01) e registrado em T-55 [OQ-01].
- **Dependências:** T-17
- **Arquivos prováveis:** `src/components/AttributionFooter.tsx`

### T-19 — Implementar `SearchForm`

- **Tipo:** UI
- **Descrição:** Campo e botão de busca. Envia com Enter ou botão. Termo inválido mostra a mensagem de correção sem chamar a API.
- **Requisitos:** RF-01, RF-07, US-01, US-07, AC-01, AC-08, Edge cases (campo vazio; entrada curta, numérica ou de coordenadas)
- **Critérios de aceite:**
  - [ ] Digitar `Sã` sem enviar não chama `onSearch` (spy com 0 chamadas) [AC-01].
  - [ ] Enter e clique no botão, com `"  São Paulo  "`, chamam `onSearch` exatamente uma vez com `"São Paulo"` [AC-01].
  - [ ] Com `"a"`, a mensagem `Digite pelo menos 2 caracteres.` aparece e `onSearch` não é chamado [AC-08].
  - [ ] Com `"-23.55, -46.63"`, a mensagem `Busque pelo nome da cidade; coordenadas não são suportadas.` aparece e `onSearch` não é chamado [AC-08].
  - [ ] Após erro de validação, o valor do campo continua igual ao digitado (`toHaveValue`) [RF-07].
  - [ ] O campo é localizado por `getByRole('textbox', { name })` com `label` associado [RNF-03].
- **Dependências:** T-06, T-18
- **Arquivos prováveis:** `src/components/SearchForm.tsx`

### T-20 — Implementar `CityResults`

- **Tipo:** UI
- **Descrição:** Lista de 1 a 5 cidades selecionáveis por clique ou Enter. As cidades continuam visíveis durante a consulta de clima.
- **Requisitos:** RF-02, US-02, AC-02, AC-03
- **Critérios de aceite:**
  - [ ] Com 7 cidades recebidas, a lista renderiza exatamente 5 itens [AC-02].
  - [ ] Cada item mostra cidade, estado (quando presente) e país; item sem estado não exibe separador vazio [RF-02].
  - [ ] Cada item é um `button` ou `li` com `tabIndex` e ativável por Enter [RNF-03].
  - [ ] Clicar no item da posição 2 chama `onSelect` com o `id` da segunda cidade [AC-02].
  - [ ] Com `disabled` ativo, os itens continuam renderizados (`getAllByRole` retorna os 5) [AC-03].
  - [ ] Não importa de `services/` nem chama `fetch` (`grep -n "services\|fetch" src/components/CityResults.tsx` sem resultados) [RNF-06].
- **Dependências:** T-05, T-18
- **Arquivos prováveis:** `src/components/CityResults.tsx`

### T-21 — Implementar `StatusMessage`

- **Tipo:** UI
- **Descrição:** Mensagens de carregamento, erro, vazio e timeout. Erro usa `role="alert"` e carregamento usa `aria-live="polite"`. Texto da API é renderizado como texto.
- **Requisitos:** RF-07, RF-08, RNF-03, RNF-09, AC-09, AC-10, Edge cases (cidade inexistente; timeout; erro de API)
- **Critérios de aceite:**
  - [ ] `kind === 'empty'` exibe exatamente `Nenhuma cidade encontrada` e não exibe botão de nova tentativa [AC-09].
  - [ ] Cada um dos cinco `FailureKind` exibe texto não vazio e distinto dos demais [RF-08].
  - [ ] Erros de `network`, `http`, `timeout`, `invalid_response` e `out_of_window` exibem o botão `Tentar novamente` [AC-10].
  - [ ] O erro é renderizado com `role="alert"` e o carregamento com `aria-live="polite"` [RNF-03].
  - [ ] `grep -n "dangerouslySetInnerHTML" src/components/StatusMessage.tsx` não retorna resultados; texto da API aparece como texto [RNF-09].
- **Dependências:** T-05, T-18
- **Arquivos prováveis:** `src/components/StatusMessage.tsx`

### T-22 — Implementar `CurrentWeatherCard`

- **Tipo:** UI
- **Descrição:** Mostra temperatura atual, condição em pt-BR e horário da observação com a legenda "Estimativa meteorológica".
- **Requisitos:** RF-03, RF-06, US-03, AC-03, AC-07, RNF-07
- **Critérios de aceite:**
  - [ ] Com `temperatureC = 20` e unidade Celsius, o card exibe `20,0 °C` [AC-03].
  - [ ] O card exibe o texto `Estimativa meteorológica` [AC-03].
  - [ ] Com `observedAt = '2026-11-11T18:45'` e fuso `America/Sao_Paulo`, o card exibe `11/11/2026, 18:45` [AC-03].
  - [ ] Com `weatherCode = 3`, o card exibe `Nublado` [AC-03].
  - [ ] Não há elementos de vento, pressão ou umidade no card (`queryByText(/vento|pressão|umidade/i)` é `null`) [RF-06].
- **Dependências:** T-05, T-07, T-08, T-09
- **Arquivos prováveis:** `src/components/CurrentWeatherCard.tsx`

### T-23 — Implementar `ForecastList`

- **Tipo:** UI
- **Descrição:** Lista de 5 dias (hoje + 4) com data, condição e mínima/máxima. Datas são formatadas com `timeZone: 'UTC'`.
- **Requisitos:** RF-04, US-04, AC-04, RNF-07
- **Critérios de aceite:**
  - [ ] Renderiza exatamente 5 itens em `ol`/`li` [AC-04].
  - [ ] Com `daily.time` de `2026-11-11` a `2026-11-15`, as datas exibidas são 11/11, 12/11, 13/11, 14/11 e 15/11, sem deslocamento de dia [AC-04].
  - [ ] Cada item mostra a condição em texto e mínima/máxima formatadas por `formatTemperature` (ex.: `1,3 °C`) [AC-07].
  - [ ] O cabeçalho mostra `Consulta realizada em` seguido da hora de `queriedAt` e do fuso da cidade [RF-04].
- **Dependências:** T-05, T-07, T-08, T-09
- **Arquivos prováveis:** `src/components/ForecastList.tsx`

### T-24 — Implementar `UnitToggle`

- **Tipo:** UI
- **Descrição:** Alternância Celsius/Fahrenheit que despacha `UNIT_CHANGED`. Não gera request.
- **Requisitos:** RF-05, RF-06, US-05, AC-05, AC-07
- **Critérios de aceite:**
  - [ ] Dois botões com nomes acessíveis `°C Celsius` e `°F Fahrenheit` (o nome começa com o texto visível, WCAG 2.5.3); o ativo tem `aria-pressed="true"` [RNF-03].
  - [ ] Clicar em `Fahrenheit` despacha `UNIT_CHANGED` com `unit: 'fahrenheit'` (spy) [AC-05].
  - [ ] Após a troca, nenhum `fetch` é chamado (contador igual a zero) [AC-05].
  - [ ] Com a unidade em Fahrenheit, `20 °C` é exibido como `68,0 °F` [AC-07].
- **Dependências:** T-08, T-11, T-18
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`

### T-25 — Implementar `DayChangedNotice` e ligá-lo à virada do dia

- **Tipo:** UI
- **Descrição:** Aviso que orienta nova seleção quando `useLocalDayChanged` retorna `true`. Os dados antigos continuam com as datas originais.
- **Requisitos:** RF-04, US-04, AC-04
- **Critérios de aceite:**
  - [ ] Com `dayChanged = true`, o aviso contém a palavra `novamente` e a instrução de selecionar a cidade de novo [AC-04].
  - [ ] Com `dayChanged = false`, o aviso não é renderizado [AC-04].
  - [ ] As datas de `ForecastList` não mudam quando o aviso aparece (mesmos textos antes e depois) [AC-04].
  - [ ] Nenhum `fetch` é disparado pelo componente ou pelo hook [AC-04].
- **Dependências:** T-16, T-18
- **Arquivos prováveis:** `src/components/DayChangedNotice.tsx`

---

## Entrega 6 — Integração em `App`

### T-26 — Integrar a busca em `App`

- **Tipo:** UI
- **Descrição:** `App` compõe `SearchForm`, `CityResults` e `StatusMessage` com `useWeatherApp`. Não há lógica de rede em `App`.
- **Requisitos:** RF-01, RF-02, RF-05, RF-07, US-01, US-02, AC-06, AC-09
- **Critérios de aceite:**
  - [ ] Na carga inicial, `Celsius` tem `aria-pressed="true"` e nenhuma cidade está selecionada [RF-05].
  - [ ] Na carga inicial há orientação visível para buscar uma cidade [AC-06].
  - [ ] Busca válida com resultados renderiza `CityResults` com até 5 itens [AC-02].
  - [ ] Busca válida com resposta vazia renderiza `Nenhuma cidade encontrada` [AC-09].
  - [ ] `grep -n "from '\.\./\?services\|from '\./services" src/App.tsx` não retorna resultados [RNF-06].
- **Dependências:** T-15, T-19, T-20, T-21
- **Arquivos prováveis:** `src/App.tsx`

### T-27 — Integrar seleção e clima em `App`

- **Tipo:** UI
- **Descrição:** Seleção de cidade chama `selectCity`. Estados de sucesso com clima renderizam `CurrentWeatherCard`, `ForecastList`, `UnitToggle` e `DayChangedNotice`.
- **Requisitos:** RF-03, RF-04, RF-05, US-03, US-04, US-05, AC-01, AC-03, AC-05
- **Critérios de aceite:**
  - [ ] Clicar numa cidade com clima válido renderiza `CurrentWeatherCard` e `ForecastList` com 5 itens [AC-03].
  - [ ] Durante a consulta de clima, `CityResults` continua com os mesmos itens visíveis [AC-03].
  - [ ] Trocar a unidade altera os valores exibidos e não dispara nova requisição (contador de `fetch` igual) [AC-05].
  - [ ] Selecionar outra cidade após trocar para Fahrenheit mantém `Fahrenheit` com `aria-pressed="true"` [AC-05].
- **Dependências:** T-22, T-23, T-24, T-25, T-26
- **Arquivos prováveis:** `src/App.tsx`

### T-28 — Implementar "Tentar novamente" e troca de cidade após erro

- **Tipo:** UI
- **Descrição:** Erro mantém as cidades da busca. "Tentar novamente" reenvia a mesma operação, e o usuário pode escolher outra cidade sem nova busca.
- **Requisitos:** RF-08, US-08, AC-10, Edge cases (nova busca ou seleção antes da resposta anterior)
- **Critérios de aceite:**
  - [ ] Após erro de clima, `CityResults` continua com os mesmos itens visíveis (contagem igual à anterior) [AC-10].
  - [ ] Clicar em `Tentar novamente` envia requisição com a mesma URL da tentativa que falhou [AC-10].
  - [ ] Selecionar outra cidade após erro envia nova requisição de clima com as coordenadas da nova cidade [AC-10].
  - [ ] Ao substituir uma operação pendente, a resposta antiga não altera a tela (teste `AC-10:`) [AC-10].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/StatusMessage.tsx`, `src/App.tsx`

---

## Entrega 7 — Testes

### T-29 — Criar fixtures da Open-Meteo

- **Tipo:** Test
- **Descrição:** Respostas controladas para testes unitários e E2E, sem chamadas reais.
- **Requisitos:** AC-03, AC-04, AC-09, RNF-09, Edge cases (resposta parcial ou inválida)
- **Critérios de aceite:**
  - [ ] Existem os arquivos `geocoding-berlin.json` (3 itens válidos), `geocoding-empty.json` (sem chave `results`), `geocoding-missing-country.json` (item sem `country`), `forecast-valid.json`, `forecast-4-days.json`, `forecast-6-days.json`, `forecast-min-greater-than-max.json`, `forecast-unknown-wmo.json`, `forecast-invalid-timezone.json` e `forecast-out-of-window.json` em `tests/fixtures/openMeteo/`.
  - [ ] `forecast-valid.json` tem `current.temperature_2m` igual a `20`, `current.time` igual a `2026-11-11T18:45` e `daily.time` de `2026-11-11` a `2026-11-15` [AC-03, AC-04].
  - [ ] Todos os arquivos passam em `JSON.parse` sem erro (verificado por teste em T-33).
  - [ ] Nenhum arquivo contém dado pessoal real; todos os nomes de cidade são públicos e fictícios ou de exemplo.
- **Dependências:** T-03
- **Arquivos prováveis:** `tests/fixtures/openMeteo/*.json`

### T-30 — Testar `validateSearchTerm`

- **Tipo:** Test
- **Descrição:** Testes unitários de todos os motivos de rejeição e de aceitação.
- **Requisitos:** AC-01, AC-08
- **Critérios de aceite:**
  - [ ] Há um teste por motivo de rejeição com título iniciado por `AC-08:` (`too_short`, `numeric_only`, `coordinates`).
  - [ ] Há testes com título iniciado por `AC-01:` para `"  São Paulo  "`, `"D'Oeste"` e `"ab"`.
  - [ ] `pnpm test -- searchTerm` termina com código 0 e nenhum teste pulado.
- **Dependências:** T-03, T-06
- **Arquivos prováveis:** `tests/unit/lib/searchTerm.test.ts`

### T-31 — Testar temperatura e arredondamento

- **Tipo:** Test
- **Descrição:** Testes unitários de conversão e formatação.
- **Requisitos:** AC-03, AC-07
- **Critérios de aceite:**
  - [ ] Há testes com título iniciado por `AC-07:` para os pares `20 → 68,0 °F`, `1,25 → 1,3 °C`, `−1,25 → −1,3 °C` e `1,35 → 1,4 °C`.
  - [ ] Há teste `AC-07:` que alterna Celsius → Fahrenheit → Celsius e verifica que o valor final exibido é `20,0 °C`.
  - [ ] `pnpm test -- temperature` termina com código 0.
- **Dependências:** T-03, T-08
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`

### T-32 — Testar `rankCities` e a tabela WMO

- **Tipo:** Test
- **Descrição:** Testes parametrizados de ordenação e de cobertura da tabela WMO.
- **Requisitos:** AC-02, RNF-07, RF-08
- **Critérios de aceite:**
  - [ ] Há testes com título iniciado por `AC-02:` para igualdade, prefixo, acento, caixa, homônimos e estado ausente.
  - [ ] Há teste que confirma `isKnownWeatherCode(999) === false` e as quatro descrições de T-07.
  - [ ] `pnpm test -- cityRanking weatherCodes` termina com código 0.
- **Dependências:** T-03, T-07, T-10
- **Arquivos prováveis:** `tests/unit/lib/cityRanking.test.ts`, `tests/unit/lib/weatherCodes.test.ts`

### T-33 — Testar os services com fixtures

- **Tipo:** Test
- **Descrição:** Testes unitários com `fetch` substituído e as fixtures de T-29.
- **Requisitos:** AC-03, AC-04, AC-09, RNF-09
- **Critérios de aceite:**
  - [ ] Há testes com título iniciado por `AC-03:` (fixture válida retorna `20,0 °C` e horário `2026-11-11T18:45`).
  - [ ] Há testes com título iniciado por `AC-04:` (janela de 11 a 15/11/2026 e `out_of_window`).
  - [ ] Há teste com título iniciado por `AC-09:` (`geocoding-empty.json` retorna lista vazia).
  - [ ] Cada fixture inválida de T-29 tem um teste que espera o `kind` exato.
  - [ ] Todas as fixtures passam em `JSON.parse` [RNF-09].
  - [ ] `pnpm test -- services` termina com código 0, com `fetch` substituído (`vi.stubGlobal`) em todos os testes.
- **Dependências:** T-13, T-14, T-29
- **Arquivos prováveis:** `tests/unit/services/openMeteoGeocoding.test.ts`, `tests/unit/services/openMeteoForecast.test.ts`

### T-34 — Testar o reducer

- **Tipo:** Test
- **Descrição:** Testes de transições, incluindo resposta de `opId` antigo.
- **Requisitos:** AC-05, AC-10, RF-05
- **Critérios de aceite:**
  - [ ] Há teste com título iniciado por `AC-10:` que envia `WEATHER_SUCCEEDED` com `opId` antigo e espera `toBe(state)`.
  - [ ] Há teste com título iniciado por `AC-05:` que confirma que `UNIT_CHANGED` não altera `view`.
  - [ ] Os cinco tipos de ação têm pelo menos um teste.
  - [ ] `pnpm test -- weatherReducer` termina com código 0.
- **Dependências:** T-03, T-11
- **Arquivos prováveis:** `tests/unit/lib/weatherReducer.test.ts`

### T-35 — Testar o hook com fake timers

- **Tipo:** Test
- **Descrição:** Testes com fake timers e `advanceTimersByTimeAsync`.
- **Requisitos:** RF-08, RNF-02, AC-10
- **Critérios de aceite:**
  - [ ] Com `timeoutMs = 15000`, em `14999` ms o estado ainda é `loading`, e em `15000` ms é `error` com `timeout` (título `AC-10:`).
  - [ ] Sucesso em `14000` ms cancela o timer: avançar mais `15000` ms não altera o estado [RNF-02].
  - [ ] `retry` em `10000` ms reinicia o prazo: `timeout` ocorre em `25000` ms, não em `15000` ms [AC-10].
  - [ ] Resposta substituída que chega depois do sucesso mais recente não altera `view` (`toBe` na referência) [AC-10].
  - [ ] `pnpm test -- useWeatherApp` termina com código 0.
- **Dependências:** T-03, T-15
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.ts`

### T-36 — Testar `SearchForm` e `CityResults`

- **Tipo:** Test
- **Descrição:** Testes de componentes com Testing Library. Cobrem envio por Enter e botão, clique e Enter nos resultados, e mensagens de correção sem chamada à API.
- **Requisitos:** AC-01, AC-02, AC-08
- **Critérios de aceite:**
  - [ ] Há testes `AC-01:` para envio por Enter e por clique com `"  São Paulo  "`.
  - [ ] Há testes `AC-08:` para `"a"` e `"-23.55, -46.63"` com `onSearch` chamado 0 vezes.
  - [ ] Há teste `AC-02:` que seleciona a segunda cidade por Enter e confirma o `id` recebido.
  - [ ] `pnpm test -- SearchForm CityResults` termina com código 0.
- **Dependências:** T-03, T-19, T-20
- **Arquivos prováveis:** `tests/components/SearchForm.test.tsx`, `tests/components/CityResults.test.tsx`

### T-37 — Testar `StatusMessage`

- **Tipo:** Test
- **Descrição:** Testes de estados de carregamento, erro, vazio e timeout.
- **Requisitos:** RF-08, RNF-03, AC-09, AC-10
- **Critérios de aceite:**
  - [ ] Teste `AC-09:` confirma o texto `Nenhuma cidade encontrada` e a ausência de `Tentar novamente`.
  - [ ] Teste `AC-10:` confirma `role="alert"` para erro de `timeout` e o botão `Tentar novamente`.
  - [ ] Clicar em `Tentar novamente` chama `onRetry` exatamente uma vez.
  - [ ] Loading tem `aria-live="polite"`.
  - [ ] `pnpm test -- StatusMessage` termina com código 0.
- **Dependências:** T-03, T-21
- **Arquivos prováveis:** `tests/components/StatusMessage.test.tsx`

### T-38 — Testar `CurrentWeatherCard` e `ForecastList`

- **Tipo:** Test
- **Descrição:** Testes de renderização do clima atual e da previsão de 5 dias.
- **Requisitos:** AC-03, AC-04, AC-07
- **Critérios de aceite:**
  - [ ] Teste `AC-03:` confirma `20,0 °C`, `Estimativa meteorológica` e `11/11/2026, 18:45`.
  - [ ] Teste `AC-04:` confirma 5 itens com datas 11/11 a 15/11.
  - [ ] Teste `AC-07:` confirma `1,3 °C` para mínima de `1,25` e `−1,3 °C` para `−1,25`.
  - [ ] `pnpm test -- CurrentWeatherCard ForecastList` termina com código 0.
- **Dependências:** T-03, T-22, T-23
- **Arquivos prováveis:** `tests/components/CurrentWeatherCard.test.tsx`, `tests/components/ForecastList.test.tsx`

### T-39 — Testar `UnitToggle` e `DayChangedNotice`

- **Tipo:** Test
- **Descrição:** Testes do controle de unidade e do aviso de virada do dia.
- **Requisitos:** AC-04, AC-05, AC-07
- **Critérios de aceite:**
  - [ ] Teste `AC-05:` confirma que trocar a unidade não chama `fetch`.
  - [ ] Teste `AC-05:` confirma `aria-pressed="true"` no botão ativo após a troca.
  - [ ] Teste `AC-04:` confirma que `DayChangedNotice` aparece com `dayChanged = true` e não aparece com `false`.
  - [ ] `pnpm test -- UnitToggle DayChangedNotice` termina com código 0.
- **Dependências:** T-03, T-24, T-25
- **Arquivos prováveis:** `tests/components/UnitToggle.test.tsx`, `tests/components/DayChangedNotice.test.tsx`

### T-40 — Testar o fluxo de integração de `App`

- **Tipo:** Test
- **Descrição:** `App` com `fetch` substituído, cobrindo busca, seleção e troca de unidade.
- **Requisitos:** AC-03, AC-05, AC-06
- **Critérios de aceite:**
  - [ ] Teste `AC-06:` confirma que a tela inicial mostra Celsius ativo e nenhuma cidade selecionada.
  - [ ] Teste `AC-03:` busca `Berlin` com `geocoding-berlin.json`, seleciona a primeira cidade e confirma `20,0 °C` com `Estimativa meteorológica`.
  - [ ] Teste `AC-05:` troca para Fahrenheit, confirma `68,0 °F` e confirma que o contador de `fetch` não mudou.
  - [ ] Teste `AC-05:` confirma que o contador de `fetch` é 2 ao final (busca e clima) e não aumenta com a troca de unidade.
  - [ ] `pnpm test -- App.test` termina com código 0.
- **Dependências:** T-27, T-29
- **Arquivos prováveis:** `tests/integration/App.test.tsx`

### T-41 — Testar o fluxo busca → seleção → clima no E2E

- **Tipo:** Test
- **Descrição:** F1 (busca → seleção → clima), F2 (termo inválido) e F3 (cidade sem resultados), com `page.route` e fixtures.
- **Requisitos:** AC-01, AC-02, AC-03, AC-08, AC-09, RNF-08
- **Critérios de aceite:**
  - [ ] F1 com título `AC-03:` confirma `20,0 °C` e `Estimativa meteorológica` antes de 15 s, nos projetos `chromium`, `firefox` e `Pixel 7` [AC-03].
  - [ ] F1 confirma que os 5 primeiros itens seguem a ordem de `rankCities` (mesmos ids da fixture) [AC-02].
  - [ ] F1 confirma que selecionar o 2º item envia `latitude` e `longitude` da segunda cidade na URL da requisição de clima [AC-02].
  - [ ] F2 com `-23.55, -46.63` e com `a` confirma zero requisições a `geocoding-api.open-meteo.com` [AC-08].
  - [ ] F3 confirma o texto `Nenhuma cidade encontrada`, ausência de requisição de clima e campo com foco e termo preservados [AC-09].
- **Dependências:** T-04, T-27, T-29
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`

### T-42 — Testar timeout, virada do dia, unidade e recarga no E2E

- **Tipo:** Test
- **Descrição:** F4 (timeout), F5 (virada do dia) e F6 (unidade e recarga). Usa `page.clock` para o prazo e a meia-noite.
- **Requisitos:** AC-04, AC-05, AC-06, AC-10, RNF-02
- **Critérios de aceite:**
  - [ ] F4 com título `AC-10:` mantém a resposta de clima sem retorno por mais de 15 s e confirma mensagem de timeout com `Tentar novamente` visível em até 15 s, medido até o DOM [RNF-02].
  - [ ] F4 confirma que `Tentar novamente` reenvia exatamente a mesma URL da requisição anterior [AC-10].
  - [ ] F5 avança o relógio local da cidade para 00:00 e confirma o aviso `novamente` visível sem nova requisição (contador igual) [AC-04].
  - [ ] F6 troca para Fahrenheit e confirma zero requisições novas; depois recarrega a página e confirma Celsius ativo, nenhuma cidade selecionada e zero requisições [AC-05, AC-06].
- **Dependências:** T-04, T-25, T-27, T-28
- **Arquivos prováveis:** `tests/e2e/timeout-and-day.spec.ts`

---

## Entrega 8 — Hardening, acessibilidade e fechamento

### T-43 — Implementar logs locais sem dados sensíveis

- **Tipo:** Data
- **Descrição:** Log no `console` com operação, resultado, duração em ms e status HTTP. Nunca registra termo, nome de cidade, coordenadas ou corpo da resposta.
- **Requisitos:** RNF-06, RNF-10
- **Critérios de aceite:**
  - [ ] Cada chamada de `console.info` recebe um objeto cujas chaves estão contidas em `{ op, result, durationMs, httpStatus }` [RNF-10].
  - [ ] Nenhuma chamada de log contém o termo buscado, o nome da cidade ou as coordenadas (teste com termo `Berlin` e coordenadas `52.52`) [RNF-10].
  - [ ] `grep -rn "localStorage\|sessionStorage" src` não retorna resultados [RNF-06].
  - [ ] Não há `fetch` para endpoint de log (`grep -rn "analytics\|logging" src` não retorna resultados) [RNF-10].
- **Dependências:** T-12, T-15
- **Arquivos prováveis:** `src/services/http.ts`, `src/hooks/useWeatherApp.ts`

### T-44 — Revisar acessibilidade de `SearchForm` e `CityResults`

- **Tipo:** UI
- **Descrição:** Roles, labels, ordem de foco e alvos de toque ≥ 44 px nos controles de busca e de seleção de cidade.
- **Requisitos:** RNF-03, RNF-01, AC-01, AC-02
- **Critérios de aceite:**
  - [ ] Em Playwright, `Tab` percorre o campo, o botão de busca e os itens de resultado nessa ordem, sem armadilha de foco [RNF-03].
  - [ ] Busca e seleção são concluídas só com teclado (teste `AC-01:` e `AC-02:` sem clique) [RNF-03].
  - [ ] `boundingBox` de botão e de item de resultado tem largura e altura ≥ 44 px [RNF-01].
  - [ ] `getByRole('textbox', { name })` encontra o campo de busca [RNF-03].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/SearchForm.tsx`, `src/components/CityResults.tsx`

### T-45 — Revisar acessibilidade de `StatusMessage` e `App`

- **Tipo:** UI
- **Descrição:** Semântica de alertas e status nas mensagens de erro e de carregamento.
- **Requisitos:** RNF-03, AC-09, AC-10
- **Critérios de aceite:**
  - [ ] Erro é anunciado com `role="alert"` (`getByRole('alert')` encontra a mensagem) [AC-10].
  - [ ] Carregamento é anunciado com `aria-live="polite"` [RNF-03].
  - [ ] Nenhum elemento de `StatusMessage` usa `role="alert"` para estados de carregamento ou vazio (verificado por `queryByRole('alert')` nesses estados) [RNF-03].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/StatusMessage.tsx`, `src/App.tsx`

### T-46 — Revisar acessibilidade de `CurrentWeatherCard` e `ForecastList`

- **Tipo:** UI
- **Descrição:** Estrutura semântica do clima atual e da lista de 5 dias.
- **Requisitos:** RNF-03, AC-03, AC-04
- **Critérios de aceite:**
  - [ ] `getByRole('list')` encontra a previsão, com 5 `listitem` [AC-04].
  - [ ] `CurrentWeatherCard` tem um heading de nível 2 com o texto `Clima atual` [RNF-03].
  - [ ] A condição está em texto, e `getByText('Nublado')` a encontra sem depender de ícone [RNF-03].
  - [ ] `axe` (T-53) não reporta violação nesses dois componentes [RNF-03].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/CurrentWeatherCard.tsx`, `src/components/ForecastList.tsx`

### T-47 — Revisar acessibilidade de `UnitToggle` e `DayChangedNotice`

- **Tipo:** UI
- **Descrição:** Estado acessível do controle de unidade e anúncio do aviso de virada do dia.
- **Requisitos:** RNF-03, AC-04, AC-05
- **Critérios de aceite:**
  - [ ] `UnitToggle` expõe o estado ativo por `aria-pressed` (`toHaveAttribute('aria-pressed', 'true')`) [RNF-03].
  - [ ] `DayChangedNotice` tem `role="status"`, e não `role="alert"`, para não interromper a leitura [RNF-03].
  - [ ] Ao aparecer, o aviso não muda `document.activeElement` [RNF-03].
  - [ ] Teclado alterna a unidade com Enter e Espaço [RNF-03].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`, `src/components/DayChangedNotice.tsx`

### T-48 — Ajustar layout responsivo de `App` e `DayChangedNotice`

- **Tipo:** UI
- **Descrição:** Garantir que a página e o aviso de virada não tenham rolagem horizontal em 320, 375, 768 e 1920 px.
- **Requisitos:** RNF-01, Edge cases (nomes longos)
- **Critérios de aceite:**
  - [ ] Em 320, 375, 768 e 1920 px, `document.documentElement.scrollWidth <= window.innerWidth` [RNF-01].
  - [ ] Com um nome de cidade de 60 caracteres, o nome quebra linha e continua visível (`toBeVisible`) [RNF-01].
  - [ ] Em 320 px, o aviso de virada ocupa no máximo a largura da tela menos 2 × 16 px de margem (verificado por `boundingBox`) [RNF-01].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/App.tsx`, `src/components/DayChangedNotice.tsx`

### T-49 — Ajustar layout responsivo de `SearchForm` e `CityResults`

- **Tipo:** UI
- **Descrição:** Campo, botão e lista de cidades legíveis e sem overflow em 320 a 1920 px.
- **Requisitos:** RNF-01
- **Critérios de aceite:**
  - [ ] Em 320, 375, 768 e 1920 px, `scrollWidth <= innerWidth` [RNF-01].
  - [ ] Botão de busca e itens de resultado têm `boundingBox` ≥ 44 × 44 px [RNF-01].
  - [ ] Em 320 px, campo e botão ficam um abaixo do outro (`boundingBox.y` do botão maior que o do campo) [RNF-01].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/SearchForm.tsx`, `src/components/CityResults.tsx`

### T-50 — Ajustar layout responsivo de `CurrentWeatherCard` e `ForecastList`

- **Tipo:** UI
- **Descrição:** Cards e lista de 5 dias sem overflow em 320 a 1920 px.
- **Requisitos:** RNF-01, AC-04
- **Critérios de aceite:**
  - [ ] Em 320, 375, 768 e 1920 px, `scrollWidth <= innerWidth` [RNF-01].
  - [ ] Em 320 px, os 5 dias de `ForecastList` estão visíveis e sem sobreposição (`toBeVisible` e `boundingBox` de itens não se cruzam) [AC-04, RNF-01].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/CurrentWeatherCard.tsx`, `src/components/ForecastList.tsx`

### T-51 — Ajustar layout responsivo de `UnitToggle` e `StatusMessage`

- **Tipo:** UI
- **Descrição:** Controle de unidade e mensagens de estado sem overflow em 320 a 1920 px.
- **Requisitos:** RNF-01
- **Critérios de aceite:**
  - [ ] Em 320, 375, 768 e 1920 px, `scrollWidth <= innerWidth` [RNF-01].
  - [ ] Os botões `Celsius` e `Fahrenheit` têm `boundingBox` de altura ≥ 44 px [RNF-01].
  - [ ] A mensagem de erro ocupa no máximo a largura da tela menos 2 × 16 px de margem [RNF-01].
- **Dependências:** T-27
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`, `src/components/StatusMessage.tsx`

### T-52 — Testar responsividade e Pixel 7 no E2E

- **Tipo:** Test
- **Descrição:** F7 (viewports 320, 375, 768 e 1920 px) e F8 (Pixel 7, repetindo F1 e F4).
- **Requisitos:** RNF-01, RNF-08
- **Critérios de aceite:**
  - [ ] F7 confirma `scrollWidth <= innerWidth` nos quatro viewports [RNF-01].
  - [ ] F7 confirma que botões e itens interativos têm `boundingBox` ≥ 44 × 44 px [RNF-01].
  - [ ] F8 executa F1 e F4 no projeto `Pixel 7` e ambos passam [RNF-08].
- **Dependências:** T-04, T-41, T-48, T-49, T-50, T-51
- **Arquivos prováveis:** `tests/e2e/responsive.spec.ts`, `tests/e2e/mobile.spec.ts`

### T-53 — Testar acessibilidade automatizada com axe

- **Tipo:** Test
- **Descrição:** Rodar `@axe-core/playwright` nas telas de sucesso, erro e vazio.
- **Requisitos:** RNF-03
- **Critérios de aceite:**
  - [ ] Para as telas de sucesso, erro e vazio, `AxeBuilder` com tags `wcag2a`, `wcag2aa` e `wcag21aa` retorna `violations.length === 0` [RNF-03].
  - [ ] O teste falha se qualquer violação for introduzida (verificado por teste temporário que insere `<img>` sem `alt` e espera falha) [RNF-03].
- **Dependências:** T-02, T-04, T-41, T-44, T-45, T-46, T-47
- **Arquivos prováveis:** `tests/e2e/a11y.spec.ts`

### T-54 — Preparar o checklist manual de acessibilidade

- **Tipo:** Test
- **Descrição:** Checklist manual de teclado, foco, leitor de tela e contraste, com resultado por item.
- **Requisitos:** RNF-03, RNF-08
- **Critérios de aceite:**
  - [ ] O checklist tem um item para cada item de RNF-03: nomes acessíveis, teclado, foco visível, sem armadilha, contraste ≥ 4,5:1, resultados, carregamento, erros e mudança de unidade anunciados.
  - [ ] Cada item registra `Passou` ou `Falhou`, com data, navegador e versão exata, SO e dispositivo (RNF-08).
  - [ ] As evidências de T-54, T-55 e T-56 ficam em `plans/evidencias.md`, uma seção por tarefa, e o plano (Testing Strategy) cita esse arquivo.
- **Dependências:** T-53
- **Arquivos prováveis:** `plans/evidencias.md`

### T-55 — Registrar a integração real e os termos de uso da Open-Meteo

- **Tipo:** Test
- **Descrição:** Confirmar os termos de uso da Open-Meteo (OQ-01) antes da primeira chamada real e registrar uma busca e uma consulta reais (OQ-02).
- **Requisitos:** RNF-02, RNF-05, RNF-08, OQ-01, OQ-02
- **Critérios de aceite:**
  - [ ] Os termos de uso consultados (URL e data) e o texto de atribuição exigido estão registrados [OQ-01, RNF-05].
  - [ ] A busca `Berlin` e a consulta de `52.52, 13.41` retornam HTTP 200 no navegador, com `invalid_response` ausente [OQ-02].
  - [ ] A latência de cada operação real é menor que 15000 ms e está registrada em milissegundos [RNF-02].
  - [ ] O registro contém navegador, versão exata, SO e dispositivo usados [RNF-08].
- **Dependências:** T-42
- **Arquivos prováveis:** `plans/evidencias.md`

### T-56 — Validar o pipeline completo e registrar evidências

- **Tipo:** Test
- **Descrição:** Executar os comandos de validação e registrar o resultado de cada um.
- **Requisitos:** Plano → Testing Strategy (comandos de validação), todos os AC
- **Critérios de aceite:**
  - [ ] `pnpm lint` termina com código 0 e o resultado é registrado.
  - [ ] `pnpm build` termina com código 0 e o resultado é registrado.
  - [ ] `pnpm test` termina com código 0 e o resultado é registrado.
  - [ ] `pnpm test:e2e` termina com código 0 nos projetos `chromium`, `firefox` e `Pixel 7` e o resultado é registrado [RNF-08].
  - [ ] Para cada `AC-01` a `AC-10`, existe pelo menos um teste passando com título iniciado por esse ID (verificado no relatório do Vitest e do Playwright) [AC-01 a AC-10].
- **Dependências:** T-30, T-31, T-32, T-33, T-34, T-35, T-36, T-37, T-38, T-39, T-40, T-41, T-42, T-52, T-53
- **Arquivos prováveis:** `plans/evidencias.md`

### T-57 — Verificar as regras de dependência entre camadas

- **Tipo:** Test
- **Descrição:** Revisar imports para garantir que `components/` não importa `services/`, `lib/` não importa React e `services/` não importa `hooks/` ou `components/`.
- **Requisitos:** Plano → Architecture e Project Structure (dependências só para baixo), RNF-06
- **Critérios de aceite:**
  - [ ] `grep -rn "from '.*services" src/components` retorna zero linhas [RNF-06].
  - [ ] `grep -rn "from 'react'" src/lib` retorna zero linhas.
  - [ ] `grep -rnE "from '.*(hooks|components)" src/services src/lib` retorna zero linhas.
  - [ ] Qualquer violação encontrada é corrigida antes do merge e a busca é repetida sem resultados.
- **Dependências:** T-56
- **Arquivos prováveis:** `src/**` (somente leitura para verificação)

---

## Rastreabilidade resumida

| Requisito | Tarefas |
|---|---|
| RF-01 | T-06, T-13, T-19, T-26, T-41 |
| RF-02 | T-10, T-13, T-20, T-26, T-41 |
| RF-03 | T-05, T-09, T-14, T-22, T-27, T-40 |
| RF-04 | T-05, T-09, T-14, T-16, T-23, T-25, T-42 |
| RF-05 | T-11, T-26, T-24, T-27, T-42 |
| RF-06 | T-01, T-08, T-14, T-22, T-24 |
| RF-07 | T-06, T-13, T-19, T-21, T-26, T-41 |
| RF-08 | T-05, T-12, T-14, T-11, T-15, T-35, T-21, T-37, T-28 |
| US-01 a US-08 | Cobertos pelas tarefas RF correspondentes |
| AC-01 | T-06, T-30, T-19, T-36, T-44, T-41, T-56 |
| AC-02 | T-10, T-32, T-15, T-20, T-36, T-44, T-41 |
| AC-03 | T-08, T-09, T-33, T-22, T-38, T-40, T-41 |
| AC-04 | T-29, T-14, T-33, T-16, T-23, T-25, T-38, T-50, T-42 |
| AC-05 | T-11, T-34, T-24, T-27, T-39, T-40, T-42 |
| AC-06 | T-26, T-40, T-42 |
| AC-07 | T-08, T-31, T-22, T-23, T-24, T-38, T-39 |
| AC-08 | T-06, T-30, T-19, T-36, T-41 |
| AC-09 | T-13, T-33, T-21, T-26, T-37, T-41 |
| AC-10 | T-11, T-34, T-15, T-35, T-21, T-37, T-28, T-45, T-42, T-52 |
| RNF-01 | T-17, T-48 a T-51, T-52 |
| RNF-02 | T-15, T-35, T-42, T-55 |
| RNF-03 | T-02, T-03, T-17, T-19, T-21, T-37, T-44 a T-47, T-53, T-54 |
| RNF-04 | T-12, T-15, T-16 |
| RNF-05 | T-18, T-55 |
| RNF-06 | T-18, T-43, T-57 |
| RNF-07 | T-07, T-09, T-13, T-22, T-23 |
| RNF-08 | T-04, T-52, T-54, T-55, T-56 |
| RNF-09 | T-05, T-12, T-13, T-14, T-33, T-21 |
| RNF-10 | T-12, T-43 |
| OQ-01 | T-18, T-55 |
| OQ-02 | T-55 |

## Reordenação por camada — mapeamento de IDs

Esta reordenação passou a seguir a ordem de implementação (tipos → funções puras → services → hook →
componentes → integração → testes → hardening). A tabela relaciona os IDs da versão anterior, com 57
tarefas, aos IDs atuais. Mudanças de conteúdo nesta etapa: a T-43 (logs, antiga T-41) ganhou a
dependência em T-12 (`fetchJson`, antiga T-15), porque altera `src/services/http.ts`.

| ID da versão anterior | ID atual |
|---|---|
| T-01 | T-01 |
| T-02 | T-02 |
| T-03 | T-03 |
| T-04 | T-04 |
| T-05 | T-05 |
| T-06 | T-29 |
| T-07 | T-06 |
| T-08 | T-30 |
| T-09 | T-07 |
| T-10 | T-08 |
| T-11 | T-31 |
| T-12 | T-09 |
| T-13 | T-10 |
| T-14 | T-32 |
| T-15 | T-12 |
| T-16 | T-13 |
| T-17 | T-14 |
| T-18 | T-33 |
| T-19 | T-11 |
| T-20 | T-34 |
| T-21 | T-15 |
| T-22 | T-35 |
| T-23 | T-16 |
| T-24 | T-17 |
| T-25 | T-18 |
| T-26 | T-19 |
| T-27 | T-20 |
| T-28 | T-21 |
| T-29 | T-26 |
| T-30 | T-22 |
| T-31 | T-23 |
| T-32 | T-24 |
| T-33 | T-25 |
| T-34 | T-27 |
| T-35 | T-36 |
| T-36 | T-37 |
| T-37 | T-38 |
| T-38 | T-39 |
| T-39 | T-40 |
| T-40 | T-28 |
| T-41 | T-43 |
| T-42 | T-44 |
| T-43 | T-45 |
| T-44 | T-46 |
| T-45 | T-47 |
| T-46 | T-48 |
| T-47 | T-49 |
| T-48 | T-50 |
| T-49 | T-51 |
| T-50 | T-41 |
| T-51 | T-42 |
| T-52 | T-52 |
| T-53 | T-53 |
| T-54 | T-54 |
| T-55 | T-55 |
| T-56 | T-56 |
| T-57 | T-57 |

## Revisão do backlog — mapeamento de IDs anterior (44 → 57)

Revisão anterior: as tarefas que misturavam mais de dois arquivos ou tipos (T-02, T-22, T-32, T-36, T-37 e T-42)
foram divididas. Os IDs foram renumerados em ordem de entrega e dependência. Os IDs da coluna da direita
referem-se à numeração de 57 tarefas anterior à reordenação por camada; use a tabela acima para os IDs atuais.

| ID anterior | ID da versão de 57 tarefas |
|---|---|
| T-01 | T-01 |
| T-02 | T-02, T-03, T-04 |
| T-03 | T-05 |
| T-04 | T-06 |
| T-05 | T-07 |
| T-06 | T-08 |
| T-07 | T-09 |
| T-08 | T-10 |
| T-09 | T-11 |
| T-10 | T-12 |
| T-11 | T-13 |
| T-12 | T-14 |
| T-13 | T-15 |
| T-14 | T-16 |
| T-15 | T-17 |
| T-16 | T-18 |
| T-17 | T-19 |
| T-18 | T-20 |
| T-19 | T-21 |
| T-20 | T-22 |
| T-21 | T-23 |
| T-22 | T-24, T-25 |
| T-23 | T-26 |
| T-24 | T-27 |
| T-25 | T-28 |
| T-26 | T-29 |
| T-27 | T-30 |
| T-28 | T-31 |
| T-29 | T-32 |
| T-30 | T-33 |
| T-31 | T-34 |
| T-32 | T-35, T-36, T-37, T-38 |
| T-33 | T-39 |
| T-34 | T-40 |
| T-35 | T-41 |
| T-36 | T-42, T-43, T-44, T-45 |
| T-37 | T-46, T-47, T-48, T-49 |
| T-38 | T-50 |
| T-39 | T-51 |
| T-40 | T-52 |
| T-41 | T-53 |
| T-42 | T-54, T-55 |
| T-43 | T-56 |
| T-44 | T-57 |
