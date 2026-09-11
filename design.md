# Guia de estilo — Controle de Leads IG

Identidade visual completa para este painel de controle de leads vindos do
Instagram (DM, comentário, resposta de story, etc.). É a mesma linguagem
visual do painel comercial de leads médicos já construído anteriormente —
mesmo tom escuro, mesmo acento amarelo, mesma disciplina de "nenhum elemento
com estilo padrão de navegador". Trate este arquivo como a fonte da verdade
antes de estilizar qualquer tela.

---

## 1. Filosofia

- Fundo quase preto, superfícies em camadas (não sombra pesada) para dar
  profundidade, e **uma única** cor de acento forte usada com moderação:
  ações primárias, números que importam agora, indicador de "ao vivo",
  estados selecionados. Nada de paleta multicolorida — cor de status
  (qualificado, agendado, perdido etc.) é semântica e sóbria, não decorativa.
- Zero estilo padrão de navegador. Checkbox, select, date picker, scrollbar,
  outline de foco — tudo reconstruído. Seção 9 explica como isso é garantido
  de verdade, não só "por acaso".
- Movimento com propósito: entradas suaves com leve deslocamento vertical,
  sem exagero. Animação existe para guiar o olho e comunicar hierarquia.
- Números tratados como o elemento mais importante da tela — grandes,
  `tabular-nums`, com contraste alto. Este é um painel para ser lido rápido,
  às vezes em tempo real, então hierarquia numérica > decoração.

---

## 2. Tokens de cor

```css
--color-base:            #151515;   /* fundo da página */
--color-surface:         #1b1b1a;   /* cartões/painéis padrão */
--color-surface-raised:  #222220;   /* elementos elevados: modais, cartão hero */
--color-surface-sunken:  #101010;   /* inputs, trilhos de barra */

--color-border:          rgba(245, 244, 236, 0.08);
--color-border-strong:   rgba(245, 244, 236, 0.16);

--color-text:            #f5f4ec;   /* nunca branco puro */
--color-text-muted:      rgba(245, 244, 236, 0.62);
--color-text-faint:      rgba(245, 244, 236, 0.38);

--color-accent:          #fad214;
--color-accent-ink:      #171502;   /* texto/ícone sobre fundo de acento */
--color-accent-soft:     rgba(250, 210, 20, 0.12);
--color-accent-border:   rgba(250, 210, 20, 0.35);

--color-positive:        #7be3a8;   /* resultado favorável */
--color-negative:        #ff6f70;   /* resultado desfavorável */
```

Cores semânticas específicas deste domínio — siga o mesmo espírito das cores
de estágio do funil do projeto anterior (neutro → azul → acento → verde
claro → verde forte, conforme o lead avança):

```css
--color-novo:         var(--color-text-faint);  /* lead recém-chegado, ainda sem triagem */
--color-em-conversa:  #6fb3ff;                  /* respondido, em andamento */
--color-qualificado:  var(--color-accent);      /* atingiu critério de qualificação */
--color-agendado:     #7be3a8;
--color-convertido:   #34d399;
--color-perdido:      var(--color-negative);    /* não respondeu, desistiu, etc. */
```

Regra: nunca hex direto em componente — tudo referencia uma variável. Se
surgir um novo status/categoria, adicione uma variável semântica nova em vez
de reaproveitar uma cor "de olho".

---

## 3. Tipografia

