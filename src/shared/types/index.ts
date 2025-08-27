// Tipos base de la aplicación
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Tipos de error
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Tipos de navegación
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  // Agregar más rutas según necesidad
};