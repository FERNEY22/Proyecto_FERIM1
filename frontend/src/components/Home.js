import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Home = ({ onLogout }) => {
    const [properties, setProperties] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);

    useEffect(() => {
        // Obtener propiedades
        const fetchProperties = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await API.get('/properties');
                setProperties(response.data);
            } catch (err) {
                console.error('Error al obtener propiedades:', err);
            }
        };

        // Obtener solicitudes de mantenimiento
        const fetchMaintenanceRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await API.get('/maintenance');
                setMaintenanceRequests(response.data);
            } catch (err) {
                console.error('Error al obtener solicitudes de mantenimiento:', err);
            }
        };

        fetchProperties();
        fetchMaintenanceRequests();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h2>Bienvenido a FERIM</h2>
            <button onClick={onLogout} style={{ marginBottom: '1rem', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                Cerrar Sesión
            </button>

            <h3>Propiedades</h3>
            {properties.length === 0 ? (
                <p>No hay propiedades disponibles.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {properties.map(prop => (
                        <li key={prop._id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                            <strong>{prop.titulo}</strong><br />
                            {prop.descripcion}<br />
                            Precio: ${prop.precio}<br />
                            Tipo: {prop.tipo}<br />
                            Ubicación: {prop.ubicacion.coordinates[1]}, {prop.ubicacion.coordinates[0]}<br />
                            Propietario: {prop.propietario?.nombre} {prop.propietario?.apellido}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Solicitudes de Mantenimiento</h3>
            {maintenanceRequests.length === 0 ? (
                <p>No hay solicitudes de mantenimiento pendientes.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {maintenanceRequests.map(req => (
                        <li key={req._id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                            <strong>{req.titulo}</strong><br />
                            {req.descripcion}<br />
                            Tipo de Falla: {req.tipoFalla}<br />
                            Estado: {req.estado}<br />
                            Propiedad: {req.propiedad?.titulo}<br />
                            Solicitante: {req.solicitante?.nombre} {req.solicitante?.apellido}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;