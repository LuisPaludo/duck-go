# Tutorial de Teste para o Aplicativo Duck GO!

## Introdução

**Duck GO!** é um webapp desenvolvido em Django e Angular destinado a otimizar o turismo em Pato Branco. O sistema, inspirado no Pokémon GO, integra funcionalidades de geolocalização com mecanismos de recompensa.

- **Registro e Autenticação**: Utiliza-se as bibliotecas Django Rest Auth e Rest Framework. A autenticação é feita através de tokens, especificamente tokens de acesso e refresh.
- **Perfil de Usuário**: Os usuários podem gerenciar informações do perfil, visualizar históricos de ações (como aquisição e resgate de pontos) e alterar configurações de segurança.
- **Mecanismo de Pontuação**: QR Codes são posicionados em pontos turísticos selecionados em parceria com a prefeitura. A leitura de um QR Code adiciona pontos à conta do usuário, com limitações de leitura de 5 minutos por QR Code e um teto diário de 700 pontos.
- **Parceiros**: Uma categoria distinta de usuários. Eles não têm funcionalidades de resgate, mas podem criar recompensas e validar QR Codes de prêmios dos usuários.

Siga os passos abaixo para testar todas as funcionalidades do aplicativo Duck GO!.

## 1. Acesso ao WebApp

- Acesse o aplicativo através do link: [https://luispaludo.github.io/duck-go](https://luispaludo.github.io/duck-go)

## 2. Criação de Contas

- Crie **duas contas**:
    1. A primeira conta será um **usuário normal**.
    2. A segunda conta será um **usuário parceiro**.
- Para criar as contas, serão necessários 2 emails. Execute a verificação em ambos os emails.

> Nota: Se preferir, você também pode utilizar as contas já criadas que foram fornecidas anteriormente.

## 3. Acesso ao Admin

- Clone o repositório do servidor do backend para a sua máquina.
- Navegue até o diretório do projeto.
- Crie um ambiente virtual (venv) para isolar as dependências.
- Instale os requerimentos do projeto.
- Execute o servidor localmente.
  > Nota: O acesso ao servidor local é necessário devido a problemas de acesso pelo servidor hospedado. Esta é uma solução temporária para edição do banco de dados.
- Acesse a interface de administração do Django em [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin).
- Utilize as credenciais do super usuário fornecidas para fazer o login.


## 4. Tornando um Usuário em Parceiro

- No painel de administração, vá para `user_data` -> `users`.
- Escolha o usuário que deseja transformar em parceiro.
- Na página de edição, marque a caixa de seleção `is_partner`.
- Salve as alterações.

## 5. Coletando Coordenadas

- Acesse [https://browserleaks.com/geo](https://browserleaks.com/geo) e colete as coordenadas do seu local atual.
  - Recomendamos que faça isso com o celular para obter maior precisão.

## 6. Adicionando um Ponto Turístico

- No painel de Admin do Django, vá para `locations` e depois em `touristAtractions` para adicionar um novo ponto turístico.
- Preencha os campos necessários. Exclua os campos `code` e `qr code` (eles serão preenchidos automaticamente ao salvar).
- Adicione as coordenadas que você coletou no passo 5.
- Salve e acesse o ponto turístico criado. Copie o link em `QR_code` e salve-o para uso futuro.

## 7. Resgatando Pontos

- Acesse [https://luispaludo.github.io/duck-go](https://luispaludo.github.io/duck-go) e faça login com sua conta de usuário.
- Na página inicial, clique no botão da câmera e leia o QR Code que você criou no passo 6.
- Uma mensagem de sucesso aparecerá, indicando que os pontos foram adicionados à sua conta.
- Vá para o perfil e na aba `histórico`, verifique se os pontos foram adicionados.

## 8. Acessando como Parceiro

- Deslogue da conta do usuário e faça login com a conta do parceiro.

## 9. Atualizando Perfil do Parceiro

- Na aba `perfil`, complete as informações que faltam.

## 10. Criando um Prêmio

- Vá para a aba `criar prêmio` e crie um prêmio para os usuários resgatarem.

## 11. Resgatando Prêmio como Usuário

- Deslogue da conta do parceiro e faça login com a conta do usuário.
- Vá para a lista de prêmios e, se tiver pontos suficientes, resgate o prêmio criado na etapa 10.

## 12. Verificando o Cupom Resgatado

- Acesse seu perfil e na aba `cupons`, verifique se o cupom resgatado está lá.
- Acesse o QR Code do prêmio resgatado e salve a imagem.

## 13. Validando o Cupom como Parceiro

- Deslogue da conta do usuário e faça login novamente como parceiro.
- Na página inicial, clique no botão da câmera e leia o QR Code do usuário.

---

**Outras Funcionalidades**:
- Reenviar email de verificação.
- Trocar de senha.
- Resetar a senha.
- Conhecer os locais turísticos.
- Acessar informações das empresas parceiras.

---

Esperamos que esse tutorial ajude você a testar todas as funcionalidades do aplicativo. Se tiver dúvidas ou problemas, entre em contato.
