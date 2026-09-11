# Controle de Leads IG

Mini plataforma mobile-first para lançamento diário e acompanhamento de métricas
dos leads captados pelo Instagram, substituindo a planilha. Ver `prompt-plataforma-leads-instagram.md`
para o briefing original e `design.md` para o guia de estilo.

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
```

Outros comandos:

```bash
npm run build      # build de produção em dist/
npm run preview    # serve o build de produção localmente
npm run lint        # oxlint
```

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (tokens e reset em `src/styles/globals.css`, seguindo `design.md`)
- Framer Motion para as animações
- Sem backend: os lançamentos ficam em `localStorage` no próprio celular. A tela
  "Histórico" tem exportação (JSON/CSV) e importação para backup.

## Estrutura

```
src/
  lib/         regras de negócio puras (métricas, datas, storage, backup) e tipos
  store/       contexto React que persiste os lançamentos em localStorage
  components/  primitivos de UI (Button, Card, Modal, Calendar, etc.) e ícones
  screens/     Preencher, Métricas, Histórico
```
