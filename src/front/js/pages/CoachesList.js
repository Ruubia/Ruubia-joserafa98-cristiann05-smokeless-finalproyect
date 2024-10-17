import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/DasboardSmoker/Sidebar"; 
import Header from "../component/DasboardSmoker/Header"; 

const CoachesList = () => {
    const { store, actions } = useContext(Context);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchCity, setSearchCity] = useState(""); 
    const [isDarkMode, setIsDarkMode] = useState(true); 
    const [displayCount, setDisplayCount] = useState(8); // Número inicial de coaches a mostrar
    const coachesPerLoad = 4; // Coaches a cargar al hacer clic en "Ver Más"
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await actions.getAllCoaches(); 
            await actions.getAllSolicitudes(); 
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const formatFecha = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const fechaSolicitud = formatFecha(new Date());

    const handleAddCoach = async (coachId) => {
        const userId = localStorage.getItem('userId'); 
        if (!userId) {
            setAlertMessage("Error: Usuario no autenticado.");
            return;
        }

        await actions.getAllSolicitudes(); 

        const existingRequest = store.solicitudes.find(solicitud => {
            return (
                solicitud.id_coach === coachId &&
                solicitud.id_usuario === userId &&
                !solicitud.estado &&
                solicitud.fecha_respuesta === null 
            );
        });

        if (existingRequest) {
            setAlertMessage("Ya has solicitado este coach. No puedes volver a solicitarlo.");
            return; 
        }

        const fechaSolicitud = new Date().toLocaleDateString('es-ES'); 
        const solicitudData = {
            id_usuario: userId,
            id_coach: coachId,
            fecha_solicitud: fechaSolicitud,
            estado: false,
            fecha_respuesta: null,
            comentarios: 'Estoy interesado en el coaching',
        };

        try {
            await actions.addSolicitud(solicitudData);
            setAlertMessage("Solicitud enviada exitosamente!");
            await actions.getAllSolicitudes(); 
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            setAlertMessage("Hubo un fallo al enviar la solicitud.");
        }
    };

    const handleViewProfile = (coachId) => {
        navigate(`/Dashboard-Smoker/coach-profile/${coachId}`);
    };

    const filteredCoaches = store.coaches
        .filter(coach => {
            return coach.nombre_coach && coach.genero_coach && coach.direccion && coach.nacimiento_coach;
        })
        .filter(coach => {
            const hasRequest = store.solicitudes.some(solicitud => {
                return (
                    solicitud.id_coach === coach.id &&
                    solicitud.id_usuario === localStorage.getItem('userId') &&
                    (solicitud.fecha_respuesta === null || solicitud.estado === false) 
                );
            });
            return !hasRequest; 
        })
        .filter(coach => {
            return coach.direccion.toLowerCase().includes(searchCity.toLowerCase());
        });

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); 
    };

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + coachesPerLoad); 
    };

    const currentCoaches = filteredCoaches.slice(0, displayCount); 

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <Sidebar active="Lista de Coaches" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} />

            <div className="md:ml-64 flex-1">
                <Header onLogout={() => actions.logoutsmoker()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> 

                <div className="user-main-content p-6"> 
                    {alertMessage && (
                        <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                            {alertMessage}
                        </div>
                    )}
                    <h1 className="text-center text-3xl font-bold mb-4">Coaches Disponibles</h1>

                    <div className="flex justify-center mb-4">
                        <input
                            type="text"
                            id="searchCity"
                            className="form-control w-1/2 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Buscar por Ciudad"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)} 
                        />
                    </div>

                    {isLoading ? (
                        <p className="text-center text-light">Cargando datos...</p>
                    ) : currentCoaches.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentCoaches.map((coach) => (
                                <div
                                    className="coach-card relative transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gray-800 text-white rounded-lg shadow-md mt-4 overflow-hidden"
                                    key={coach.id}
                                >
                                    <div className="relative w-full h-48">
                                        <img
                                            src={coach.public_id || "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"}
                                            className="w-full h-full object-cover object-center"
                                            alt={`${coach.nombre_coach}'s profile picture`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 hover:opacity-80 transition duration-300"></div>
                                        <div className="absolute bottom-2 left-2 text-white">
                                            <h3 className="text-lg font-semibold">{coach.nombre_coach || "Nombre no disponible"}</h3>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center text-gray-400 mb-2">
                                            <i className="bi bi-person-fill mr-2"></i>
                                            <span>{coach.genero_coach || "Género no disponible"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <i className="bi bi-geo-alt-fill mr-2"></i>
                                            <span>{coach.direccion || "Dirección no disponible"}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between p-4">
                                        <button className="btn btn-outline-light w-1/2 mr-2" onClick={() => handleAddCoach(coach.id)}>
                                            <i className="bi bi-plus mr-2"></i> Add Coach
                                        </button>
                                        <button className="btn btn-light w-1/2" onClick={() => handleViewProfile(coach.id)}>
                                            <i className="bi bi-eye mr-2"></i> View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light">No hay coaches disponibles en esta ciudad.</p>
                    )}

                    {/* Aquí es donde se muestra el botón "Ver Más" */}
                    {filteredCoaches.length > displayCount && (
                        <div className="text-center mt-4">
                            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200" onClick={loadMore}>
                                Ver Más
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .coach-card {
                    border-radius: 0.5rem;
                    overflow: hidden;
                    background-color: #1f2937;
                    transition: transform 0.3s, box-shadow 0.3s;
                    margin-top: 15px; 
                }
                .coach-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.3); 
                }
                .coach-card img {
                    transition: opacity 0.3s;
                    object-fit: cover; 
                    object-position: center; 
                }
                .coach-card:hover img {
                    opacity: 0.85; 
                }
            `}</style>
        </div>
    );
};

export default CoachesList;
