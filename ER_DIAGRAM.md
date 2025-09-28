# Diagrama de Entidad-Relación - Sistema POS Argon

## Entidades Principales

### 1. **users**
- `id` (PK) - Identificador único
- `username` - Nombre de usuario
- `email` - Correo electrónico
- `password` - Contraseña encriptada
- `role` - Rol del usuario
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 2. **company**
- `id` (PK) - Identificador único
- `name` - Nombre de la empresa
- `address` - Dirección
- `phone` - Teléfono
- `email` - Correo electrónico
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 3. **categories** (NUEVA)
- `id` (PK) - Identificador único
- `name` - Nombre de la categoría
- `description` - Descripción de la categoría
- `is_active` - Estado activo/inactivo
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 4. **product_types** (NUEVA)
- `id` (PK) - Identificador único
- `name` - Nombre del tipo de producto
- `description` - Descripción del tipo
- `is_active` - Estado activo/inactivo
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 5. **products** (ACTUALIZADA)
- `id` (PK) - Identificador único
- `name` - Nombre del producto
- `price` - Precio de costo
- `pricepublic` - Precio de venta
- `description` - Descripción del producto
- `photo_url` - URL de la foto del producto
- `is_active` - Estado activo/inactivo
- `category_id` (FK) - Referencia a categories
- `product_type_id` (FK) - Referencia a product_types
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 6. **promotions** (NUEVA)
- `id` (PK) - Identificador único
- `name` - Nombre de la promoción
- `description` - Descripción de la promoción
- `type` - Tipo de promoción (percentage, fixed_amount, buy_x_get_y)
- `discount_value` - Valor del descuento
- `minimum_amount` - Monto mínimo para aplicar
- `maximum_discount` - Descuento máximo
- `start_date` - Fecha de inicio
- `end_date` - Fecha de fin
- `is_active` - Estado activo/inactivo
- `category_id` (FK) - Referencia a categories (opcional)
- `product_id` (FK) - Referencia a products (opcional)
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 7. **providers**
- `id` (PK) - Identificador único
- `name` - Nombre del proveedor
- `contact` - Información de contacto
- `phone` - Teléfono
- `email` - Correo electrónico
- `address` - Dirección
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### 8. **stock**
- `id` (PK) - Identificador único
- `product_id` (FK) - Referencia a products
- `quantity` - Cantidad en stock
- `min_quantity` - Cantidad mínima
- `max_quantity` - Cantidad máxima
- `last_updated` - Última actualización

### 9. **facturas**
- `id` (PK) - Identificador único
- `amount` - Monto total
- `id_cliente` - ID del cliente
- `id_user` - ID del usuario que creó la factura
- `idfactura` - Número de factura
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

## Relaciones

### Relaciones 1:N (Uno a Muchos)

1. **categories** → **products**
   - Una categoría puede tener muchos productos
   - Un producto pertenece a una categoría (opcional)

2. **product_types** → **products**
   - Un tipo de producto puede tener muchos productos
   - Un producto pertenece a un tipo (opcional)

3. **products** → **promotions**
   - Un producto puede tener muchas promociones
   - Una promoción puede aplicarse a un producto específico

4. **categories** → **promotions**
   - Una categoría puede tener muchas promociones
   - Una promoción puede aplicarse a toda una categoría

5. **products** → **stock**
   - Un producto tiene un registro de stock
   - Un registro de stock pertenece a un producto

6. **users** → **facturas**
   - Un usuario puede crear muchas facturas
   - Una factura es creada por un usuario

### Relaciones N:1 (Muchos a Uno)

1. **products** → **categories**
   - Muchos productos pueden pertenecer a una categoría

2. **products** → **product_types**
   - Muchos productos pueden ser del mismo tipo

3. **promotions** → **products**
   - Muchas promociones pueden aplicarse a un producto

4. **promotions** → **categories**
   - Muchas promociones pueden aplicarse a una categoría

## Características del Sistema

### Gestión de Productos
- **Categorización**: Los productos se organizan por categorías
- **Tipificación**: Los productos se clasifican por tipos
- **Fotos**: Cada producto puede tener una foto asociada
- **Estado**: Control de productos activos/inactivos

### Sistema de Promociones
- **Tipos de descuento**:
  - Porcentaje: Descuento del X%
  - Monto fijo: Descuento de $X
  - Compra X lleva Y: Promoción de cantidad
- **Alcance**: Puede aplicarse a productos específicos o categorías completas
- **Vigencia**: Control de fechas de inicio y fin
- **Restricciones**: Monto mínimo y descuento máximo

### Control de Stock
- **Inventario**: Seguimiento de cantidades disponibles
- **Alertas**: Cantidades mínimas y máximas
- **Actualización**: Control de última modificación

### Facturación
- **Trazabilidad**: Registro del usuario que crea cada factura
- **Clientes**: Identificación de clientes
- **Numeración**: Control de números de factura

## Endpoints de la API

### Categorías
- `GET /categories` - Listar todas las categorías
- `GET /categories/active` - Listar categorías activas
- `GET /categories/:id` - Obtener categoría por ID
- `POST /categories` - Crear nueva categoría
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Tipos de Productos
- `GET /product-types` - Listar todos los tipos
- `GET /product-types/active` - Listar tipos activos
- `GET /product-types/:id` - Obtener tipo por ID
- `POST /product-types` - Crear nuevo tipo
- `PATCH /product-types/:id` - Actualizar tipo
- `DELETE /product-types/:id` - Eliminar tipo

### Promociones
- `GET /promotions` - Listar todas las promociones
- `GET /promotions/current` - Listar promociones vigentes
- `GET /promotions/by-category/:categoryId` - Promociones por categoría
- `GET /promotions/by-product/:productId` - Promociones por producto
- `GET /promotions/:id` - Obtener promoción por ID
- `POST /promotions` - Crear nueva promoción
- `PATCH /promotions/:id` - Actualizar promoción
- `DELETE /promotions/:id` - Eliminar promoción

### Productos (Actualizados)
- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear nuevo producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto
- `POST /products/upload-photo/:id` - Subir foto del producto

## Consideraciones de Diseño

### Normalización
- Las entidades están normalizadas para evitar redundancia
- Las relaciones son claras y bien definidas
- Uso de claves foráneas para mantener integridad referencial

### Flexibilidad
- Las promociones pueden aplicarse a productos específicos o categorías
- Los productos pueden existir sin categoría o tipo asignado
- Sistema de estados activo/inactivo para control de visibilidad

### Escalabilidad
- Estructura preparada para crecimiento
- Índices en campos de búsqueda frecuente
- Timestamps para auditoría y control de cambios

### Seguridad
- Autenticación JWT requerida para todas las operaciones
- Validación de datos en DTOs
- Control de acceso por roles de usuario
