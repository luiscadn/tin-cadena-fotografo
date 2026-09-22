-- ============================================
-- DATA: Photo Market Database
-- Datos iniciales del sistema
-- ============================================

-- ============================================
-- 1. PERMISOS (5 registros)
-- ============================================
INSERT INTO permissions (name) VALUES 
('READ'),
('WRITE'),
('DELETE'),
('SELL'),
('BUY');

-- ============================================
-- 2. ROLES (3 registros)
-- ============================================
INSERT INTO roles (name) VALUES 
('ADMIN'),
('PHOTOGRAPHER'),
('BUYER');

-- ============================================
-- 3. ROLE_PERMISSIONS (asignacion de permisos)
-- ============================================
-- ADMIN tiene todos los permisos (1=READ, 2=WRITE, 3=DELETE, 4=SELL, 5=BUY)
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- PHOTOGRAPHER puede READ, WRITE, SELL
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(2, 1), (2, 2), (2, 4);

-- BUYER puede READ, BUY
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(3, 1), (3, 5);

-- ============================================
-- 4. CATEGORIAS (6 registros)
-- ============================================
INSERT INTO categories (name, description) VALUES 
('Paisaje', 'Fotografia de naturaleza, montanas, oceanos y paisajes naturales'),
('Retrato', 'Fotografia de personas, poses artisticas y expresiones'),
('Urbano', 'Fotografia de ciudades, arquitectura y vida urbana'),
('Abstracto', 'Fotografia artistica experimental y abstracta'),
('Vida Silvestre', 'Fotografia de animales en su habitat natural'),
('Deportes', 'Fotografia de accion y momentos deportivos');

-- ============================================
-- 5. USUARIOS (55 registros: 1 admin, 15 fotografos, 39 compradores)
-- ============================================

