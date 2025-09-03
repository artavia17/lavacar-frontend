# Guía para Subir Easy Gift a TestFlight

## ✅ Configuración Completada

### Aplicación Configurada:
- **Nombre**: Easy Gift
- **Bundle ID**: com.alonso.artavia.easygift 
- **Scheme**: easygift
- **EAS Config**: Creado y listo

## 📋 Pasos para Subir a TestFlight

### 1. **Crear Iconos Personalizados** (REQUERIDO)
Antes de continuar, necesitas crear los iconos personalizados. Ver `ICON_REQUIREMENTS.md` para especificaciones detalladas.

**Archivos a crear:**
- `assets/images/icon.png` (1024x1024)
- `assets/images/adaptive-icon.png` (1024x1024) 
- `assets/images/splash-icon.png` (1024x1024)
- `assets/images/favicon.png` (48x48)

### 2. **Configurar Cuenta de Desarrollador Apple**

```bash
# Login a tu cuenta Expo/EAS
npx eas login

# Configurar proyecto EAS (primera vez)
npx eas project:init
```

### 3. **Configurar iOS Build**

```bash
# Generar credenciales iOS automáticamente
npx eas credentials -p ios

# O si prefieres usar tus propios certificados
npx eas credentials -p ios --local
```

### 4. **Build para TestFlight**

```bash
# Clean build (recomendado)
npx expo prebuild --clean

# Build para producción iOS
npx eas build --platform ios --profile production

# Monitorear progreso
npx eas build:list
```

### 5. **Subir a App Store Connect**

```bash
# Automático (después de configurar submit en eas.json)
npx eas submit --platform ios

# O manual: descargar .ipa y subir via Xcode/Transporter
```

### 6. **Configurar TestFlight**

1. Ve a [App Store Connect](https://appstoreconnect.apple.com)
2. Selecciona tu app "Easy Gift"
3. Ve a TestFlight → Build
4. Agrega información de prueba
5. Invita testers internos/externos

## 🔧 Comandos Útiles

### Ver builds en progreso:
```bash
npx eas build:list
```

### Ver detalles de un build específico:
```bash
npx eas build:view [build-id]
```

### Cancelar build:
```bash
npx eas build:cancel [build-id]
```

### Ver logs de build:
```bash
npx eas build:view [build-id] --logs
```

## 📱 Testing Local

Antes de subir a TestFlight, prueba localmente:

```bash
# iOS Simulator
npx expo run:ios

# Dispositivo iOS físico
npx expo run:ios --device
```

## 🚨 Posibles Problemas

### 1. **Iconos Faltantes**
- Error: "The bundle does not contain an app icon"
- Solución: Asegúrate de tener todos los iconos en `assets/images/`

### 2. **Bundle ID Duplicado**
- Error: "Bundle identifier is not available"
- Solución: Cambia el bundleIdentifier en `app.json`

### 3. **Certificados Vencidos**
- Error: "Provisioning profile expired"
- Solución: `npx eas credentials -p ios --clear-all`

### 4. **Permisos Faltantes**
- Error: "App uses non-exempt encryption"
- Solución: Agregar a `app.json`:
```json
"ios": {
  "config": {
    "usesNonExemptEncryption": false
  }
}
```

## 📝 Checklist Pre-Build

- [ ] Iconos personalizados creados y colocados
- [ ] Version number actualizado en `app.json`
- [ ] Bundle identifier único configurado
- [ ] Cuenta de desarrollador Apple activa
- [ ] EAS CLI configurado y logueado
- [ ] App probada localmente
- [ ] Notificaciones push funcionando (opcional para primera versión)

## 🎯 Próximos Pasos Después de TestFlight

1. **Testing Beta**: Invitar usuarios beta para probar
2. **Feedback**: Recopilar y aplicar feedback
3. **App Store Review**: Preparar app para review pública
4. **Marketing**: Screenshots, descripción, palabras clave
5. **Launch**: Publicar en App Store

---

**Nota Importante**: Sin iconos personalizados, Apple rechazará automáticamente la app. Asegúrate de crear los iconos antes de hacer el build.