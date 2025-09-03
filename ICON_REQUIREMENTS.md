# Easy Gift - Especificaciones de Iconos

## Iconos Requeridos para TestFlight/App Store

### 1. Ícono Principal de la App
**Archivo:** `assets/images/icon.png`
- **Tamaño:** 1024x1024 pixels
- **Formato:** PNG
- **Fondo:** Sólido (sin transparencia)
- **Diseño:** Representativo de "Easy Gift" - lavado de autos

### 2. Ícono Adaptativo (Android)
**Archivo:** `assets/images/adaptive-icon.png`
- **Tamaño:** 1024x1024 pixels
- **Formato:** PNG
- **Zona Segura:** 664x664 pixels centrados
- **Fondo:** Puede ser transparente

### 3. Ícono de Splash Screen
**Archivo:** `assets/images/splash-icon.png`
- **Tamaño:** 1024x1024 pixels (o más pequeño)
- **Formato:** PNG
- **Fondo:** Transparente preferible

### 4. Favicon (Web)
**Archivo:** `assets/images/favicon.png`
- **Tamaño:** 48x48 pixels
- **Formato:** PNG

## Sugerencias de Diseño para "Easy Gift"

### Elementos Visuales Recomendados:
1. **Carro/Auto**: Silueta o contorno de un automóvil
2. **Elementos de Limpieza**: 
   - Gotas de agua
   - Burbujas de jabón
   - Esponjas o cepillos
3. **Colores del Brand**:
   - Azul primario: `#4285F4`
   - Blanco: `#FFFFFF`
   - Colores complementarios según la marca

### Estilo:
- **Moderno y limpio**
- **Bordes redondeados**
- **Contraste alto**
- **Legible en tamaños pequeños**

## Archivos Actuales a Reemplazar:

Una vez que tengas los nuevos iconos:

1. Reemplaza `assets/images/icon.png` con el ícono principal
2. Reemplaza `assets/images/adaptive-icon.png` con el ícono adaptativo
3. Reemplaza `assets/images/splash-icon.png` con el ícono de splash
4. Reemplaza `assets/images/favicon.png` con el favicon

## Configuración Completada:

✅ **Nombre de la App**: "Easy Gift"
✅ **Bundle Identifier iOS**: com.alonso.artavia.easygift
✅ **Package Android**: com.alonso.artavia.easygift
✅ **Slug**: easy-gift

## Para Subir a TestFlight:

1. Crea los iconos siguiendo las especificaciones
2. Reemplaza los archivos en `assets/images/`
3. Ejecuta: `expo prebuild --clean`
4. Ejecuta: `eas build --platform ios`
5. Sube a TestFlight

**Nota**: Los iconos son obligatorios para la App Store. Sin iconos personalizados, Apple rechazará la app.