- **Heading**: pilha de fontes do sistema —
  `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
  Peso 600, `letter-spacing: -0.01em`. Aplicado globalmente a `h1`–`h6`.
- **Corpo**: Poppins (Google Fonts), pesos 300–700 carregados via
  `next/font/google` (ou equivalente do framework escolhido), variável CSS
  exposta como `--font-poppins`/`--font-body`.
- Escala:
  - 11–12px: metadados, timestamps de mensagem, legendas de eixo
  - 12.5–14px: rótulos, corpo padrão, texto de botão
  - 14.5–15px: título de painel/cartão
  - 17–20px: título de seção
  - 22–28px: nome do lead/cartão em destaque, número secundário
  - 32–40px: título de página
- `tabular-nums` em **todo** número que possa mudar (contadores ao vivo,
  taxas, valores) — evita o texto "tremer" horizontalmente ao atualizar.
- Peso predominante: medium/semibold (400–600). `bold`(700) só em números
  muito grandes em destaque.

---

## 4. Espaçamento, raio e elevação

```css
--radius-sm: 10px;  /* inputs, botões, badges pequenos */
--radius-md: 16px;  /* toast, tooltip */
--radius-lg: 24px;  /* cartões e painéis — o padrão */
--radius-xl: 32px;  /* blocos muito grandes, raro */
```

- Container: largura máxima central (~880–1180px conforme densidade),
  padding horizontal generoso, 40–80px de respiro vertical entre seções.
- Cartão padrão: `bg: surface`, borda `1px solid var(--color-border)`,
  `radius-lg`, sem sombra.
- Cartão elevado (modal, destaque): `bg: surface-raised`, borda
  `border-strong`, sombra grande e difusa e escura (nunca sombra "dura").
- Cartão "flat" (fundo de trilho): `bg: surface-sunken`, sem borda.

---

## 5. Componentes de base

Construa estes primeiro — nenhuma tela específica deve estilizar botão,
input ou cartão na mão.

### Botão
- `primary`: fundo sólido de acento, texto `accent-ink`, sombra suave
  tingida do próprio acento, hover = brightness +5%, active = brightness -5%.
- `secondary`: `surface-raised` + borda `border-strong`, hover troca borda
  para `accent-border`.
- `ghost`: transparente, `text-muted`, hover vira `text` + fundo
  `rgba(255,255,255,0.05)`.
- `danger`: transparente, borda vermelha translúcida — **só** em repouso já
  neutro; se for um ícone de ação (ex.: excluir lead) dentro de uma lista,
  ele começa igual às ações neutras e só fica vermelho no hover, nunca antes.
- Alturas: `md` 44px, `sm` 36px. Radius `sm`. `disabled` = opacidade 40% +
  `pointer-events: none`.

### Campo de formulário
Rótulo pequeno acima (13px, `text-muted`) → input com ícone inline à
esquerda (14px, `text-faint`, `pointer-events-none`) → dica/erro abaixo
(12px). Fundo `surface-sunken`, borda `border-strong`, foco vira
`accent-border`. Ícones são SVG de traço fino desenhados à mão.

### Checkbox / Toggle
Nunca o controle nativo visível. Input real escondido (`sr-only`) atrás de
um `<span>` estilizado reagindo via `peer`, com ícone de check em SVG
desenhado à mão. Caixa 16px, raio ~5px, marcado = fundo de acento + ícone
`accent-ink`. Toggle: pílula 34×20, bolinha de 14px deslizante, marcado =
fundo de acento.

### Cartão / Painel
Título (14.5px, medium) + ação opcional + botão de "info" circular (15px)
no cabeçalho; conteúdo abaixo.

### Modal
Fundo escurecido + leve `backdrop-blur`, clique fora fecha, painel
centralizado (cartão elevado), entra com fade + leve scale + leve
deslocamento. Trava scroll do body, Esc fecha, foco vai ao painel ao abrir.
Scroll só dentro do painel — nunca corta conteúdo nem duplica barra de
rolagem.

⚠️ **Armadilha já vivida neste sistema**: o efeito que dá foco ao painel do
modal não pode depender de `onClose` no array de dependências se quem chama
o modal passa uma closure inline (`onClose={() => setAberto(false)}`) — essa
closure muda de identidade a cada render do formulário (ex.: a cada tecla
digitada em um campo controlado dentro do modal), refazendo o efeito e
roubando o foco do campo de volta pro painel a cada letra digitada. Guarde a
versão mais recente de `onClose` numa `ref` atualizada à parte, e deixe o
efeito de foco depender só de `open`.

### Toast
Empilhado no canto inferior direito, fundo levemente tingido pela cor do
tipo (sucesso = tingido de acento, erro = tingido de vermelho, info =
superfície elevada neutra), `backdrop-blur`, entra com fade+slide+scale, sai
deslizando, clique dispensa, auto-dismiss por tempo.

### Elementos flutuantes (tooltip, dropdown, seletor de data)
Regra não-negociável: renderizar via portal direto no `<body>`,
`position: fixed` calculado por `getBoundingClientRect()` do gatilho, preso
às bordas da viewport, fecha em scroll/resize/clique fora/Esc. Idealmente
posicionamento em duas fases (posição otimista ao abrir → corrige depois de
medir o tamanho real do conteúdo). Nunca deixe um elemento flutuante nascer
dentro de um container com `overflow` — ele será cortado ou ganhará
scrollbar dupla.

---

## 6. Padrões deste domínio

- **Indicador "ao vivo"**: bolinha de 6px pulsando (opacidade 100%→35%→100%,
  ~2s) + texto "Atualizado há Xs" — junto de um toggle para pausar a
  atualização automática. Usa polling silencioso; se falhar, mostra um aviso
  discreto sem travar a tela com os dados já carregados.
- **Cartão de lead**: nome + @ do Instagram (com ícone de link externo para
  abrir o perfil), origem do contato (DM direto / comentário / resposta de
  story / indicação — cada uma com um badge pequeno e cor própria), status
  atual como pílula (ver abaixo), timestamp do último contato. Ação de editar
  em ícone discreto, nunca competindo visualmente com o conteúdo do cartão.
- **Pílula de status**: sempre pílula, nunca texto solto nem caixa
  retangular tipo select — `radius: 999px`, fundo tingido ~10–15% da cor
  semântica do estágio (seção 2), borda ~35% da mesma cor, texto 11–12px
  medium. Vale tanto para exibição pura quanto para status clicável/editável
  (o elemento clicável é a própria pílula, com um pequeno chevron dentro
  dela — nunca uma caixa de select ao lado).
- **Funil de estágios**: barra por estágio (Novo → Em conversa →
  Qualificado → Agendado → Convertido), trilha fina (6–10px, cantos
  arredondados, fundo quase invisível), preenchimento anima via `scaleX`
  0→1 com `transform-origin: left` (nunca anime `width`). Paleta vai de
  neutro para o verde de conversão. Anotação entre estágios ("X% seguem
  para a próxima etapa") com seta pequena. Etapas que não existem para um
  lead específico (ex.: sem dado de "agendado") não aparecem como "0%"
  enganoso — o funil se adapta ao que existe de verdade.
- **Lista ranqueada / barra proporcional**: para comparar origem de lead,
  performance por atendente etc. — rótulo + valor à direita, trilha fina
  preenchida proporcionalmente ao maior valor do conjunto, corte num número
  máximo de itens visíveis, rótulos longos truncam.
- **Série temporal**: leads chegando ao longo do tempo — área suave com
  gradiente que desvanece para transparente, traço 2–2.5px, grade mínima
  (só linhas horizontais bem sutis), tooltip customizado no mesmo estilo de
  cartão elevado do resto do sistema.
- **Bloco numérico em destaque**: rótulo pequeno + número grande
  (`tabular-nums`, semibold). Variante "hero" maior em `surface-raised` para
  os 2–3 números mais importantes da tela (ex.: leads novos hoje, taxa de
  resposta, taxa de conversão); variante compacta em grade para métricas
  secundárias. Pílula opcional de variação (`↑`/`↓` + valor) com verde/
  vermelho — configurável qual direção é "boa" (nem sempre subir é positivo,
  ex.: taxa de perda).

---

## 7. Movimento

```css
--ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
```

- Entrada de painel/seção: opacidade 0→1 + `translateY` 14–18px→0, 0.4–0.7s,
  `ease-out-soft`. Listas/grades entram com atraso progressivo por índice
  (~0.03–0.12s × índice), com teto (ex.: `min(indice * 0.05, 0.4)`).
- Micro-interação (tooltip, dropdown): 0.15s, `ease-out`, deslocamento
  pequeno (4–10px).
- Hover/tap em botão/ícone: `scale` leve (hover ~1.02–1.04, tap ~0.95–0.97)
  ou mudança de brilho em botões sólidos — escolha um por componente, não os
  dois.
- Sempre respeite `prefers-reduced-motion` — reduza toda duração a ~0
  globalmente quando pedido.
- ⚠️ Lição já aprendida: **não use `whileInView` para animações que
  codificam dado real** (largura/altura de barra) quando muitos elementos
  parecidos animam juntos — em volume o disparo é pouco confiável e alguns
  ficam presos no estado inicial. Use `animate` direto nesses casos;
  `whileInView` fica só para entradas decorativas conforme o usuário rola a
  página.

---

## 8. Scrollbar, foco e seleção

```css
* { scrollbar-width: thin; scrollbar-color: rgba(245,244,236,0.18) transparent; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background-color: rgba(245,244,236,0.14);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
*::-webkit-scrollbar-thumb:hover { background-color: rgba(245,244,236,0.24); }

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

::selection { background: var(--color-accent); color: var(--color-accent-ink); }
```

Nunca `outline: none` sem um `:focus-visible` de verdade no lugar.

---

## 9. Zero estilo padrão de navegador — como fazer de verdade

Reset explícito na base do projeto:

```css
button, input, select, textarea {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  appearance: none;
  -webkit-appearance: none;
}
button { cursor: pointer; }
button:disabled { cursor: not-allowed; }
input, textarea { outline: none; } /* substituído pelo :focus-visible global */
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; margin: 0; padding: 0; }
```

E todo controle nativo é reconstruído por cima: checkbox, toggle, select
(vira botão + lista flutuante customizada, nunca um `<select>` visível),
date picker, input de arquivo (vira área de upload com borda tracejada +
prévia customizada, nunca o "Escolher arquivo" padrão do navegador),
scrollbar (seção 8).

### ⚠️ A armadilha técnica mais importante

Se este projeto usar **Tailwind CSS v4** (config via CSS, `@theme` em vez de
`tailwind.config.js`), o reset acima **precisa** estar dentro de
`@layer base { ... }`:

```css
@layer base {
  * { box-sizing: border-box; border-color: var(--color-border); }
  html { height: 100%; color-scheme: dark; }
  body { background: var(--color-base); color: var(--color-text); font-family: var(--font-body); }
  button, input, select, textarea { /* reset acima */ }
}
```

Motivo: CSS cascade layers ignoram especificidade entre uma regra *sem*
layer e uma regra *dentro* de um `@layer` — a sem-layer sempre vence, não
importa a especificidade da outra. Um reset solto (fora de `@layer`) vence
qualquer utilitário do Tailwind escrito depois no arquivo. Isso já quebrou
silenciosamente um botão "primary" inteiro no projeto anterior — o fundo
amarelo nunca era aplicado, só a sombra aparecia, e o bug parecia
"aleatório" até se entender que era uma questão de *camada*, não de ordem ou
especificidade. Coloque **todo** CSS de reset/global dentro de
`@layer base`/`@layer utilities`, nunca solto no arquivo.

---

## 10. Segurança de credenciais de integração (Instagram)

Este projeto provavelmente vai guardar credenciais de acesso à API do
Instagram/Meta por conta conectada (token de acesso, ID de conta comercial).
A mesma disciplina já usada para credenciais de anúncios no projeto anterior
se aplica aqui, e vale documentar desde o início do projeto, não depois:

- O token de acesso **nunca** deve trafegar até o navegador — nem em props
  de Server Component, nem em resposta JSON de rota de API, nem em log.
- Defina dois formatos de "conta conectada": um tipo completo (uso só
  server-side: rotas de API, funções de banco de dados) e um tipo "público"
  — o mesmo objeto, mas com o token substituído por um booleano
  (`temTokenConfigurado: boolean`). **Todo** dado que cruza a fronteira
  servidor→cliente usa exclusivamente o tipo público.
- No formulário de editar/conectar uma conta, o campo de token começa
  **sempre vazio** (nunca é possível reidratar o valor real no navegador) —
  o placeholder indica "já configurado, deixe em branco para manter" quando
  aplicável, e salvar com o campo vazio mantém o token já salvo em vez de
  apagá-lo.
- Trate isso com o mesmo cuidado de qualquer segredo de ambiente: nunca
  commitado em arquivo, configurado via `.env` local ou pelo próprio
  formulário da aplicação.

---

## 11. Ícones

SVG desenhados à mão, inline, como componentes de módulo (nunca recriados
dentro do corpo de outro componente — muda identidade a cada render e pode
causar remontagem indevida). Traço fino: `stroke="currentColor"`,
`stroke-width` 1.3–1.8, pontas/junções arredondadas, sem preenchimento
exceto detalhes pontuais (check, bolinha). Tamanhos 9–16px conforme
contexto. Sem biblioteca de ícones externa.

---

## 12. Checklist de execução

1. Camada de tokens primeiro (seções 2–4) — cores, fontes, raio, easing —
   tudo centralizado antes de qualquer componente de tela.
2. Reset de zero-estilo-nativo imediatamente (seções 8–9), com atenção à
   regra de `@layer` se for Tailwind v4. Valide cedo: renderize um
   `<button>`, `<input>`, `<select>` crus e confirme que nada "parece Chrome
   padrão".
3. Primitivos de UI (seção 5) antes de qualquer tela de domínio: Button,
   Card, campo de formulário, Checkbox/Toggle, Modal, Toast, elemento
   flutuante.
4. Telas de domínio (lista de leads, funil, filtros, relatório) compõem os
   primitivos acima — nenhuma estiliza botão/input por conta própria.
5. Elemento flutuante sempre nasce com o padrão de portal + posição fixa +
   limite de viewport, desde o início.
6. Constantes de movimento centralizadas e reutilizadas; `animate` em vez de
   `whileInView` para qualquer animação que represente dado real.
7. Se a integração com Instagram/Meta entrar em algum momento, aplicar a
   seção 10 desde a primeira linha de código que tocar em token — não como
   correção depois.
8. Varredura final procurando controle nativo que tenha escapado (checkbox,
   select, date/file input, outline de foco padrão, scrollbar padrão, fundo
   de autofill do navegador).
