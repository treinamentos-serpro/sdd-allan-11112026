---
mode: agent
description: 'T-01 — Fechar a decisão sobre o código existente divergente (substituir) e verificar a base limpa.'
---

# Prompt — Implementar T-01

Você é o **Code Agent** do projeto **Weather App** (Spec-Driven Development). Execute **somente** a
tarefa **T-01 — Decidir o destino do código existente divergente**, de
[`tasks/weather-app-tasks.md`](../weather-app-tasks.md).

> Esta tarefa **não cria código de produto**. A decisão já foi tomada; seu trabalho é **verificar com
> evidência** que a base está limpa e que os critérios de T-01 se sustentam, sem tocar em nada além do
> permitido abaixo.

## 1. Contexto

- **Produto:** Weather App web (mobile e desktop). Busca de cidade (Open-Meteo geocoding), seleção,
  clima atual e previsão de 5 dias, °C/°F, sem API key, sem cache, sem persistência.
- **Stack:** TypeScript strict, React 19 + Vite, Tailwind (dark glassmorphism), Vitest + Testing
  Library, Playwright, Biome, pnpm.
- **Fluxo SDD:** Spec → Plan → Tasks → Code. Fontes de verdade:
  [`specs/weather-app-spec.md`](../../specs/weather-app-spec.md),
  [`plans/weather-app-plan.md`](../../plans/weather-app-plan.md) e o backlog em `tasks/`.
- **Idioma:** narrativa e documentação em pt-BR; identificadores, nomes de arquivo e termos técnicos
  em en-US.

### Estado atual (já verificado antes deste prompt)

- O commit `6d9a87a` (`Initial commit`) tinha `src/` e `tests/` com uma implementação anterior que
  **divergia da spec**: timeout de 10 s (spec: 15 s), campos de vento, pressão, umidade e
  precipitação (fora do escopo, RF-06) e ausência de descarte de respostas tardias (AC-10).
- O commit `9bd0640` (`entrega inicial`) **removeu** esses arquivos. Hoje `src/` e `tests/` **não
  existem** no working tree.
- **Decisão tomada: substituir.** Está registrada em `plans/weather-app-plan.md` (linha
  `**Decisão:** substituir.`, seção Project Structure, e linha na tabela Risks & Trade-offs). O código
  antigo **não** será reaproveitado nem restaurado.

### Baseline esperado (não é defeito de T-01)

Sem `src/`, os comandos do checklist falham, e isso é esperado nesta tarefa:

| Comando | Resultado esperado hoje |
|---|---|
| `pnpm lint` | código 1 (`./src` e `./tests` ignorados por não existirem) |
| `pnpm build` | código 2 (`TS18003: No inputs were found in config file tsconfig.app.json`) |
| `pnpm test` | código 1 (`No test files found`) |

O checklist `pnpm lint` / `pnpm build` / `pnpm test` **não se aplica** a T-01, porque a tarefa não
altera `src/` nem `tests/`. Não tente "consertar" esses três comandos aqui: eles passam a funcionar
a partir de T-03, T-05 e T-17.

## 2. Critérios de aceite (de T-01)

| # | Critério | Requisito | Situação |
|---|---|---|---|
| 1 | `plans/weather-app-plan.md` contém a linha `Decisão:` com `substituir` e a justificativa. | Plano → Project Structure | **Verificar** (esperado: atendido) |
| 2 | A remoção do código antigo está em commit separado do código novo: `git show --stat 9bd0640` lista `src/` e `tests/` apenas como remoções; nenhum arquivo novo em `src/` ou `tests/`. | Plano → Project Structure | **Verificar** (esperado: atendido) |
| 3 | `grep -rnE "windSpeed\|pressure\|humidity\|precipitation" src tests` retorna zero ocorrências. | RF-06 | **Adiado** para o fim da fatia 1 (hoje não há `src/`) |
| 4 | `grep -rnE "10_?000" src` retorna zero ocorrências de timeout de 10 s. | RF-08 | **Adiado** para o fim da fatia 1 (hoje não há `src/`) |

Os critérios 3 e 4 **não podem ser considerados "passou"** agora: `grep` em diretório inexistente
termina com erro (código 2), e isso não é evidência de ausência. Registre-os como **N/A (sem
`src/`)** e deixe `- [ ]` no backlog.

## 3. Arquivos

| Pode ler | Pode editar | Não pode tocar |
|---|---|---|
| `plans/weather-app-plan.md`, `tasks/weather-app-tasks.md`, `specs/weather-app-spec.md`, histórico git | **Nenhum** (a verificação só lê). Exceção única: se um critério 1 ou 2 **falhar**, corrija o documento correspondente em `plans/` ou `tasks/`. | `src/**`, `tests/**`, `package.json`, `vite.config.ts`, `playwright.config.ts`, `index.html`, `tsconfig*.json`, `pnpm-lock.yaml` |

## 4. Passos

Execute cada comando e **cole a saída** no relatório final.

1. **Decisão registrada (critério 1):**
   `grep -n "Decisão:" plans/weather-app-plan.md`
   Esperado: uma linha contendo `substituir`, seguida da justificativa no mesmo parágrafo.
2. **Remoção separada do código novo (critério 2):**
   `git --no-pager show --name-status --format= 9bd0640 -- src tests | grep -vc '^D'`
   Esperado: `0` (toda entrada em `src/` e `tests/` é remoção `D`).
3. **Base limpa:**
   `git ls-files src tests | wc -l` → esperado `0`.
   `ls src tests` → esperado: erro "No such file or directory" para ambos.
4. **Sem restauração do código antigo:**
   `git status --short src tests` → esperado: saída vazia.
5. **Critérios 3 e 4:** não execute os `grep` como prova. Anote "N/A (sem `src/`)" e a condição para
   reavaliar: fim da fatia 1 do backlog (seção "Priorização e fatias verticais").
6. **Confirmar o que não mudou:** `git status --short` deve listar, no máximo, os arquivos de
   documentação em `plans/` e `tasks/`. Qualquer outro arquivo modificado por você é erro.

## 5. Regras

- **Não** crie `src/` nem `tests/`, não faça scaffold, não restaure arquivos do histórico
  (`git show 6d9a87a`, `git checkout 6d9a87a -- src` etc.).
- **Não** adicione dependências, não altere configuração (`vite.config.ts`, `playwright.config.ts`).
  A ampliação de `test.include` pertence a **T-03**; `@axe-core/playwright` pertence a **T-02**.
- **Não** faça commit, a menos que o usuário peça.
- **Não** marque os critérios 3 e 4 como cumpridos.
- Não adicione nada além do escopo da tarefa.

## 6. Definição de pronto

- [ ] Critérios 1 e 2 verificados com a saída dos comandos dos passos 1 e 2.
- [ ] Base limpa confirmada (passos 3 e 4).
- [ ] Critérios 3 e 4 registrados como adiados, com a condição de reavaliação.
- [ ] Nenhum arquivo fora de `plans/` e `tasks/` foi alterado.

## 7. Entrega esperada (relatório curto, em pt-BR)

1. Tabela com os 4 critérios: situação (`Atendido`, `Adiado` ou `Falhou`) e a evidência (comando + saída).
2. Lista de arquivos alterados (esperado: nenhum).
3. Qualquer divergência encontrada entre este prompt e o repositório.
4. Próxima tarefa sugerida: **T-03** (Vitest e jsdom) e **T-05** (tipos), que desbloqueiam a fatia 0.
