# Discovery — Aplicação de Previsão do Tempo

## Resumo Executivo

O produto será uma aplicação web responsiva, em português, para consultar o clima atual e a previsão de cinco dias de uma cidade.
Usuários poderão buscar cidades, escolher entre resultados ordenados e alternar a temperatura entre Celsius e Fahrenheit.
A previsão cobre hoje e os quatro dias seguintes; a consulta deve responder em até 15 segundos, com erro e nova tentativa em caso de falha.
A primeira versão não terá autenticação, geolocalização, histórico, analytics nem persistência de dados no servidor.
Antes de fechar a especificação, ainda é preciso esclarecer a fonte do dado “atual”, validar os termos da Open-Meteo e confirmar cidade inicial e responsável pela aprovação.

> Fase: **Discovery** (anterior à Spec). Fonte: briefing de negócio recebido da empresa.
> Este documento não define a solução técnica; registra o entendimento do problema,
> os requisitos de alto nível, riscos, dúvidas e suposições. Itens não confirmados
> estão em **Perguntas em Aberto** e **Suposições**.

## Briefing original

> "Sua empresa solicitou uma aplicação de previsão do tempo. Usuários devem poder:
> buscar cidades, ver o clima atual, ver a previsão de 5 dias, alternar entre
> Celsius e Fahrenheit e usar em dispositivos móveis."

## Contexto

- **Problema:** usuários precisam consultar rapidamente o clima atual e a tendência
  dos próximos dias para uma cidade de interesse, a partir de qualquer dispositivo,
  inclusive o celular.
- **Solicitante:** a empresa (área e stakeholder não identificados no briefing).
- **Público-alvo:** usuários finais em geral. Perfil, idioma principal e volume
  esperado não foram informados.
- **Escopo declarado pelo briefing:**
  1. Busca de cidades.
  2. Clima atual da cidade selecionada.
  3. Previsão para 5 dias.
  4. Alternância de unidade de temperatura (Celsius / Fahrenheit).
  5. Uso em dispositivos móveis (experiência responsiva).
- **Contexto de treinamento:** este projeto segue o fluxo SDD
  (`Brief → Spec → Plan → Tasks → Code → Test → Review → Ship`). A stack e as
  convenções estão definidas nas instruções do repositório (React + Vite, Tailwind,
  Vitest, Playwright, Open-Meteo sem API key). Este discovery não as altera.

## Personas Propostas

Personas hipotéticas, derivadas do briefing e ainda não validadas por pesquisa com
usuários. Servem como referência inicial para discovery e devem ser ajustadas com
evidências.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso do ponto de vista da persona |
|---|---|---|---|
| Pessoa que consulta o clima no dia a dia | Saber rapidamente as condições atuais e decidir como se vestir ou se preparar para sair. | Principalmente mobile, em consultas rápidas antes de sair de casa ou durante deslocamentos; pode usar desktop ocasionalmente. | Encontra a cidade e entende o clima atual em menos de um minuto, sem precisar repetir a busca. |
| Pessoa que planeja atividades com antecedência | Consultar os próximos dias para escolher quando realizar uma atividade ou organizar compromissos. | Desktop ou mobile, em sessões de planejamento mais longas; compara a previsão de cinco dias para uma cidade. | Consegue localizar e interpretar a previsão dos cinco dias e tomar uma decisão sem ambiguidade sobre as datas. |
| Pessoa familiarizada com Fahrenheit | Consultar o clima usando a unidade de temperatura que prefere ou compreende melhor. | Mobile ou desktop, possivelmente em viagens ou ao consultar cidades de outros países; alterna entre Celsius e Fahrenheit. | Consegue alternar a unidade e ver todos os valores de temperatura relevantes na unidade escolhida, sem conversões manuais. |

## Requisitos Funcionais

Derivados diretamente do briefing. Ainda sem critérios de aceite; estes serão
definidos na Spec.

