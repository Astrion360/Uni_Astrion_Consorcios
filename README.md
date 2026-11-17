# UniAstrion Consórcios

Plataforma educacional da Astrion Assessoria, com 50 módulos, 200 aulas, trilhas de aprendizado, exercícios e avaliação final.

## Publicação

O site é estático e funciona com o arquivo `index.html` na raiz. O fluxo `.github/workflows/pages.yml` está configurado para publicar automaticamente no GitHub Pages a partir da branch `main` (incluindo tentativa de habilitação automática do Pages).

URL esperada: https://astrion360.github.io/Uni_Astrion_Consorcios/

Se o site não estiver ativo, acesse **Settings > Pages** e configure **Source = GitHub Actions**; depois execute o workflow **Publicar UniAstrion Consórcios** em **Actions**.

## Área restrita

A autenticação, o progresso dos alunos, o banco privado de questões e a correção da prova são realizados em serviços Supabase. Os dados de curso protegidos integram o HTML de forma criptografada; a chave não é publicada no repositório.

## Antes de receber alunos reais

- Adicionar a URL do site às URLs de redirecionamento do Supabase Auth.
- Configurar SMTP do Supabase para convites e recuperação de senha.
- Configurar o serviço transacional de notificações da prova (Resend) e validar o recebimento de e-mails.
- Executar teste ponta a ponta com um aluno de teste antes da divulgação.

**Não publicar** chaves privadas, tokens `service_role`, respostas do banco de questões ou conteúdo bruto do curso no repositório.
