import React, { useState } from 'react';
import style from '../Home/styled.module.css';
import Trem from '../../components/Trem/Index';

// Campo de entrada
function Input({ label, name, value, onChange, onKeyPress }) {
    return (
        <div className={style.input}>
            <label htmlFor={name}>{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyPress}
            />
        </div>
    );
}

// Botão reutilizável
function Button({ onClick, children }) {
    return (
        <button className={style.btn_styles} onClick={onClick} aria-label="Pesquisar">
            {children}
        </button>
    );
}

// Componente principal
function Formulario() {
    const [numOs, setNumOs] = useState('');
    const [dadosEnviados, setDadosEnviados] = useState(null);

    const handleChange = (e) => setNumOs(e.target.value);
    
    const handleSubmit = () => {
        const osTrimmed = numOs.trim();
        if (osTrimmed) {
            setDadosEnviados(osTrimmed);
            setNumOs('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div className={style.container}>
            <div className={style.form_style}>
                <h2>Justificar Paradas Trem</h2>
                <Input
                    label="Número OS"
                    name="numOs"
                    value={numOs}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSubmit}>Pesquisar</Button>
            </div>

            {dadosEnviados && (
                <div className={style.resultado}>
                    <Trem service={dadosEnviados} />
                </div>
            )}
        </div>
    );
}

export default Formulario;