| ID    | Requisito                                                                                                     | Origem    |
| ----- | ------------------------------------------------------------------------------------------------------------- | --------- |
| RF-01 | O usuário deve poder buscar cidades por nome, informando pelo menos 2 caracteres; coordenadas e CEP não são aceitos nesta versão. | Decisão   |
| RF-02 | A busca deve apresentar até 5 resultados ordenados por correspondência exata, início do nome e correspondência parcial; empates são ordenados alfabeticamente por cidade, estado/província e país. Os resultados devem exibir essas informações para escolha explícita. | Decisão |
| RF-03 | O usuário deve poder visualizar a temperatura e a condição meteorológica atual da cidade selecionada.           | Decisão   |
| RF-04 | O usuário deve poder visualizar, para hoje e os quatro dias seguintes, a data local, condição meteorológica e temperaturas mínima e máxima. | Decisão |
| RF-05 | O usuário deve poder alternar a unidade de temperatura entre Celsius (padrão) e Fahrenheit; a escolha vale globalmente durante a sessão atual. | Decisão |
| RF-06 | A unidade selecionada deve ser aplicada a todas as temperaturas exibidas (atual e previsão); vento e pressão não são convertidos nesta versão. | Decisão |
| RF-07 | A aplicação deve rejeitar buscas vazias ou com menos de 2 caracteres sem chamar a API e informar quando não houver resultados. | Decisão |
| RF-08 | Se a busca ou a consulta meteorológica falhar ou exceder 15 segundos, a aplicação deve informar o erro e oferecer nova tentativa. | Decisão |

## Requisitos Não-Funcionais

| ID     | Categoria         | Requisito                                                                                                                                       | Status                       |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| RNF-01 | Responsividade    | Aplicação web responsiva funcional de 320 px a 1920 px, sem rolagem horizontal; alvos de toque de pelo menos 44 × 44 px e sem perda de informação em telas pequenas. | Decisão (plataforma); critérios propostos |
| RNF-02 | Desempenho        | Exibir resultados em até 15 segundos após envio da busca e clima/previsão em até 15 segundos após seleção da cidade, incluindo chamadas externas. | Decisão |
| RNF-03 | Acessibilidade    | Conformidade com WCAG 2.1 nível AA; navegação completa por teclado com foco visível; contraste mínimo de 4,5:1; resultados, troca de unidade e erros anunciados a leitores de tela. | Proposto, a validar |
| RNF-04 | Resiliência       | Sem cache ou fallback com dados antigos nesta versão. Após 15 segundos sem resposta ou em caso de falha, exibir erro recuperável com opção de nova tentativa. | Decisão |
| RNF-05 | Restrição de dados externos | Open-Meteo é a fonte definida, sem API key. Termos de uso, limites e atribuição devem ser validados antes do lançamento. | Fonte decidida; validação pendente |
| RNF-06 | Privacidade       | Sem autenticação, geolocalização, histórico, analytics ou persistência de dados no servidor nesta versão. | Decisão |
| RNF-07 | Idioma            | Interface e formatação de datas/números em pt-BR; datas da previsão no fuso local da cidade consultada. | Decisão |
| RNF-08 | Navegadores       | Suportar versões atuais dos principais navegadores desktop e mobile; versões mínimas específicas não são fixadas nesta etapa. | Decisão |
| RNF-09 | Segurança         | Aplicação servida somente via HTTPS; termo digitado na busca tratado como texto, sem renderização de HTML. | Proposto |
| RNF-10 | Observabilidade   | Registrar erros técnicos e tempo de resposta na infraestrutura existente, sem termos buscados ou identificadores de usuário. | Decisão; destino e retenção conforme infraestrutura existente |

## Riscos

