/**
 * User entity — простий plain DTO describing returned user shape.
 * Не містить пароля/refreshToken при поверненні користувача (повертай тільки потрібні поля).
 */

export class UserEntity {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
