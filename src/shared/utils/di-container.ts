// Contenedor de Inyección de Dependencias simple
import { HttpApiDataSource } from '../../data/datasources/ApiDataSource';
import { HttpAuthDataSource } from '../../data/datasources/AuthDataSource';
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import { GetUserUseCase } from '../../core/usecases/GetUserUseCase';
import { CheckAuthUseCase } from '../../core/usecases/CheckAuthUseCase';
import { API_CONFIG } from '../../infrastructure/api/config';

class DIContainer {
  private instances = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.instances.get(key);
    if (!factory) {
      throw new Error(`No factory registered for key: ${key}`);
    }
    return factory();
  }
}

// Instancia global del contenedor
export const container = new DIContainer();

// Registrar dependencias
container.register('apiDataSource', () => 
  new HttpApiDataSource(API_CONFIG.BASE_URL)
);

container.register('authDataSource', () => 
  new HttpAuthDataSource()
);

container.register('userRepository', () => 
  new UserRepositoryImpl(container.resolve('apiDataSource'))
);

container.register('getUserUseCase', () => 
  new GetUserUseCase(container.resolve('userRepository'))
);

container.register('checkAuthUseCase', () => 
  new CheckAuthUseCase(container.resolve('authDataSource'))
);