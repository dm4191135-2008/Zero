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