-- ADMIN (contraseña: "admin")
INSERT INTO users (name, username, password, email, role_id) VALUES 
--('Carlos Administrador', 'admin', '$2a$10$E5Fg60i1saet7yoki8K2V.JffwIgiroKJ2p4HmCOMihWujofm2/vS', 'admin@photomarket.com', 1);
('Carlos Administrador', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@photomarket.com', 1);

-- FOTOGRAFOS (15) - contraseña: "password"
INSERT INTO users (name, username, password, email, role_id) VALUES 
('Ansel Duarte', 'ansel.duarte', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ansel.duarte@photoartist.com', 2),
('Laura Mendez', 'laura.mendez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'laura.mendez@visualart.com', 2),
('Mateo Rivas', 'mateo.rivas', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mateo.rivas@landscapes.com', 2),
('Carlos Ibanez', 'carlos.ibanez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'carlos.ibanez@desertvisions.com', 2),
('Andrea Salazar', 'andrea.salazar', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'andrea.salazar@naturephoto.com', 2),
('David Pardo', 'david.pardo', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'david.pardo@architecture.com', 2),
('Sara Guzman', 'sara.guzman', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sara.guzman@streetlife.com', 2),
('Juan Ortega', 'juan.ortega', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'juan.ortega@oceanic.com', 2),
('Pedro Valdes', 'pedro.valdes', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pedro.valdes@wildlife.com', 2),
('Elena Torres', 'elena.torres', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'elena.torres@forestlight.com', 2),
('Miguel Angel Rojas', 'miguel.rojas', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'miguel.rojas@urbanframes.com', 2),
('Valentina Cruz', 'valentina.cruz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'valentina.cruz@portraits.com', 2),
('Santiago Morales', 'santiago.morales', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'santiago.morales@abstractvision.com', 2),
('Isabella Vargas', 'isabella.vargas', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'isabella.vargas@sportsaction.com', 2),
('Sebastian Lopez', 'sebastian.lopez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sebastian.lopez@nightscapes.com', 2);

-- COMPRADORES (39) - contraseña: "password"
INSERT INTO users (name, username, password, email, role_id) VALUES 
('Maria Gonzalez', 'maria.gonzalez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'maria.gonzalez@email.com', 3),
('Jose Ramirez', 'jose.ramirez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jose.ramirez@email.com', 3),
('Ana Patricia Silva', 'ana.silva', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ana.silva@email.com', 3),
('Roberto Castro', 'roberto.castro', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'roberto.castro@email.com', 3),
('Carmen Herrera', 'carmen.herrera', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'carmen.herrera@email.com', 3),
('Francisco Jimenez', 'francisco.jimenez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'francisco.jimenez@email.com', 3),
('Lucia Martinez', 'lucia.martinez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lucia.martinez@email.com', 3),
('Diego Fernandez', 'diego.fernandez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'diego.fernandez@email.com', 3),
('Sofia Alvarez', 'sofia.alvarez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sofia.alvarez@email.com', 3),
('Antonio Ruiz', 'antonio.ruiz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'antonio.ruiz@email.com', 3),
('Patricia Diaz', 'patricia.diaz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patricia.diaz@email.com', 3),
('Manuel Torres', 'manuel.torres', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manuel.torres@email.com', 3),
('Isabel Sanchez', 'isabel.sanchez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'isabel.sanchez@email.com', 3),
('Jorge Reyes', 'jorge.reyes', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jorge.reyes@email.com', 3),
('Gabriela Flores', 'gabriela.flores', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gabriela.flores@email.com', 3),
('Ricardo Mendoza', 'ricardo.mendoza', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ricardo.mendoza@email.com', 3),
('Daniela Ortiz', 'daniela.ortiz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'daniela.ortiz@email.com', 3),
('Alejandro Guerrero', 'alejandro.guerrero', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'alejandro.guerrero@email.com', 3),
('Natalia Rivera', 'natalia.rivera', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'natalia.rivera@email.com', 3),
('Pablo Medina', 'pablo.medina', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pablo.medina@email.com', 3),
('Carolina Romero', 'carolina.romero', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'carolina.romero@email.com', 3),
('Fernando Navarro', 'fernando.navarro', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'fernando.navarro@email.com', 3),
('Adriana Campos', 'adriana.campos', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'adriana.campos@email.com', 3),
('Rodrigo Pena', 'rodrigo.pena', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'rodrigo.pena@email.com', 3),
('Paola Vega', 'paola.vega', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'paola.vega@email.com', 3),
('Andres Moreno', 'andres.moreno', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'andres.moreno@email.com', 3),
('Claudia Ramos', 'claudia.ramos', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'claudia.ramos@email.com', 3),
('Hector Delgado', 'hector.delgado', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'hector.delgado@email.com', 3),
('Monica Aguilar', 'monica.aguilar', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'monica.aguilar@email.com', 3),
('Gustavo Cortes', 'gustavo.cortes', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gustavo.cortes@email.com', 3),
('Beatriz Gutierrez', 'beatriz.gutierrez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'beatriz.gutierrez@email.com', 3),
('Raul Chavez', 'raul.chavez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'raul.chavez@email.com', 3),
('Lorena Dominguez', 'lorena.dominguez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lorena.dominguez@email.com', 3),
('Oscar Rojas', 'oscar.rojas', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'oscar.rojas@email.com', 3),
('Veronica Mendez', 'veronica.mendez', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'veronica.mendez@email.com', 3),
('Javier Pereira', 'javier.pereira', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'javier.pereira@email.com', 3),
('Silvia Castillo', 'silvia.castillo', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'silvia.castillo@email.com', 3),
('Ernesto Blanco', 'ernesto.blanco', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ernesto.blanco@email.com', 3),
('Mariana Leon', 'mariana.leon', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mariana.leon@email.com', 3);

-- ============================================
-- 6. FOTOGRAFOS (15 perfiles profesionales)
-- ============================================
INSERT INTO photographers (user_id, bio, website, phone) VALUES 
(2, 'Especialista en fotografia de paisajes naturales con 15 anos de experiencia. Ganador del premio World Nature Photography 2022.', 'www.anselduarte.com', '+57-310-555-0001'),
(3, 'Fotografa urbana reconocida por capturar la esencia de las ciudades latinoamericanas. Publicada en National Geographic.', 'www.lauramendez.co', '+57-310-555-0002'),
(4, 'Experto en fotografia de montana y paisajes extremos. Miembro de la Asociacion Internacional de Fotografos de Naturaleza.', 'www.mateorivas.com', '+57-310-555-0003'),
(5, 'Fotografo del desierto, especializado en capturar la magia de paisajes aridos bajo diferentes condiciones de luz.', 'www.carlosibanez.net', '+57-310-555-0004'),
(6, 'Amante de la naturaleza con enfoque en fotografia macro y ecosistemas forestales. Colaboradora de WWF.', 'www.andreasalazar.art', '+57-310-555-0005'),
(7, 'Arquitecto y fotografo especializado en capturar estructuras modernas y espacios urbanos desde perspectivas unicas.', 'www.davidpardo.photo', '+57-310-555-0006'),
(8, 'Fotografa callejera con estilo documental. Sus obras han sido exhibidas en galerias de Paris y Nueva York.', 'www.saraguzman.com', '+57-310-555-0007'),
(9, 'Especialista en fotografia oceanica y costera. Buzo certificado con mas de 1000 inmersiones registradas.', 'www.juanortega.ocean', '+57-310-555-0008'),
(10, 'Fotografo de vida silvestre enfocado en conservacion. Colaborador de revistas como Wildlife Photography Magazine.', 'www.pedrovaldes.wild', '+57-310-555-0009'),
(11, 'Artista visual especializada en fotografia de bosques y ambientes naturales misticos. Estilo etereo y contemplativo.', 'www.elenatorres.art', '+57-310-555-0010'),
(12, 'Fotografo urbano contemporaneo. Captura la geometria y el caos ordenado de las megaciudades.', 'www.miguelrojas.urban', '+57-310-555-0011'),
(13, 'Retratista profesional con experiencia en moda y fotografia editorial. Publicada en Vogue y Harper''s Bazaar.', 'www.valentinacruz.portraits', '+57-310-555-0012'),
(14, 'Artista visual experimental. Trabaja con tecnicas de larga exposicion y fotografia abstracta.', 'www.santiagomorales.abstract', '+57-310-555-0013'),
(15, 'Fotografa deportiva especializada en accion extrema. Cubre competencias internacionales de surf y escalada.', 'www.isabellavargas.sports', '+57-310-555-0014'),
(16, 'Fotografo nocturno, especialista en astrofotografia y paisajes urbanos bajo las estrellas.', 'www.sebastianlopez.night', '+57-310-555-0015');

-- ============================================
-- 7. COMPRADORES (39 perfiles)
-- ============================================
INSERT INTO buyers (user_id, address, phone) VALUES 
(17, 'Calle 85 #15-30, Bogota', '+57-310-600-0001'),
(18, 'Carrera 43A #12-56, Medellin', '+57-310-600-0002'),
(19, 'Avenida 5N #23-45, Cali', '+57-310-600-0003'),
(20, 'Calle 70 #4-32, Barranquilla', '+57-310-600-0004'),
(21, 'Carrera 7 #127-89, Bogota', '+57-310-600-0005'),
(22, 'Calle 10 #5-60, Cartagena', '+57-310-600-0006'),
(23, 'Avenida Circunvalar #45-12, Bucaramanga', '+57-310-600-0007'),
(24, 'Calle 100 #18-30, Bogota', '+57-310-600-0008'),
(25, 'Carrera 65 #8-92, Medellin', '+57-310-600-0009'),
(26, 'Calle 17 #100-50, Cali', '+57-310-600-0010'),
(27, 'Avenida Boyaca #72-45, Bogota', '+57-310-600-0011'),
(28, 'Carrera 25 #34-12, Pereira', '+57-310-600-0012'),
(29, 'Calle 45 #29-80, Manizales', '+57-310-600-0013'),
(30, 'Avenida 30 de Agosto #67-23, Cucuta', '+57-310-600-0014'),
(31, 'Calle 53 #47-12, Barranquilla', '+57-310-600-0015'),
(32, 'Carrera 15 #89-34, Santa Marta', '+57-310-600-0016'),
(33, 'Calle 93 #11-20, Bogota', '+57-310-600-0017'),
(34, 'Avenida El Poblado #12-45, Medellin', '+57-310-600-0018'),
(35, 'Calle 5 #36-78, Cali', '+57-310-600-0019'),
(36, 'Carrera 9 #15-23, Pasto', '+57-310-600-0020'),
(37, 'Avenida Santander #78-90, Ibague', '+57-310-600-0021'),
(38, 'Calle 80 #50-12, Bogota', '+57-310-600-0022'),
(39, 'Carrera 70 #34-89, Medellin', '+57-310-600-0023'),
(40, 'Calle 25 #12-67, Villavicencio', '+57-310-600-0024'),
(41, 'Avenida Jimenez #3-45, Bogota', '+57-310-600-0025'),
(42, 'Calle 33 #67-23, Armenia', '+57-310-600-0026'),
(43, 'Carrera 50 #78-12, Medellin', '+57-310-600-0027'),
(44, 'Calle 12 #5-89, Popayan', '+57-310-600-0028'),
(45, 'Avenida 6 #28-34, Cali', '+57-310-600-0029'),
(46, 'Calle 72 #10-45, Bogota', '+57-310-600-0030'),
(47, 'Carrera 80 #45-12, Medellin', '+57-310-600-0031'),
(48, 'Calle 15 #23-67, Valledupar', '+57-310-600-0032'),
(49, 'Avenida Las Americas #89-23, Cali', '+57-310-600-0033'),
(50, 'Calle 116 #7-45, Bogota', '+57-310-600-0034'),
(51, 'Carrera 35 #12-78, Neiva', '+57-310-600-0035'),
(52, 'Calle 50 #67-23, Monteria', '+57-310-600-0036'),
(53, 'Avenida 19 #45-90, Bogota', '+57-310-600-0037'),
(54, 'Carrera 48 #23-56, Medellin', '+57-310-600-0038'),
(55, 'Calle 26 #92-12, Bogota', '+57-310-600-0039');

-- ============================================
-- 8. FOTOGRAFIAS (60 obras exclusivas)
-- ============================================
INSERT INTO photographs (title, description, price, edition, status, photographer_id, category_id) VALUES 
-- Ansel Duarte (Paisajista) - 5 obras
('Amanecer en los Andes', 'Captura del primer rayo de sol iluminando los picos nevados de la Sierra Nevada. Edicion unica.', 2500.00, 1, 'AVAILABLE', 1, 1),
('Valle Dorado', 'Valle cubierto de flores silvestres bajo la luz dorada del atardecer. Impresion en metacrilato.', 1800.00, 1, 'AVAILABLE', 1, 1),
('Reflejo Glaciar', 'Lago de montana reflejando perfectamente el glaciar. Tecnica HDR.', 2200.00, 1, 'AVAILABLE', 1, 1),
('Niebla Montanosa', 'Montanas emergiendo entre nubes bajas al amanecer. Fotografia de larga exposicion.', 1950.00, 1, 'SOLD', 1, 1),
('Cumbres Infinitas', 'Cadena montanosa extendiendose hasta el horizonte. Panoramica de 180 grados.', 3200.00, 1, 'AVAILABLE', 1, 1),

-- Laura Mendez (Urbana) - 5 obras
('Geometria Urbana', 'Edificios modernos creando patrones geometricos. Perspectiva cenital.', 1600.00, 1, 'AVAILABLE', 2, 3),
('Calles Nocturnas', 'Avenida principal de la ciudad con rastros de luz de vehiculos. Larga exposicion.', 1750.00, 1, 'AVAILABLE', 2, 3),
('Sombras de Medellin', 'Juego de luces y sombras en las calles del centro. Blanco y negro.', 1400.00, 1, 'AVAILABLE', 2, 3),
('Vida en Movimiento', 'Captura del bullicio urbano en hora punta. Tecnica de congelado selectivo.', 1550.00, 1, 'SOLD', 2, 3),
('Torres Gemelas', 'Arquitectura contemporanea reflejada en fachada de vidrio.', 1900.00, 1, 'AVAILABLE', 2, 3),

-- Mateo Rivas (Paisajista) - 4 obras
('Lago Espejo', 'Lago de alta montana en perfecta calma. Reflejo simetrico del cielo.', 2100.00, 1, 'AVAILABLE', 3, 1),
('Cascada Mistica', 'Cascada entre rocas cubiertas de musgo. Agua sedosa por larga exposicion.', 1850.00, 1, 'AVAILABLE', 3, 1),
('Bosque Nublado', 'Arboles ancestrales envueltos en niebla. Atmosfera eterea.', 2000.00, 1, 'SOLD', 3, 1),
('Pico Solitario', 'Montana majestuosa elevandose sobre las nubes.', 2400.00, 1, 'AVAILABLE', 3, 1),

-- Carlos Ibanez (Desierto) - 4 obras
('Dunas al Atardecer', 'Dunas de arena con luz rasante del atardecer. Texturas y sombras dramaticas.', 2300.00, 1, 'AVAILABLE', 4, 1),
('Horizonte Ardiente', 'Desierto bajo el sol del mediodia. Tonos calidos intensos.', 1950.00, 1, 'AVAILABLE', 4, 1),
('Oasis Escondido', 'Pequena laguna en medio del desierto. Contraste vida-aridez.', 2150.00, 1, 'AVAILABLE', 4, 1),
('Tormenta de Arena', 'Captura de tormenta aproximandose sobre las dunas. Cielo dramatico.', 2600.00, 1, 'SOLD', 4, 1),

-- Andrea Salazar (Naturaleza) - 4 obras
('Rocio Matinal', 'Fotografia macro de gotas de rocio sobre hoja. Delicadeza natural.', 1200.00, 1, 'AVAILABLE', 5, 1),
('Bosque Ancestral', 'Arboles centenarios en bosque primario. Luz filtrada entre ramas.', 1800.00, 1, 'AVAILABLE', 5, 1),
('Helecho Dorado', 'Helecho iluminado por ultimo rayo de sol. Macro artistico.', 1150.00, 1, 'SOLD', 5, 1),
('Rio Cristalino', 'Rio de montana con agua transparente sobre piedras de colores.', 1650.00, 1, 'AVAILABLE', 5, 1),

-- David Pardo (Arquitectura) - 4 obras
('Escalera Infinita', 'Escalera en espiral vista desde abajo. Geometria hipnotica.', 1700.00, 1, 'AVAILABLE', 6, 3),
('Fachada Moderna', 'Detalle de edificio contemporaneo con paneles metalicos.', 1500.00, 1, 'AVAILABLE', 6, 3),
('Puente Suspendido', 'Puente peatonal moderno con cables de acero. Simetria perfecta.', 1850.00, 1, 'AVAILABLE', 6, 3),
('Biblioteca Central', 'Interior de biblioteca con estanterias infinitas. Perspectiva dramatica.', 1950.00, 1, 'SOLD', 6, 3),

-- Sara Guzman (Street) - 4 obras
('Vendedor Ambulante', 'Retrato de vendedor de flores en mercado publico. Documental social.', 1350.00, 1, 'AVAILABLE', 7, 3),
('Lluvia Urbana', 'Peatones con paraguas en dia lluvioso. Reflejos en pavimento mojado.', 1450.00, 1, 'AVAILABLE', 7, 3),
('Metro Rush', 'Multitud en estacion de metro en hora punta. Movimiento congelado.', 1550.00, 1, 'AVAILABLE', 7, 3),
('Grafiti Viviente', 'Artista callejero pintando mural. Arte urbano en accion.', 1400.00, 1, 'SOLD', 7, 3),

-- Juan Ortega (Oceanica) - 4 obras
('Ola Perfecta', 'Ola a punto de romper. Vista desde dentro del tubo.', 2800.00, 1, 'AVAILABLE', 8, 1),
('Arrecife de Coral', 'Ecosistema marino vibrante. Fotografia submarina a 15 metros.', 2400.00, 1, 'AVAILABLE', 8, 1),
('Tortuga Marina', 'Tortuga nadando en aguas cristalinas. Encuentro cercano.', 2100.00, 1, 'SOLD', 8, 1),
('Costa Rocosa', 'Acantilados golpeados por olas. Larga exposicion, agua sedosa.', 2200.00, 1, 'AVAILABLE', 8, 1),

-- Pedro Valdes (Vida Silvestre) - 4 obras
('Jaguar Vigilante', 'Jaguar en la selva mirando fijamente a camara. Momento unico.', 3500.00, 1, 'AVAILABLE', 9, 5),
('Colibri en Vuelo', 'Colibri alimentandose de flor. Congelado en pleno aleteo.', 1800.00, 1, 'AVAILABLE', 9, 5),
('Mono Aullador', 'Primate en copa de arbol al amanecer. Luz natural perfecta.', 2200.00, 1, 'AVAILABLE', 9, 5),
('Oso de Anteojos', 'Especie en peligro captada en habitat natural. Conservacion.', 3200.00, 1, 'SOLD', 9, 5),

-- Elena Torres (Bosques) - 4 obras
('Sendero Magico', 'Camino entre arboles con rayos de luz atravesando niebla.', 1900.00, 1, 'AVAILABLE', 10, 1),
('Raices Antiguas', 'Raices expuestas de arbol centenario. Textura natural.', 1650.00, 1, 'AVAILABLE', 10, 1),
('Musgo Esmeralda', 'Primer plano de musgo sobre tronco caido. Verde intenso.', 1250.00, 1, 'AVAILABLE', 10, 1),
('Bosque Sumergido', 'Arboles reflejados en laguna en calma. Simetria natural.', 1850.00, 1, 'SOLD', 10, 1),

-- Miguel Angel Rojas (Urbano) - 3 obras
('Interseccion', 'Cruce de avenidas desde arriba. Geometria urbana.', 1750.00, 1, 'AVAILABLE', 11, 3),
('Ventanas', 'Fachada de edificio con ventanas iluminadas formando patron.', 1600.00, 1, 'AVAILABLE', 11, 3),
('Metro Nocturno', 'Estacion de metro vacia de noche. Atmosfera cinematografica.', 1700.00, 1, 'AVAILABLE', 11, 3),

-- Valentina Cruz (Retrato) - 3 obras
('Mirada Profunda', 'Retrato en blanco y negro enfocando los ojos. Intimidad emocional.', 2200.00, 1, 'AVAILABLE', 12, 2),
('Elegancia Atemporal', 'Retrato de moda con iluminacion clasica. Estilo editorial.', 2400.00, 1, 'SOLD', 12, 2),
('Expresion Natural', 'Retrato espontaneo capturando risa genuina. Luz natural.', 1900.00, 1, 'AVAILABLE', 12, 2),

-- Santiago Morales (Abstracto) - 3 obras
('Ondas de Luz', 'Patrones de luz en larga exposicion. Abstraccion pura.', 1550.00, 1, 'AVAILABLE', 13, 4),
('Geometria Liquida', 'Reflejos distorsionados en agua. Formas abstractas.', 1650.00, 1, 'AVAILABLE', 13, 4),
('Color en Movimiento', 'Captura de movimiento con multiples exposiciones. Arte experimental.', 1750.00, 1, 'AVAILABLE', 13, 4),

-- Isabella Vargas (Deportes) - 2 obras
('Surfista Extremo', 'Surfista en ola gigante. Momento de accion pura.', 2600.00, 1, 'AVAILABLE', 14, 6),
('Escalador en Roca', 'Escalador en pared vertical al atardecer. Determinacion humana.', 2400.00, 1, 'AVAILABLE', 14, 6),

-- Sebastian Lopez (Nocturna) - 2 obras
('Via Lactea Andina', 'Cielo estrellado sobre montanas. Astrofotografia de larga exposicion.', 2900.00, 1, 'AVAILABLE', 15, 1),
('Ciudad Nocturna', 'Skyline de la ciudad bajo las estrellas. Combinacion urbano-astronomica.', 2500.00, 1, 'SOLD', 15, 3);

-- ============================================
-- The Vault Collection - Alvaro Cadena (6 Obras Insignia)
-- ============================================
INSERT INTO photographs (title, description, price, edition, status, photographer_id, category_id, image) VALUES
('Bastion', '===STORY===\nUna mirada a la fortaleza marítima y el faro vigía del Mediterráneo, guardando la entrada histórica frente a las brumas de la costa provenzal.\n===LOCATION===\nMarseille, France [43.2965° N, 5.3698° E]\n===TECHNICAL===\nLeica M11, Summilux 50mm f/1.4, 1/500s, ISO 64', 2800.00, 10, 'AVAILABLE', 1, 3, '/photos/Bastion.jpg'),
('Infinite Drift', '===STORY===\nLa soledad geométrica de un velero navegando en la inmensidad del horizonte en calma, donde el cielo plomizo y las aguas se funden en una sola escala cromática.\n===LOCATION===\nMediterranean Sea, Offshore [43.1500° N, 5.2500° E]\n===TECHNICAL===\nHasselblad X2D 100C, XCD 90mm f/2.5, 1/1000s, ISO 64', 3400.00, 7, 'AVAILABLE', 1, 1, '/photos/InfiniteDrift.webp'),
('Silent Harbour', '===STORY===\nLa quietud matutina reflejada con precisión de espejo sobre las aguas del puerto antiguo, los mástiles trazando líneas verticales de pureza arquitectónica.\n===LOCATION===\nVieux-Port, Marseille, France\n===TECHNICAL===\nSony A7R V, FE 24-70mm f/2.8 GM II, 1/250s, ISO 100', 2600.00, 12, 'AVAILABLE', 1, 3, '/photos/SilentHarbour.webp'),
('Slate Horizon', '===STORY===\nMurallones de piedra y horizonte agreste bajo un cielo de pizarra cargado de atmósfera atemporal, testimonio de la resistencia costera frente al viento mistral.\n===LOCATION===\nÎles du Frioul, Mediterranean Sea\n===TECHNICAL===\nLeica SL2, Vario-Elmarit-SL 24-90mm f/2.8-4, 1/320s, ISO 50', 3100.00, 5, 'AVAILABLE', 1, 1, '/photos/SlateHorizon.webp'),
('The Sentinel I', '===STORY===\nLa basílica de Notre-Dame de la Garde iluminada sobre la colina al caer la noche, vigilando la trama urbana y el pulso vibrante de la ciudad costera.\n===LOCATION===\nNotre-Dame de la Garde, Marseille, France\n===TECHNICAL===\nLeica M11, Noctilux 50mm f/0.95, 1/60s, ISO 400', 3800.00, 7, 'AVAILABLE', 1, 3, '/photos/TheSentinel1.webp'),
('Urban Tide', '===STORY===\nUna composición panorámica que dialoga entre la monumentalidad del fuerte histórico, los diques marítimos modernos y el tejido urbano expandiéndose hacia el mar.\n===LOCATION===\nFort Saint-Jean & La Major, Marseille\n===TECHNICAL===\nSony A7R V, 70-200mm f/2.8 GM OSS II, 1/400s, ISO 100', 3200.00, 10, 'AVAILABLE', 1, 3, '/photos/UrbanTide.webp');

-- ============================================
-- 9. VENTAS (10 transacciones completadas)
-- ============================================
INSERT INTO sales (buyer_id, photograph_id, total_amount, sale_date) VALUES 
(1, 4, 1950.00, '2025-01-15 10:30:00'),
(5, 9, 1550.00, '2025-01-20 14:45:00'),
(8, 12, 2000.00, '2025-02-03 09:15:00'),
(12, 16, 2600.00, '2025-02-10 16:20:00'),
(3, 19, 1150.00, '2025-02-14 11:00:00'),
(18, 24, 1950.00, '2025-02-22 13:30:00'),
(7, 28, 1400.00, '2025-03-01 10:00:00'),
(22, 32, 2100.00, '2025-03-05 15:45:00'),
(15, 36, 1850.00, '2025-03-08 12:20:00'),
(10, 48, 2400.00, '2025-03-10 17:00:00'),
(25, 52, 3200.00, '2025-03-11 14:30:00');