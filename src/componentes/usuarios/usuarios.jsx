import React, { useState } from 'react';
import '../usuarios/usuarios.css';
import { useNavigate } from 'react-router-dom';

function Usuarios() {

    const initialFormData = {
        nombre: '',
        fechaNacimiento: '',
        sexo: '',
        otroGenero: '',
    };

    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'sexo') {
            if (value === 'otro') {
                setFormData({ ...formData, [name]: value, otroGenero: '' });
            } else {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleClick = async () => {

        
            navigate('/usuarioConsulta');

      
        
      };

    //Petición registro nuevo usuario.

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre || !formData.fechaNacimiento || !formData.sexo || (formData.sexo === 'otro' && !formData.otroGenero)) {
            setError('Por favor, complete todos los campos');
            return;
        }
        setError('');

        try {
            const url = 'http://localhost:3001/api/createUser';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            alert(data.message);
            setFormData(initialFormData);

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar el usuario');
        }
    };

    return (
        <>
            <div className='datos'>
                <h1>Registros</h1>

                <form onSubmit={handleSubmit}>
                    <label>Nombre: </label>
                    <input type='text' name='nombre' value={formData.nombre} onChange={handleInputChange} />

                    <label>Fecha de nacimiento: </label>
                    <input type='date' name='fechaNacimiento' value={formData.fechaNacimiento} onChange={handleInputChange} />

                    <label>Sexo: </label>
                    <select name='sexo' value={formData.sexo} onChange={handleInputChange}>
                        <option value='' disabled hidden>Seleccione</option>
                        <option value='masculino'>Masculino</option>
                        <option value='femenino'>Femenino</option>
                        <option value='otro'>Otro</option>
                    </select>

                    {formData.sexo === 'otro' && (
                        <input type='text' name='otroGenero' placeholder='Especifique su género' value={formData.otroGenero} onChange={handleInputChange} />
                    )}

                    <button type='submit'>Agregar</button>
                    <button onClick={handleClick}>Ver Registros</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </>
    );
}

export default Usuarios;
