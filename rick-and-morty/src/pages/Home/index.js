import './home.css';

import { useEffect, useState } from 'react';
import api from '../../services/api';

import { IoStar, IoSearch, IoChevronBack, IoChevronForward } from 'react-icons/io5';

import Header from '../../components/Header';
import Filtro from '../../components/Filtro';

//COMPONENTE
export default function Home() {
  //DEFINE OS ESTADOS UTILIZADOS
  const [personagens, setPersonagens] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [filtro, setFiltro] = useState({
    nome: '',
    genero: 'None',
    especie: 'None',
    status: 'None'
  });

  //FUNÇÃO ASSÍNCRONA - CARREGA OS PERSONAGENS
  async function loadPersonagens(page) {
    const response = await api.get(`character?page=${page}`);
    setPersonagens(response.data.results.slice(0, 20));
  }

  //FUNÇÃO ASSÍNCRONA - CARREGA AS INFORMAÇÕES ADICIONAIS
  async function loadAdditionalInfo(personagem) {
    const response = await api.get(`character/${personagem.id}`);
    setAdditionalInfo(response.data);
  }

  //EFEITO COLATERAL - CARREGA OS PERSONAGENS DE ACORDO COM A PÁGINA
  useEffect(() => {
    loadPersonagens(pagina);
  }, [pagina]);

  //EFEITO COLATERAL - APLICA O FILTRO À LISTA OU PERSONAGENS SÃO ALTERADOS
  useEffect(() => {
    applyFilter();
  }, [personagens, filtro]);

  //FUNÇÃO ASSÍNCRONA - APLICA O FILTRO
  async function applyFilter() {
    const response = await api.get('character');
    const allPersonagens = response.data.results.slice(0, 20);
    const filteredPersonagens = allPersonagens.filter((personagem) => {
      const { nome, genero, especie, status } = filtro;

      const nomeMatch = nome === '' || personagem.name.includes(nome);
      const generoMatch = genero === 'None' || personagem.gender === genero;
      const especieMatch = especie === 'None' || personagem.species === especie;
      const statusMatch = status === 'None' || personagem.status === status;

      return nomeMatch && generoMatch && especieMatch && statusMatch;
    });

    setPersonagens(filteredPersonagens);
  }

  //FUNÇÃO - LIDA COM A MUDANÇA DE FILTRO 
  function handleFilterChange(newFiltro) {
    setFiltro(newFiltro);
  }

  //FUNÇÃO - ALTERNA OS DETALHES DO PERSONAGEM
  function toggleDetails(personagem) {
    setShowDetails(!showDetails);
    if (!showDetails) {
      loadAdditionalInfo(personagem);
    }
  }

  //RENDERIZAÇÃO DO COMPONENTE
  return (
    <div className="home__container">
      <Header />
      <div className="main3">
        <Filtro onFilterChange={handleFilterChange} />
        <div className="main2">
          <main>
            {personagens.map((personagem) => {
              return (
                <div
                  className={`card__container ${showDetails && additionalInfo.id === personagem.id ? 'expanded' : ''}`}
                  key={personagem.id}
                >
                  <a href={`https://rickandmortyapi.com/api/character/avatar/${personagem.id}.jpeg`} target="_blank">
                    <IoSearch />
                  </a>
                  <img src={`https://rickandmortyapi.com/api/character/avatar/${personagem.id}.jpeg`} alt={personagem.name} />
                  <h1>
                    <IoStar />
                    {personagem.name}
                  </h1>
                  <div>
                    <p>
                      Status<span>{personagem.status}</span>
                    </p>
                    <p>
                      Species<span>{personagem.species}</span>
                    </p>
                    <p>
                      Gender<span>{personagem.gender}</span>
                    </p>
                  </div>
                  {showDetails && additionalInfo.id === personagem.id && (
                    <div>
                      <p>
                        Type<span>{additionalInfo.type}</span>
                      </p>
                      <p>
                        Origin<span>{additionalInfo.origin.name.split(' ')[0]}</span>
                      </p>
                      <p>
                        Location<span>{additionalInfo.location.name.split(' ').slice(0, 2).join(' ')}{additionalInfo.location.name.split(' ').length > 2 ? ' ...' : ''}</span></p>
                    </div>
                  )}
                  <button onClick={() => toggleDetails(personagem)}>
                    {showDetails && additionalInfo.id === personagem.id ? 'Mostrar menos informações' : 'Mostrar mais informações'}
                  </button>
                </div>
              );
            })}
          </main>
          <div className="pagination">
            <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
              <IoChevronBack />
            </button>
            <button onClick={() => setPagina(pagina + 1)} disabled={pagina === 42}>
              <IoChevronForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
