// src/utils/errorHandler.ts
export class DatabaseError extends Error {
    constructor(message: string, public originalError?: any) {
      super(message);
      this.name = 'DatabaseError';
    }
  }
  
  export const handleDatabaseError = (error: any): DatabaseError => {
    console.error('Database error:', error);
    
    switch (error.code) {
      case '23505': // Unique violation
        return new DatabaseError('Дублирование записи');
      case '23503': // Foreign key violation
        return new DatabaseError('Неверная ссылка');
      case '08000': // Connection error
      case '08006': // Connection failure
        return new DatabaseError('Ошибка подключения к базе данных');
      default:
        return new DatabaseError('Произошла ошибка базы данных');
    }
  };