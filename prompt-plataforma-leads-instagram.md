# Prompt: Mini plataforma de controle de leads (Instagram) — mobile-first

## Contexto

Temos uma atendente responsável por captar clientes pelo Instagram (DM, comentários,
stories) e trazer esses leads para o nosso projeto. Hoje esse controle é feito numa
planilha (anexo `dados-seed.json` traz os números reais que já foram lançados nela).
Queremos substituir a planilha por uma mini aplicação web, **mobile-first**, para ela
lançar os números do dia direto do celular — sem fricção, sem precisar abrir planilha
nenhuma.

Antes de começar a implementar, leia o `design.md` na pasta do projeto e explore a
pasta `logos/` para entender a identidade visual disponível.

## Objetivo

Construir um app web simples, rápido e agradável de usar no celular, com duas frentes
principais:

1. **Preencher** — tela de lançamento diário dos números.
2. **Métricas** — dashboard com os indicadores calculados a partir dos lançamentos.

Isso é o mínimo, não um teto. Se fizer sentido propor telas extras para a experiência
ficar melhor (histórico editável, comparação de períodos, etc.), fique à vontade —
não quero travar sua criatividade nessa parte.

## Quem vai usar

Uma atendente, sozinha, prospectando e respondendo leads pelo Instagram. Ela vai abrir
o app todo dia (às vezes várias vezes ao dia) pelo celular para lançar os números.
Isso precisa ser rápido — pensando em poucos toques e o mínimo de fricção possível.

## Dados que ela lança por dia

- Data (padrão: hoje)
- Leads contatados
- Respostas recebidas
- Agendamentos
- Comparecimentos
- Conversões

## Lógica das métricas (regra de negócio — siga exatamente)

```
taxa_resposta        = respostas ÷ contatados
taxa_agendamento      = agendamentos ÷ respostas
taxa_comparecimento   = comparecimentos ÷ agendamentos
taxa_no_show          = 1 − taxa_comparecimento
taxa_conversao        = conversões ÷ comparecimentos      (pós-comparecimento)
taxa_conversao_geral  = conversões ÷ contatados            (funil completo)
```

Pontos importantes:
- Toda divisão por zero precisa ser tratada com elegância (mostrar algo como "—",
  nunca `NaN`, `Infinity` ou erro na tela).
- Quando agregar por semana/mês/período, calcule as taxas em cima da **soma dos
  totais** do período, não da média das taxas diárias — isso evita que um dia com
  poucos contatos distorça a métrica.

## Tela "Preencher"

- Formulário rápido, mobile-first: inputs numéricos grandes, teclado numérico do
  celular, idealmente com botões de +/− para ajuste rápido no polegar.
- Precisa permitir editar/corrigir o lançamento de um dia já preenchido (ela vai
  errar ou esquecer de atualizar algum dia, é normal).
- Ao salvar, seria bacana dar um feedback imediato com as taxas daquele dia.
- Validações sugeridas (alertar, não necessariamente travar): respostas ≤ contatados,
  agendamentos ≤ respostas, comparecimentos ≤ agendamentos, conversões ≤
  comparecimentos.

## Tela "Métricas"

- Totais e taxas do período selecionado (dia / semana / mês / período customizado).
- Funil visual: Contatados → Respostas → Agendamentos → Comparecimentos → Conversões.
- Evolução ao longo do tempo (linha ou barra) para acompanhar tendência.
- Taxa de no-show em destaque — é um número que costuma passar despercebido mas diz
  muito sobre a qualidade dos agendamentos.
- Ideias extras, à sua escolha: comparação mês atual vs. anterior, melhor/pior dia,
  streak de dias preenchidos, etc. São sugestões, não obrigações.

## Persistência dos dados

Pode salvar em storage local mesmo (localStorage/IndexedDB) — é uma atendente só,
usando o mesmo celular no dia a dia, não precisa de backend robusto de cara. Dito
isso, pense em alguma forma de backup/exportação (ex: exportar CSV/JSON), porque
perder o histórico de meses seria um problema real. Se você achar que vale a pena uma
solução mais robusta (ex: sync com um banco simples), fique livre para propor — a
decisão técnica é sua, só sinalizo a preocupação central: **não pode perder dados**.

## Dados iniciais (seed)

Ela já vinha usando a planilha e tem dias reais lançados. Não quero começar do zero —
use os dados abaixo como carga inicial:

| Data       | Contatados | Respostas | Agendamentos | Comparecimentos | Conversões |
|------------|-----------:|----------:|--------------:|-----------------:|-----------:|
| 08/09/2025*| 61         | 11        | 2             | 0                 | 0          |
| 09/09/2025*| 52         | 5         | 2             | 0                 | 0          |
| 10/09/2025*| 43         | 4         | 0             | 0                 | 0          |

\* Essas datas vieram com o ano 2025 na planilha original (o app está sendo criado em
setembro de 2026). Pode ser erro de digitação dela na hora de preencher — vale
confirmar antes de migrar, ou simplesmente manter como está e deixar fácil de corrigir
depois pela tela "Preencher".

Mesmos dados em JSON, para importar direto:

```json
[
  { "data": "2025-09-08", "contatados": 61, "respostas": 11, "agendamentos": 2, "comparecimentos": 0, "conversoes": 0 },
  { "data": "2025-09-09", "contatados": 52, "respostas": 5, "agendamentos": 2, "comparecimentos": 0, "conversoes": 0 },
  { "data": "2025-09-10", "contatados": 43, "respostas": 4, "agendamentos": 0, "comparecimentos": 0, "conversoes": 0 }
]
```

Obs.: a planilha original também tinha uma linha de exemplo fictícia (01/09/2026 —
40 contatados, 18 respostas, 6 agendamentos, 5 comparecimentos, 2 conversões) que
**não é dado real**, é só uma linha de amostra para mostrar o formato de
preenchimento. Não precisa migrar essa linha; pode reaproveitar como inspiração para
um estado de demonstração/onboarding, se achar útil.

## Identidade visual

Na pasta do projeto tem um `design.md` — siga fielmente para cores, tipografia,
espaçamento e estilo dos componentes. Também tem uma pasta `logos/` com a logo da
empresa — use esses arquivos para a marca do app (cabeçalho, favicon, tela inicial,
etc.).

## Liberdade técnica

Sem restrição de stack — escolha o que fizer mais sentido para entregar um app
mobile-first rápido e confiável (React, Vue, o que preferir). As únicas coisas
não-negociáveis são a lógica das métricas descrita acima e seguir o `design.md` à
risca. Tudo o mais — telas extras, microinterações, forma de navegação, virar PWA ou
não — é decisão sua.
