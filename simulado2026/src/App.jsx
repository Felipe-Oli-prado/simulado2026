import { useState } from 'react'
import { dadosClima } from './DadosClima'
import { codigosWmo } from './CodigosWmo'
import './App.css'

function App() {
  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState(dadosClima[0])
  const [mensagem, setMensagem] = useState('')

  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  function buscar(nomeChip) {
    const texto = typeof nomeChip === 'string' ? nomeChip : busca

    if (!texto || texto.trim() === '') {
      setMensagem('Digite o nome de uma cidade para buscar.')
      return
    }

    const encontrada = dadosClima.find(
      item => item.name.toLowerCase() === texto.trim().toLowerCase()
    )

    if (encontrada) {
      setCidade(encontrada)
      setMensagem('')
      setBusca(encontrada.name)
    } else {
      setMensagem('Cidade não encontrada.')
    }
  }

  function pegarClima(codigo) {
    return codigosWmo.find(item => item.codigo === codigo) || { descricao: 'Nublado', icone: '☁️' }
  }

  function nomeDoDia(dataTexto, index) {
    if (index === 0) return 'Hoje'
    if (index === 1) return 'Amanhã'
    const data = new Date(dataTexto + 'T00:00:00')
    return diasSemana[data.getDay()]
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <img src="./src/assets/icons/solchuva.svg" alt="Sol Chuva" />
        <h1>Sol Chuva</h1>
      </header>

      <div className="area-busca">
        <input
          list="sugestoes"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Digite o nome de uma cidade..."
        />
        <datalist id="sugestoes">
          {dadosClima.map(item => (
            <option key={item.id} value={item.name} />
          ))}
        </datalist>

        <button onClick={() => buscar()}>Buscar</button>
      </div>

      {mensagem && <p className="aviso">{mensagem}</p>}

      <div className="chips">
        {dadosClima.map(item => (
          <button key={item.id} onClick={() => buscar(item.name)}>
            {item.name}
          </button>
        ))}
      </div>

      {cidade && (
        <div className="resultado">
          <div className="card-atual">
            <div>
              <h2>{cidade.name}</h2>
              <p className="local">{cidade.admin1} - {cidade.country}</p>

              <div className="temperatura-atual">
                <span className="icone">{pegarClima(cidade.current.weather_code).icone}</span>
                <span className="graus">{cidade.current.temperature_2m}°C</span>
                <span>{pegarClima(cidade.current.weather_code).descricao}</span>
              </div>
            </div>

            <div className="indicadores">
              <p>Sensação: <strong>{cidade.current.apparent_temperature}°C</strong></p>
              <p>Umidade: <strong>{cidade.current.relative_humidity_2m}%</strong></p>
              <p>Vento: <strong>{cidade.current.wind_speed_10m} km/h</strong></p>
              <p>Precipitação: <strong>{cidade.current.precipitation} mm</strong></p>
              <p>Índice UV: <strong>{cidade.current.uv_index}</strong></p>
              <p>Nascer do sol: <strong>{cidade.current.sunrise}</strong></p>
              <p>Pôr do sol: <strong>{cidade.current.sunset}</strong></p>
            </div>
          </div>

          <h3>Previsão para os próximos 10 dias</h3>
          <div className="grade-dias">
            {cidade.daily.map((dia, index) => {
              const climaDia = pegarClima(dia.weather_code)
              const partesData = dia.date.split('-')
              const dataFormatada = `${partesData[2]}/${partesData[1]}`

              return (
                <div key={dia.date} className="card-dia">
                  <strong>{nomeDoDia(dia.date, index)}</strong>
                  <span>{dataFormatada}</span>
                  <span className="icone-dia">{climaDia.icone}</span>
                  <p>{climaDia.descricao}</p>
                  <p>
                    <strong>{dia.temperature_2m_max}°</strong> / {dia.temperature_2m_min}°
                  </p>
                  <span className="chuva">Chuva: {dia.precipitation_probability_max}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default App