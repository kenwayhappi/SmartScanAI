import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/firebase";

export const getMaladies = async () => {
  try {
    const q = query(collection(db, "maladies"));
    const querySnapshot = await getDocs(q);
    const maladies = [];
    querySnapshot.forEach((doc) => {
      maladies.push({ id: doc.id, ...doc.data() });
    });
    return maladies;
  } catch (error) {
    console.error("Erreur lors de la récupération des maladies:", error);
    return [];
  }
};

export const getBonnesPratiques = async () => {
  try {
    const q = query(collection(db, "bonnes_pratiques"));
    const querySnapshot = await getDocs(q);
    const pratiques = [];
    querySnapshot.forEach((doc) => {
      pratiques.push({ id: doc.id, ...doc.data() });
    });
    return pratiques;
  } catch (error) {
    console.error("Erreur lors de la récupération des bonnes pratiques:", error);
    return [];
  }
};
