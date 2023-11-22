import React, { useState, useEffect } from 'react';
import '../usuarioConsulta/usuarioConsulta.css'

function UsuarioConsulta() {
    const [usuarios, setUsuarios] = useState([]);
    const [updatedUserData, setUpdatedUserData] = useState({
        id: null,
        nombre: '',
        fechaNacimiento: '',
        sexo: '',
    });
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const handleUpdate = (userId) => {
        const userToUpdate = usuarios.find(user => user.id === userId);
        setUpdatedUserData({
            id: userToUpdate.id,
            nombre: userToUpdate.nombre,
            fechaNacimiento: userToUpdate.fechaNacimiento || '', 
            sexo: userToUpdate.sexo,
        });
        setShowUpdateForm(true);
    }

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData({ ...updatedUserData, [name]: value });
    };

    const handleCancelUpdate = () => {
        setShowUpdateForm(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
    
        const isFormValid = Object.values(updatedUserData).every(value => value !== '');
    
        if (!isFormValid) {
            alert('Por favor, complete todos los campos');
            return;
        }
    
        try {
            const url = `http://localhost:3001/api/updateUser/${updatedUserData.id}`;
            const response = await fetch(url, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });
    
            const data = await response.json();
            alert(data.message);
            setShowUpdateForm(false);
            fetchUsuarios(); 
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Hubo un error al actualizar el usuario');
        }
    };
    
        
    const handleDelete = async (userId) => {
            try {
                const url = `http://localhost:3001/api/deleteUser/${userId}`;
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                const data = await response.json();
                alert(data.message); 
                fetchUsuarios(); 
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al eliminar el usuario');
            }
        };
    

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const fetchUsuarios = async () => {
        try {
            const url = 'http://localhost:3001/api/getUsers';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            console.log('usuarios: ', data);
            if (Array.isArray(data) && Array.isArray(data[0])) {
                const usersWithFormattedDates = data[0].map(user => ({
                    ...user,
                    fechaNacimiento: user.fechaNacimiento || null, 
                }));
                setUsuarios(usersWithFormattedDates);
            } else {
                setUsuarios([]);
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al Obtener los usuarios');
        }
    };
    
    useEffect(() => {
        fetchUsuarios(); 
    }, []);

    return (
        <>
            <h1>Consultas</h1>
            {showUpdateForm && (
                <div>
                    <h2>Actualizar Usuario</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>Nombre: </label>
                        <input type='text' name='nombre' value={updatedUserData.nombre} onChange={handleUpdateInputChange} />

                        <label>Fecha de nacimiento: </label>
                        <input type='date' name='fechaNacimiento' value={updatedUserData.fechaNacimiento} onChange={handleUpdateInputChange} />

                        <label>Sexo: </label>
                        <select name='sexo' value={updatedUserData.sexo} onChange={handleUpdateInputChange}>
                            <option value='' disabled hidden>Seleccione</option>
                            <option value='masculino'>Masculino</option>
                            <option value='femenino'>Femenino</option>
                            <option value='otro'>Otro</option>
                        </select>

                        <button type='submit'>Guardar</button>
                        <button onClick={handleCancelUpdate}>Cancelar</button>
                    </form>
                </div>
            )}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr className="table-header">
                            <th className="table-cell">Nombre</th>
                            <th className="table-cell">Fecha de Nacimiento</th>
                            <th className="table-cell">Sexo</th>
                            <th className="table-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} className="table-row">
                                <td className="table-cell">{usuario.nombre}</td>
                                <td className="table-cell">
                                    {usuario.fecha ? formatDate(usuario.fecha) : '-'}
                                </td>
                                <td className="table-cell">{usuario.sexo}</td>
                                <td className="table-cell">
                                    <button className="action-button" onClick={() => handleUpdate(usuario.id)}>Actualizar</button>
                                    <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default UsuarioConsulta;
