/**
 * PostEntity — plain entity for responses (used to type return shapes).
 */

export class PostEntity {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
