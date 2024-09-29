const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: [],
            coaches: []
        },
        actions: {
            getSmokers: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`);
                    const data = await response.json();
                    setStore({ smokers: data }); 
                } catch (error) {
                    console.error("Error fetching smokers:", error);
                }
            },

            createSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });

                    if (response.ok) {
                        const newSmoker = await response.json();
                        setStore({ smokers: [...getStore().smokers, newSmoker] }); // Añadimos el nuevo fumador a la lista
                    }
                } catch (error) {
                    console.error("Error creating smoker:", error);
                }
            },

            updateSmoker: async (smokerId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers/${smokerId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        const updatedSmoker = await response.json();
                        const smokers = getStore().smokers.map(smoker =>
                            smoker.id === smokerId ? updatedSmoker : smoker
                        );
                        setStore({ smokers }); // Actualizamos la lista de fumadores
                    }
                } catch (error) {
                    console.error("Error updating smoker:", error);
                }
            },

            deleteSmoker: async (smokerId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers/${smokerId}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        const smokers = getStore().smokers.filter(smoker => smoker.id !== smokerId);
                        setStore({ smokers }); // Actualizamos la lista de fumadores
                    }
                } catch (error) {
                    console.error("Error deleting smoker:", error);
                }
            },

            getConsuming: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`);
                    const data = await response.json();
                    setStore({ tiposConsumo: data }); 
                } catch (error) {
                    console.error("Error fetching tiposconsumo:", error);
                }
            },

            createConsuming: async (consumingData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(consumingData),
                    });

                    if (response.ok) {
                        const newConsuming = await response.json();
                        setStore({ tiposConsumo: [...getStore().tiposConsumo, newConsuming] });
                    }
                } catch (error) {
                    console.error("Error creating consuming:", error);
                }
            },

            updateConsuming: async (consumingId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo/${consumingId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });
            
                    if (response.ok) {
                        const updatedConsuming = await response.json();
                        const updatedTiposConsumo = getStore().tiposConsumo.map(consuming =>
                            consuming.id === consumingId ? updatedConsuming : consuming
                        );
                        setStore({ tiposConsumo: updatedTiposConsumo }); 
                    }
                } catch (error) {
                    console.error("Error updating consuming:", error);
                }
            },
            
            deleteConsuming: async (consumingId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo/${consumingId}`, {
                        method: "DELETE",
                    });
            
                    if (response.ok) {
                        const updatedTiposConsumo = getStore().tiposConsumo.filter(consuming => consuming.id !== consumingId);
                        setStore({ tiposConsumo: updatedTiposConsumo });
                    }
                } catch (error) {
                    console.error("Error deleting consuming:", error);
                }
            },

            // Acciones para Coaches
            getCoaches: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`);
                    const data = await response.json();
                    setStore({ coaches: data }); 
                } catch (error) {
                    console.error("Error fetching coaches:", error);
                }
            },

            createCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    if (response.ok) {
                        const newCoach = await response.json();
                        setStore({ coaches: [...getStore().coaches, newCoach] });
                    }
                } catch (error) {
                    console.error("Error creating coach:", error);
                }
            },

            updateCoach: async (coachId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedData),
                    });
            
                    if (response.ok) {
                        const updatedCoach = await response.json();
                        const updatedCoaches = getStore().coaches.map(coach =>
                            coach.id === coachId ? updatedCoach : coach
                        );
                        setStore({ coaches: updatedCoaches }); 
                    }
                } catch (error) {
                    console.error("Error updating coach:", error);
                }
            },

            deleteCoach: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                        method: "DELETE",
                    });
            
                    if (response.ok) {
                        const updatedCoaches = getStore().coaches.filter(coach => coach.id !== coachId);
                        setStore({ coaches: updatedCoaches });
                    }
                } catch (error) {
                    console.error("Error deleting coach:", error);
                }
            },
        },
    };
};

export default getState;