| ID   | Risco                                                                                                         | Impacto | Probabilidade | Mitigação sugerida (a validar na Spec/Plan)                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------- | ------- | ------------- | -------------------------------------------------------------------------------------------- |
| R-01 | Indisponibilidade ou mudança de contrato da API externa (Open-Meteo).                                         | Alto    | Baixa         | Camada de serviço isolada; tratamento de erro e timeout; estado de erro explícito na UI.      |
| R-02 | O significado de "clima atual" pode divergir entre estimativa de modelo e observação meteorológica.             | Médio   | Média         | Definir e documentar a semântica do valor atual antes de fechar a Spec.                        |
| R-03 | Busca de cidades com homônimos (ex.: várias "São João") gera resultado ambíguo.                               | Médio   | Alta          | Exibir país/estado junto ao nome e permitir escolha explícita.                               |
| R-04 | Conversão de unidade feita de forma inconsistente (atual vs. previsão) ou com arredondamento errado.          | Médio   | Média         | Conversão em função pura, com testes unitários cobrindo ambas as direções e os dois fluxos.   |
| R-05 | Implementação responsiva pode comprometer legibilidade ou interação em telas pequenas.                        | Médio   | Média         | Abordagem mobile-first; testes E2E em viewport de celular.                                    |
| R-06 | Disponibilidade e volume esperado de uso não estão definidos.                                                  | Médio   | Alta          | Definir metas e volume esperado com o solicitante antes de dimensionar a solução.              |
| R-07 | Inclusão futura de geolocalização sem consentimento ou base legal, apesar de estar fora desta versão.          | Alto    | Baixa         | Não incluir geolocalização sem decisão explícita e documentada; avaliar LGPD antes de mudança de escopo. |
| R-08 | Termos de uso da API externa exigirem atribuição ou limitarem uso comercial.                                  | Médio   | Média         | Verificar termos da fonte de dados antes do lançamento.                                      |

## Principais Riscos Técnicos e de Produto

| Tipo | Risco | Probabilidade | Impacto | Estratégia de mitigação |
|---|---|---|---|---|
| Técnico | Indisponibilidade, lentidão ou mudança de contrato da API meteorológica | Média | Alto: usuários podem ficar sem dados ou ver informações inconsistentes | Isolar a integração em um serviço, definir timeout, tratar erros explicitamente e monitorar falhas. Avaliar cache e estratégia de fallback. |
| Produto | A semântica de “clima atual” ainda não distingue estimativa do modelo de observação meteorológica | Média | Médio: usuários podem interpretar a estimativa como observação em tempo real | Definir a natureza do dado e comunicá-la na interface; validar a expectativa com o solicitante. |
| Técnico / Produto | Busca retorna cidades homônimas ou resultados inesperados | Alta | Médio: usuários podem consultar a cidade errada | Mostrar país e estado/província nos resultados, permitir seleção explícita e definir comportamento para entradas inválidas e buscas sem resultados. |
| Técnico | Limites de uso ou latência da API afetam a experiência de busca ou consulta meteorológica | Média | Alto: buscas lentas ou bloqueadas podem tornar o app inutilizável | Restringir a busca a envios explícitos, evitar chamadas excessivas, medir latência e validar capacidade para o volume esperado. |
| Técnico / Produto | Layout responsivo pode prejudicar legibilidade ou interação em celulares | Média | Médio: usuários podem não conseguir consultar clima ou previsão com facilidade | Projetar mobile-first e validar fluxos em viewport de celular e desktop. |
| Técnico | Conversão e apresentação de unidades ficam inconsistentes entre clima atual e previsão | Média | Médio: reduz a confiança nos dados | Centralizar regras de unidade e conversão; testar Celsius e Fahrenheit em todos os dados exibidos e esclarecer o escopo para vento e pressão. |
| Técnico / Produto | Metas de desempenho, disponibilidade e volume de uso não estão definidas | Alta | Alto: não há critério objetivo para validar qualidade nem dimensionar a solução | Acordar metas mensuráveis e volume esperado com o solicitante; instrumentar métricas para verificar os resultados. |
| Produto / Legal | Termos da fonte de dados podem exigir atribuição ou limitar o uso pretendido | Média | Alto: pode impedir ou atrasar o lançamento | Validar licença, atribuição e condições de uso com os responsáveis antes de consolidar a fonte de dados. |
| Produto / Legal | Coleta de dados pessoais pode ocorrer sem decisão explícita sobre privacidade | Baixa | Alto: pode gerar risco de conformidade e perda de confiança | Não coletar esses dados sem necessidade e aprovação; se forem necessários, definir consentimento, finalidade, retenção e política de privacidade. |
| Técnico / Produto | Usuários interpretam previsões como garantias, ou dados desatualizados como atuais | Média | Médio: frustração e perda de credibilidade | Exibir horário da última atualização, tratar dados indisponíveis ou desatualizados claramente e alinhar expectativas sobre a natureza estimada da previsão. |

