# ZERO — versão corrigida

## O que foi corrigido
- Removido o modelo fixo que podia não estar disponível para a tua conta.
- O servidor agora consulta os modelos que a tua própria chave Groq tem acesso e escolhe automaticamente um modelo compatível.
- Fallback automático entre modelos suportados.
- Corrigido o `manifest.json`.
- `ícone-192.png` agora é realmente 192x192.
- `ícone-512.png` agora é realmente 512x512.
- Adicionado `sw.js` para PWA/service worker.
- Adicionado registo automático do service worker.
- Removida a chave Groq que estava exposta no ZIP.
- Adicionado `.env.example` para colocares uma NOVA chave.

## Como iniciar
1. Instala Node.js 18+ (20+ recomendado).
2. Copia `.env.example` para `.env`.
3. Abre `.env` e coloca a tua NOVA chave Groq:
   `GROQ_API_KEY=gsk_...`
4. No terminal, dentro da pasta `Zero`:
   `npm install`
5. Depois:
   `npm start`
6. Abre:
   `http://localhost:3000`

## Testar a API
- `http://localhost:3000/api/health`
- `http://localhost:3000/api/groq/test`

## Instalação como aplicação
O ZERO está preparado como PWA. Para o botão/instalação aparecer, o navegador precisa servir a aplicação por `https://` ou, durante testes no computador, por `http://localhost`/`127.0.0.1`.

Abrir `index.html` diretamente com `file://` não é suficiente para uma PWA instalável.

## Importante sobre a Groq
O ID `llama-3.3-70b-versatile` continua listado pela Groq, mas a tua mensagem de erro indica que a tua chave/projeto não tinha acesso a esse modelo. Esta versão evita depender de um único ID: consulta os modelos acessíveis pela chave e usa um modelo permitido.

Se a chave devolver 401/403, cria uma nova chave no GroqCloud e coloca-a no `.env`.


## Subscrição mensal ZERO

A versão atual usa este modelo:
- 1.º mês grátis a partir da primeira utilização real do ZERO;
- depois, acesso às funções de criação/análise/níveis apenas com subscrição mensal;
- projetos já guardados e perfil continuam visíveis;
- a renovação mensal deve ser feita pelo sistema de pagamentos da Fawi.

### Configuração Fawi

No `app.js`, define o `ZERO_FAwi_MONTHLY_PRICE_ID` com o Price ID mensal criado no Fawi Office.

A integração da chamada de pagamento está isolada no adaptador:

`window.ZERO_FAWI_SUBSCRIBE`

O tutor deve ligar aí a chamada oficial da API Fawi usada pelo vosso ambiente e devolver:

`{ success: true, subscriptionUntil: "2026-10-31T..." }`

Quando a Fawi confirmar o pagamento, o ZERO libera o acesso até `subscriptionUntil`.

Importante: o estado guardado no `localStorage` é apenas o mecanismo de interface/trial. Para cobrança e bloqueio reais entre dispositivos, a subscrição deve ser validada no backend através da conta/identidade da Fawi.
