import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import styles from './style.module.css';
import api from '../Services/Api/Api';
import { NavLink } from 'react-router-dom';

function ParadasTrem({ service }) {
    const [trens, setTrens] = useState([]);
    const [justificativa, setJustificativa] = useState({});
    const [currentAccordion, setCurrentAccordion] = useState(null);
    const [movimentacoes, setMovimentacoes] = useState({});

    useEffect(() => {
        if (!service) return;

        const fetchData = async () => {
            try {
                const { data } = await api.get(`api/Paradas/todas?os=${service}`);
                setTrens(data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, [service]);

    useEffect(() => {
        const fetchMovimentacoes = async () => {
            try {
                const promessas = trens
                    .filter((trem) => trem.local)
                    .map(async (trem) => {
                        const { data } = await api.get(`/api/MovimentacaoTrem/Areaoperacional?os=${service}&ao=${trem.local}`);
                        const movimentacao = Array.isArray(data) && data.length > 0 ? data[0] : null;
                        return { key: `${service}-${trem.local}`, data: movimentacao };
                    });

                const resultados = await Promise.all(promessas);

                const dados = {};
                resultados
                    .filter((item) => item && item.data)
                    .forEach(({ key, data }) => {
                        dados[key] = data;
                    });

                setMovimentacoes(dados);
            } catch (error) {
                console.error("Erro ao buscar movimentações:", error);
            }
        };

        if (service && trens.length > 0) {
            fetchMovimentacoes();
        }
    }, [service, trens]);

    const handleAccordionClick = async (paradaId) => {
        setCurrentAccordion((prev) => (prev === paradaId ? null : paradaId));

        if (!justificativa[paradaId]) {
            try {
                const { data } = await api.get(`api/Justificativa?paradaId=${paradaId}`);
                setJustificativa((prev) => ({ ...prev, [paradaId]: data }));
            } catch (error) {
                console.error('Erro ao buscar justificativa:', error);
            }
        }
    };

    const handleDeleteParada = async (paradaId) => {
        if (!window.confirm("Deseja realmente excluir esta parada?")) return;

        try {
            await api.delete(`api/Paradas/${paradaId}`);
            alert("Parada excluída com sucesso!");
            setTrens((prev) => prev.filter((t) => t.paradaId !== paradaId));
        } catch (error) {
            console.error("Erro ao excluir parada:", error);
            alert("Erro ao excluir parada. Tente novamente.");
        }
    };

    const formatDate = (date) => (date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "Não informado");

    return (
        <div className={styles.container}>
            <div className={styles.button_Styles}>
                <NavLink to={`/novaParada/${service}`} className={styles.btn_styles}>Nova Parada</NavLink>
            </div>

            {trens.map((trem) => {
                const chave = `${service}-${trem.local}`;
                const movimentacao = movimentacoes[chave] || {};

                return (
                    <div key={trem.paradaId}>
                        <div className={styles.header_style}>
                            <div className={styles.span_style}>
                                <div className={styles.accordion_style}>
                                    {[ 
                                        { label: "Local", value: trem.local },
                                        { label: "Responsável", value: trem.usuarioResponsavel },
                                        { label: "Início da Movimentação", value: formatDate(movimentacao.inicioMovimentacao) },
                                        { label: "Início da Parada", value: formatDate(trem.dataInicio) },
                                        { label: "Fim da Parada", value: formatDate(trem.dataFim) },
                                        { label: "Fim da Movimentação", value: formatDate(movimentacao.fimMovimentacao) },
                                        { label: "Total da Parada", value: `${trem.tempo} min` }
                                    ].map(({ label, value }) => (
                                        <div key={label} className={styles.label_style}>
                                            <div>
                                                <label>{label}</label>
                                                <span className={styles.spanAutoWidth}>{value}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className={styles.label_style}>
                                        <label>Ações</label>
                                        <span className={styles.icon_group}>
                                            <NavLink to={`/editparadas/${trem.paradaId}`}>
                                                <FaEdit className={styles.icon_style} />
                                            </NavLink>
                                            <span onClick={() => handleDeleteParada(trem.paradaId)} className={styles.icon_button}>
                                                <FaTrash className={styles.icon_style} />
                                            </span>
                                        </span>
                                    </div>

                                    <button
                                        className={styles.btn_styles}
                                        onClick={() => handleAccordionClick(trem.paradaId)}
                                    >
                                        {currentAccordion === trem.paradaId ? "Fechar" : "Justificativa"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {currentAccordion === trem.paradaId && (
                            <div className={styles.table_style}>
                                <table className="table table-success table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Motivo</th>
                                            <th>Data Início</th>
                                            <th>Data Fim</th>
                                            <th>Tempo Justificativa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {justificativa[trem.paradaId]?.length ? (
                                            justificativa[trem.paradaId].map((item) => (
                                                <tr key={item.justificativaId}>
                                                    <td>{item.motivo}</td>
                                                    <td>{formatDate(item.dataInicio)}</td>
                                                    <td>{formatDate(item.dataFim)}</td>
                                                    <td>{item.tempoMin} min</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">
                                                    {justificativa[trem.paradaId]
                                                        ? "Nenhuma justificativa encontrada."
                                                        : "Buscando justificativa..."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default ParadasTrem;