## Decisões

Decisões confirmadas pelo solicitante para orientar a elaboração da Spec. As
justificativas registram o racional de produto; os pontos não cobertos continuam
em aberto.

| ID | Decisão | Justificativa | Perguntas em aberto resolvidas |
|---|---|---|---|
| D-01 | Usar Open-Meteo como fonte de dados, sem API key. | A fonte já está definida para o projeto e não exige gestão de chave de API. | Define a fonte e elimina a dúvida sobre necessidade de API key. Termos, limites de uso e atribuição ainda precisam de validação antes do lançamento. |
| D-02 | “5 dias” significa hoje mais os quatro dias seguintes; exibir data local, condição e temperaturas mínima/máxima por dia. | Define janela e formato diário simples para orientar interface, dados e testes. | Resolve início, agrupamento e campos da previsão. O significado exato de “clima atual” ainda está em aberto. |
| D-03 | Celsius é a unidade padrão. | Fornece um padrão inicial coerente com a interface em pt-BR. | Resolve a unidade inicial. Escopo global e duração da preferência são definidos em D-09. |
| D-04 | Não haverá autenticação nem persistência de dados no servidor. | Reduz fricção para uso e evita infraestrutura de contas e armazenamento de dados nesta versão. | Resolve login/contas e persistência de servidor. A política de privacidade e telemetria é detalhada em D-11. |
| D-05 | O idioma da interface será pt-BR. | Define o idioma principal da experiência e dos textos da aplicação. | Resolve o idioma da interface; datas e números seguem pt-BR. A previsão usa o fuso local da cidade. |
| D-06 | A entrega será uma aplicação web responsiva para mobile e desktop, sem PWA ou apps nativos. | Reutiliza a plataforma web do projeto e evita manter clientes nativos separados. | Resolve o significado de uso em dispositivos móveis e o tipo de plataforma desta versão. |
| D-07 | A busca será textual e explícita, acionada por Enter ou botão, com mínimo de 2 caracteres e até 5 resultados; não aceitará coordenadas nem CEP. Resultados ordenados por correspondência exata, prefixo, correspondência parcial e, em empate, ordem alfabética por cidade, estado/província e país; exibir esses três campos. | Mantém o fluxo previsível e limita chamadas e complexidade de busca. | Define interação, tamanho máximo, ordenação, desambiguação e formatos aceitos. Correção automática de erros de digitação permanece fora da definição. |
| D-08 | O clima atual mostrará temperatura e condição meteorológica; a previsão diária mostrará data, condição e mínima/máxima. | Limita a primeira versão às informações essenciais para uma consulta rápida. | Define os campos exibidos. Ainda é necessário confirmar se o “atual” será a estimativa corrente fornecida pelo modelo ou outro tipo de observação. |
| D-09 | A unidade de temperatura será global, começará em Celsius e poderá alternar para Fahrenheit apenas durante a sessão atual; vento e pressão não serão convertidos. | Evita armazenamento de preferência e ampliações de escopo para unidades não solicitadas. | Resolve alcance e duração da preferência, e o escopo da conversão. |
| D-10 | Busca e consulta meteorológica terão limite de 15 segundos cada; ao excedê-lo ou ocorrer falha, mostrar erro e opção de tentar novamente. Não haverá cache nem exibição de dados antigos como fallback. | Define um limite observável e evita apresentar dados potencialmente desatualizados como atuais. | Resolve metas de tempo da interação e comportamento de timeout/falha. Meta de disponibilidade global e capacidade para volume de usuários seguem em aberto. |
| D-11 | Não haverá geolocalização, histórico, analytics ou persistência no servidor. Registrar apenas erros técnicos e tempo de resposta na infraestrutura existente, sem termos buscados ou identificadores de usuário. | Minimiza coleta de dados e aproveita observabilidade já disponível, sem introduzir outro serviço. | Define coleta e conteúdo dos logs. Retenção/destino dependem da infraestrutura existente; sua disponibilidade precisa ser confirmada. |
| D-12 | Suportar versões atuais dos principais navegadores desktop e mobile, sem fixar versões mínimas nesta etapa. | Evita uma matriz de compatibilidade extensa para o MVP. | Resolve a política inicial de suporte, sem estabelecer versões específicas. |
| D-13 | O critério funcional de sucesso do MVP é concluir busca, seleção e exibição do clima atual e da previsão dentro do limite de 15 segundos. | Mede se o fluxo central entrega o valor prometido dentro do desempenho acordado. | Define um critério funcional inicial. Métricas de adoção/satisfação e responsável pela aprovação continuam em aberto. |

