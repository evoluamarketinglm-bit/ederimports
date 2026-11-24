# EDER IMPORTS — Landing Page de Chuteiras e Tênis

Site estático, responsivo e pronto para GitHub Pages ou Vercel.

## Conteúdo

- Logo, menu e botão do WhatsApp (11) 97194-4729.
- Banner de abertura 1080 x 1350, sem cortes.
- 4 banners horizontais: Nike, Adidas, Puma, Outras Marcas.
- 12 bolinhas de chuteiras (3 em cada seção), com títulos proporcionais, seleção central, laterais escurecidas, setas e rotação infinita.
- Título **CATÁLOGO DE TÊNIS** e 12 banners de tênis, com foco central, laterais desfocadas e autoplay.
- Fundo preto e cabeçalho preto, elementos azuis, sem Instagram e sem textos promocionais extras.
- Foram atualizados os catálogos de tênis de acordo com a lista enviada. O Tênis Mizuno permanece sem URL de destino.

## Ajustes visuais desta versão

- Barra superior de anúncios com movimento lateral contínuo: **ENVIAMOS PARA TODO BRASIL**, **CLIQUE NA COLEÇÃO**, **ATENDIMENTO PELO WHATSAPP**.
- Fundo da página e do cabeçalho pretos. Barra de anúncios azul e texto branco.
- Contêineres dos banners das chuteiras totalmente transparentes (sem fundo branco/cinza aplicado pelo site). **Atenção:** um fundo que faça parte da própria imagem remota não pode ser removido apenas pelo CSS; nesse caso é necessário substituir o arquivo de imagem por um PNG/WebP transparente no ImageKit.
- Nome de cada bolinha exibido logo abaixo dela, em tipografia adaptada para desktop/celular.
- Ícones SVG do WhatsApp corrigidos no cabeçalho e no botão flutuante, ambos apontando para (11) 97194-4729.
- URLs de imagem e links de catálogo mantidos.

## Como publicar

### Vercel
1. Extraia o ZIP; envie os arquivos e a pasta `assets` à raiz de um repositório no GitHub.
2. No Vercel, clique em **Add New > Project**, importe o repositório.
3. Framework Preset: **Other**. Não é preciso `npm install` ou comando de build. Clique em **Deploy**.

### GitHub Pages
1. Coloque os arquivos na raiz do repositório.
2. Em **Settings > Pages**, use **Deploy from a branch**, `main` / `(root)` e salve.
3. Aguarde a publicação do endereço exibido em Pages.

## Editar imagens, WhatsApp e destinos

Abra `config.js` no GitHub, clique em Edit (ícone de lápis), altere o link correspondente e salve em **Commit changes**. A página e os carrosséis são gerados automaticamente a partir do arquivo.

Campos de catálogo que ainda não têm URL:
- Adidas Futsal
- Puma Futsal
- New Balance (chuteiras)
- Tênis Mizuno

Essas imagens aparecem normalmente, mas ao clicar nelas será exibida uma mensagem de indisponibilidade até que você preencha o campo `url` no `config.js`.

Atenção: os banners e imagens são carregados por URLs públicas do ImageKit, não estão embutidos no ZIP. Verifique se os links permanecem acessíveis.

## Arquivos

- `index.html` — estrutura e marcações
- `style.css` — identidade visual e responsividade
- `config.js` — **edite este arquivo para atualizar URLs**
- `app.js` — navegação, carrosséis, seleção e autoplay
- `assets/favicon.svg` — ícone do site
