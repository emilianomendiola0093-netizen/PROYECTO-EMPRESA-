# Instrucciones de Configuración — Óleum Natura

## 1. Mercado Pago — Obtener el Access Token

1. Crea una cuenta en [mercadopago.com.mx](https://www.mercadopago.com.mx/) si aún no tienes una.
2. Ve a **Tus integraciones** en el menú de tu perfil o dirígete directamente a:
   👉 https://www.mercadopago.com.mx/developers/panel/app
3. Crea una **nueva aplicación** (elige "Pagos online" como tipo de integración).
4. Dentro de tu aplicación, ve a la sección **"Credenciales de producción"** (o **"Credenciales de prueba"** para hacer pruebas).
5. Copia el valor de **Access Token** — comienza con `APP_USR-` seguido de una cadena larga.
6. Guarda ese valor como la variable de entorno `MP_ACCESS_TOKEN` en Netlify (ver paso 3).

> **Nota:** Para pruebas usa las credenciales de sandbox. Para cobros reales, usa las credenciales de producción.

---

## 2. Google Sheets — Guardar pedidos automáticamente

### Paso A: Crear la hoja de cálculo

1. Abre [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo.
2. Ponle un nombre descriptivo, por ejemplo: **"Pedidos Óleum Natura"**.

### Paso B: Crear el Apps Script

1. En la hoja de cálculo, ve al menú **Extensiones → Apps Script**.
2. Borra todo el código que aparece por defecto y pega el siguiente código:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha','Nombre','Email','Teléfono','Productos','Total','Estado']);
  }
  sheet.appendRow([
    new Date().toLocaleString('es-MX'),
    data.payer_name || '',
    data.payer_email || '',
    data.payer_phone || '',
    (data.items || []).map(function(i){ return i.quantity+'x '+i.title; }).join(', '),
    data.total || 0,
    data.status || 'pendiente'
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Haz clic en el ícono de **guardar** (o presiona `Ctrl+S`).
4. Ponle un nombre al proyecto, por ejemplo: **"API Pedidos"**.

### Paso C: Publicar como aplicación web

1. En el editor de Apps Script, haz clic en **Implementar → Nueva implementación**.
2. Haz clic en el ícono de engranaje ⚙ junto a "Seleccionar tipo" y elige **Aplicación web**.
3. Configura lo siguiente:
   - **Descripción:** API Pedidos (opcional)
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
4. Haz clic en **Implementar**.
5. Si es la primera vez, Google te pedirá que autorices los permisos — acepta.
6. Copia la **URL de la aplicación web** que aparece (tiene este formato):
   `https://script.google.com/macros/s/XXXXXXXXXXXXXX/exec`
7. Guarda esa URL como la variable de entorno `GOOGLE_SCRIPT_URL` en Netlify (ver paso 3).

---

## 3. Netlify — Desplegar el sitio y configurar variables de entorno

### Opción A: Arrastrar y soltar (más fácil)

1. Ve a [netlify.com](https://app.netlify.com) y crea una cuenta gratuita (puedes entrar con tu cuenta de Google o GitHub).
2. Una vez dentro, en el panel principal verás una zona que dice **"Arrastra y suelta tu carpeta de proyecto aquí"**.
3. Arrastra la carpeta completa del proyecto (la carpeta `PROYECTO-EMPRESA-` o como se llame) a esa zona.
4. Netlify subirá todos los archivos y desplegará el sitio automáticamente en pocos segundos.
5. Recibirás una URL del tipo `https://nombre-aleatorio.netlify.app`.

### Opción B: Conectar con GitHub (recomendado para futuras actualizaciones)

1. Sube el proyecto a un repositorio de GitHub.
2. En Netlify, haz clic en **"Add new site → Import an existing project"**.
3. Conecta tu cuenta de GitHub y selecciona el repositorio.
4. Netlify detectará automáticamente la configuración del archivo `netlify.toml`.

### Configurar las variables de entorno

1. Dentro de tu sitio en Netlify, ve a **Site configuration → Environment variables**.
2. Haz clic en **"Add a variable"** y agrega las siguientes dos variables:

| Variable | Valor |
|----------|-------|
| `MP_ACCESS_TOKEN` | El access token de Mercado Pago copiado en el paso 1 |
| `GOOGLE_SCRIPT_URL` | La URL del Apps Script copiada en el paso 2 |

3. Guarda los cambios y haz un nuevo despliegue para que las variables surtan efecto.
   - Ve a **Deploys → Trigger deploy → Deploy site**.

---

## 4. Dominio personalizado (opcional)

Si tienes un dominio propio (por ejemplo, `oleumnatura.mx`):

1. En Netlify, ve a **Domain management → Add a domain**.
2. Escribe tu dominio y haz clic en **"Verify"**.
3. Netlify te dará los servidores DNS que debes configurar en tu registrador de dominios (GoDaddy, Namecheap, etc.):
   - Si puedes cambiar los nameservers, apúntalos a los de Netlify.
   - Si solo puedes agregar registros DNS, agrega un registro **CNAME** apuntando a `[tu-sitio].netlify.app`.
4. Una vez propagados los cambios DNS (puede tardar de 15 minutos a 48 horas), Netlify activará HTTPS de forma automática con un certificado gratuito de Let's Encrypt.

---

## Resumen de variables de entorno requeridas

```
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXXX/exec
```

Consulta el archivo `.env.example` en la raíz del proyecto para referencia.

---

## ¿Algo no funciona?

- Si el pago con Mercado Pago falla, el botón de WhatsApp siempre estará disponible como alternativa.
- Verifica en el panel de Netlify que las Functions estén desplegadas: **Functions → create-preference** y **save-order** deben aparecer en la lista.
- Revisa los logs de las Functions en Netlify para ver errores detallados.