## Perguntas em Aberto

Não respondidas pelo briefing. Devem ser levadas ao solicitante antes da Spec.

1. **Clima atual:** os valores serão a estimativa corrente do modelo Open-Meteo ou outro tipo de observação? (D-08)
2. **Busca — qualidade:** como tratar erros de digitação e caracteres especiais? A busca não terá correção automática nesta versão (D-07).
3. **Cidade inicial e favoritos:** qual cidade aparece antes da primeira busca? Deve haver opção de favoritar cidades? Histórico não será mantido (D-11).
4. **Nomes de cidades:** devem ser exibidos no idioma devolvido pela fonte ou localizados para pt-BR?
5. **Disponibilidade e escala:** qual meta de disponibilidade e qual volume de usuários/buscas esperado?
6. **Dados e licença:** a empresa aprovou os termos da Open-Meteo? Há limites de uso ou exigência de atribuição na interface? (D-01)
7. **Telemetria:** a infraestrutura existente oferece registro e retenção de logs sem termos de busca ou identificadores? Qual retenção se aplica? (D-11)
8. **Marca e identidade visual:** há guia de marca, logotipo ou paleta, ou o tema dark glassmorphism do projeto é suficiente?
9. **Sucesso de produto:** além de concluir o fluxo em até 15 segundos (D-13), quais métricas de adoção ou satisfação serão usadas?
10. **Escopo excluído:** confirmar que favoritos, alertas, mapas e previsão de longo prazo ficam fora desta versão.
11. **Prazo e governança:** há data-alvo, orçamento e stakeholder/PO responsável por aprovar a Spec?

## Suposições

Premissas ainda não confirmadas, adotadas para seguir com o discovery. As decisões
confirmadas foram registradas na seção **Decisões**.

- **S-01:** Os estados de carregamento, erro e vazio serão tratados em todos os fluxos, conforme o padrão do projeto.
- **S-02:** Não haverá alertas, mapas, notificações push ou previsão de longo prazo nesta versão; confirmar exclusões em aberto.
- **S-03:** O público-alvo é geral e não exige recursos específicos de acessibilidade além dos padrões WCAG 2.1 AA propostos.
- **S-04:** A Open-Meteo fornecerá nomes de cidades adequados para exibição; idioma/localização dos nomes ainda está em aberto.

## Próximos passos

1. Validar as pendências de maior impacto: significado do clima atual, termos da Open-Meteo, busca por cidade inicial/favoritos e responsabilidade pela aprovação.
2. Gerar `specs/weather-app-spec.md` usando as decisões confirmadas e registrar como perguntas em aberto os itens ainda sem resposta (`.github/prompts/spec-prompt.prompt.md`).
