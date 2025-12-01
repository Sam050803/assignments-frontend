export class Assignment {
    _id?: string;  // ID MongoDB (ObjectId) - optionnel car créé par MongoDB
    id!: number;   // ID personnalisé utilisé pour la navigation
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean;
}