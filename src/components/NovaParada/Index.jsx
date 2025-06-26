import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import SelectAo from './Select/Index';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/Api/Api';

const estadoInicialForm = {
  prefixo: '',
  sb: '',
  dataInicio: '',
  dataFim: '',
  tempo: '',
  usuario: ''
};

const estadoInicialResultado = {
  tempo: '',
  minutos: '',
  horasDecimal: '',
  horasFormatado: ''
};

const NovaParada = () => {
  const { numOs } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(estadoInicialForm);
  const [resultado, setResultado] = useState(estadoInicialResultado);
  const [os, setOs] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parada = {
      sbId: parseInt(formData.sb),
      idTrem: os ? os[0].idTrem : null,
      DataInicio: formData.dataInicio,
      DataFim: formData.dataFim,
      Tempo: resultado.minutos ? parseInt(resultado.minutos) : 0,
      Usuario: formData.usuario
    };

    try {
      const response = await api.post('/api/Paradas/inserir', parada);
      console.log('Resposta do servidor:', response.data);
      alert('Parada salva com sucesso!');

      // Limpa os dados
      setFormData(estadoInicialForm);
      setResultado(estadoInicialResultado);

      // Redireciona para a página principal
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar parada:', error);
      alert('Erro ao salvar parada. Veja o console.');
    }
  };

  useEffect(() => {
    if (!numOs) return;

    const fetchData = async () => {
      try {
        const { data } = await api.get(`api/Paradas/Area_Operacional?os=${numOs}`);
        setOs(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [numOs]);

  const calcularTempoParada = (inicioStr, fimStr) => {
    const inicio = new Date(inicioStr);
    const fim = new Date(fimStr);
    const diff = fim - inicio;

    if (isNaN(diff)) return { tempo: 'Datas inválidas.' };
    if (diff < 0) return { tempo: 'Data final menor que a inicial.' };

    const tempo = Math.floor(diff / 60000);
    const horasDecimal = (tempo / 60).toFixed(2);
    const horasInt = Math.floor(tempo / 60);
    const minutosRest = tempo % 60;
    const horasFormatado = `${String(horasInt).padStart(2, '0')}:${String(minutosRest).padStart(2, '0')}`;

    return { tempo: String(tempo), minutos: String(tempo), horasDecimal, horasFormatado };
  };

  useEffect(() => {
    const { dataInicio, dataFim } = formData;
    if (dataInicio && dataFim) {
      setResultado(calcularTempoParada(dataInicio, dataFim));
    } else {
      setResultado(estadoInicialResultado);
    }
  }, [formData.dataInicio, formData.dataFim, formData]);

  return (
    <div className={styles.container}>
      <div className={styles.header_styles}>
        <div className={styles.span_style}>
          <div className={styles.accordion_style}>
            <h2>Cadastro de Parada</h2>
            <form onSubmit={handleSubmit} className={styles.form_style}>
              <div className={styles.label_style}>
                <div>
                  <label>Prefixo:</label>
                  {os && os.length > 0 && (
                    <div>
                      <input name="prefixo" value={os[0].prfTrem} onChange={handleChange} readOnly disabled />
                    </div>
                  )}
                </div>
                <div>
                  <label>Area Operacional:</label>
                  <SelectAo  Os={numOs} value={formData.sb} onChange={(e) => setFormData((prev) => ({ ...prev, sb: e.target.value }))} />
                </div>
                <div>
                  <label>Data Início:</label>
                  <input type="datetime-local" name="dataInicio" value={formData.dataInicio} onChange={handleChange} />
                </div>
                <div>
                  <label>Data Fim:</label>
                  <input type="datetime-local" name="dataFim"value={formData.dataFim} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.label_style}>
                <div>
                  <label>Tempo (min):</label>
                  <input name="tempo" value={resultado.tempo} readOnly disabled />
                </div>
                <div>
                  <label>Usuário:</label>
                  <input name="usuario" value={formData.usuario} onChange={handleChange} placeholder="Chave de acesso"/>
                </div>
                {resultado.horasFormatado && (
                  <div>
                    <label>Hora(s) Parada:</label>
                    <span>{resultado.horasFormatado}</span>
                  </div>
                )}
                <div>
                  <button type="submit" className={styles.btn_styles}>Salvar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaParada;
