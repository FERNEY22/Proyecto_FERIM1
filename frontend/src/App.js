import React, { useState } from 'react';
import API from './services/api';
import Home from './components/Home'; // Importa el componente Home

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Verifica si hay token al cargar

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            const { token, nombre, rol } = res.data;

            localStorage.setItem('token', token);
            setIsLoggedIn(true); // Cambia el estado a logueado
            setMessage(`Bienvenido, ${nombre} (${rol})`);
            console.log('Usuario logueado:', res.data);
        } catch (err) {
            setMessage('Credenciales inválidas');
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Cambia el estado a no logueado
        setMessage('Sesión cerrada');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
            {/* Si el usuario está logueado, muestra la página Home */}
            {isLoggedIn ? (
                <Home onLogout={handleLogout} />
            ) : (
                /* Si no está logueado, muestra el formulario de login */
                <>
                    <h2>FERIM – Login</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                            />
                        </div>
                        <div>
                            <label>Contraseña:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    {message && (
                        <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
                            {message}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;