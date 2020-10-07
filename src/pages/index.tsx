import { GetStaticProps } from "next";

export default function Home({ org }) {
  return (
    <div>
      <h1>{org.login}</h1>
      <h3>{org.description}</h3>

      <p>Site: <a href={org.blog}>{org.blog}</a></p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // no momento da build ele vai abrir essa página, vai executar essa função
  // com o nome de getStaticProps, vai pegar os dados que estão dentro dessa 
  // função e vai repassar pro nosso componente Home, ou seja, para montar ele
  // de uma maneira estática, é utilizado essa metodologia quando eu tenho uma
  // página da minha aplicação que eu quero que o conteudo dela não muda
  // constantemente

  // Aqui eu precisso fazer a chamada a API que vai me retornar os dados para
  // eu poder criar a minha tela
  const response = await fetch('https://api.github.com/orgs/rocketseat');
  const data = await response.json();

  return {
    props: {
      org: data,
    }, // precissamos devolver algumas propriedades pro nosso
    // componente(Home) que vão ser acessadas 
    revalidate: 10 // esse revalidate recebe um número em segundos, server para
    // definir quantos segundos a página vai ficar em cache, ou seja se for 10 
    // segundos, a página vai ficar em cache por 10 segundos e depois desse 
    // intervalo de 10 segundos ele vai fazer uma nova requisição para API
  }
};
