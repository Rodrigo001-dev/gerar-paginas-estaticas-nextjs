import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

export default function Member({ user }) {
  // const { query } = useRouter(); // query vai pegar a informação da URL(rota)
  // que é dinâmica

  // Se o fallback função getStaticPaths estiver true e quando uma pessoa for
  // acessar uma página de um usuário novo esse dados do usuário não vão estár
  // de uma forma estática e vai ser precisso ir na API para pegar esses dados
  // e isso pode demorar um pouco e para demosntrar que está carregando os 
  // dados utilizamos o is Fallback para falar que ele está em um estado de 
  // carregamento
  const { isFallback } = useRouter();

  // Se estiver carregando
  // retorne um <p>Carregando...</p>
  if (isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <div>
      <img 
        src={user.avatar_url} 
        alt={user.name} width="80" 
        style={{ borderRadius: 40 }} 
      />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
};

// a função getStaticPaths precisa me falar quais são as páginas de membros que
// eu quero gerar, quem são os membros
export const getStaticPaths : GetStaticPaths = async () => {
  const response = await fetch(`https://api.github.com/orgs/rocketseat/members`);
  const data = await response.json();
  
  // para cada membro eu vou retorna um objeto assim params: { login: member.login }
  const paths = data.map(member => {
    return { params: { login: member.login } }
  })

  return {
    paths, // quais são as páginas estáticas que eu quero gerar(uma por membro)
    fallback: true, // quando esta propriedade estiver true, quando uma pessoa
    // tentar acessar essa rota com um parâmetro(login) que não tinha antes
    // uma página já gerada de forma estática ele vai tentar procurar na API
    // para ver se existe aquela informação ou não, ou seja, ele vai gerar
    // aquela página durante o run time, ou seja, ele vai gerar uma nova página
    // estática de um dado que nem existia antes. Ele vai gerar somente quando
    // for acessado
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { login } = context.params; // dentro dos params tem o query de dentro
  // do useRouter, que são os parâmetros que vem através da rota(URL)

  const response = await fetch(`https://api.github.com/users/${login}`);
  const data = await response.json();

  return {
    props: {
      user: data,
    },
    revalidate: 10,
  }
};