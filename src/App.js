import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Certifique-se de que este arquivo CSS existe e está correto

function App() {
  const [bairros, setBairros] = useState({});
  const [pontosTuristicos, setPontosTuristicos] = useState({});
  const [selectedOrigem, setSelectedOrigem] = useState('');
  const [selectedDestinos, setSelectedDestinos] = useState([]);
  const [mapHtml, setMapHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [numDestinos, setNumDestinos] = useState(1);

  // IMPORTANTE: Este URL DEVE CORRESPONDER EXATAMENTE ao endereço do seu FastAPI!
  const API_BASE_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      console.log('Dados recebidos do FastAPI:', response.data);
      setBairros(response.data.bairros);
      setPontosTuristicos(response.data.pontos_turisticos);
    } catch (err) {
      console.error('Erro ao buscar dados do FastAPI:', err);
      let errorMessage = 'Falha ao carregar dados dos bairros e pontos turísticos. Verifique se o servidor FastAPI está online na porta 5000 e se o CORS está configurado.';
      if (err.response && err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOrigemChange = (event) => {
    setSelectedOrigem(event.target.value);
  };

  const handleDestinoChange = (index, event) => {
    const newDestinos = [...selectedDestinos];
    newDestinos[index] = event.target.value;
    setSelectedDestinos(newDestinos);
  };

  const handleNumDestinosChange = (event) => {
    const num = parseInt(event.target.value, 10);
    if (num >= 1 && num <= 3) {
      setNumDestinos(num);
      setSelectedDestinos(Array(num).fill(''));
    } else {
      alert('Por favor, escolha entre 1 e 3 pontos turísticos.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMapHtml('');

    if (!selectedOrigem) {
      setError('Por favor, selecione um bairro de origem.');
      setLoading(false);
      return;
    }
    if (selectedDestinos.length === 0 && numDestinos > 0) {
        setError('Por favor, selecione pelo menos um ponto turístico.');
        setLoading(false);
        return;
    }
    if (selectedDestinos.some(d => !d)) {
        setError('Por favor, preencha todos os campos de pontos turísticos.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/calculate_route`, {
        origem_id: parseInt(selectedOrigem),
        destino_ids: selectedDestinos.map(id => parseInt(id)),
      }, {
        responseType: 'text',
      });
      setMapHtml(response.data);
      console.log("Mapa HTML recebido com sucesso!");

    } catch (err) {
      console.error('Erro ao calcular rota:', err);
      let errorMessage = 'Erro ao calcular a rota. Verifique sua conexão ou tente seleções diferentes.';

      if (axios.isAxiosError(err) && err.response) {
          console.error('Resposta de erro do servidor:', err.response.data);
          if (typeof err.response.data === 'object' && err.response.data.detail) {
              errorMessage = err.response.data.detail;
          } else if (typeof err.response.data === 'string') {
              errorMessage = err.response.data;
          } else {
              errorMessage = `Erro do servidor: ${err.response.status} - ${err.response.statusText}`;
          }
      } else if (err.request) {
          errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend FastAPI está rodando.';
      } else {
          errorMessage = `Erro inesperado: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Kapitour</h1>

      {loading && <p>Carregando dados e calculando rota...</p>}
      {error && <p className="error">{error}</p>}

      {/* Container principal para o layout condicional */}
      <div className={`main-content ${mapHtml ? 'map-layout-active' : ''}`}>
        {/* Painel de Opções (Formulário) - Sempre visível */}
        <div className="options-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="origem-select">Escolha seu bairro de origem:</label>
              <select id="origem-select" value={selectedOrigem} onChange={handleOrigemChange} required>
                <option value="">-- Selecione --</option>
                {Object.entries(bairros).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="num-destinos">Quantos pontos deseja visitar (1-3)?</label>
              <input
                type="number"
                id="num-destinos"
                min="1"
                max="3"
                value={numDestinos}
                onChange={handleNumDestinosChange}
                required
              />
            </div>

            {[...Array(numDestinos)].map((_, index) => (
              <div key={index} className="form-group">
                <label htmlFor={`destino-select-${index}`}>Escolha o ponto turístico {index + 1}:</label>
                <select
                  id={`destino-select-${index}`}
                  value={selectedDestinos[index] || ''}
                  onChange={(e) => handleDestinoChange(index, e)}
                  required
                >
                  <option value="">-- Selecione --</option>
                  {Object.entries(pontosTuristicos).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            ))}

            <button type="submit" disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular Rota'}
            </button>
          </form>
        </div>

        {/* Painel de Exibição do Mapa - Visível apenas quando mapHtml tem conteúdo */}
        {mapHtml && (
          <div className="map-display-panel">
            <h2>Sua Rota</h2>
            <iframe
              title="Mapa da Rota"
              srcDoc={mapHtml}
              width="100%"
              height="600px"
              frameBorder="0"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;