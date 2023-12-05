<div align="center">
  <h3 align="center">CAC + UTN Backend</h3>
  <p align="center">
    ·
    <img src="https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=plastic" alt="Node.js Badge">
    ·
    <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff&style=plastic" alt="MySQL Badge">
    ·
  </p>
</div>

## Contexto 🚀
Se busca desarrollar un sistema integral web que satisfaga las necesidades actuales del
mercado en la búsqueda y contratación de profesionales especializados en una variedad de
campos, tales como gasistas matriculados, electricistas, instaladores de aire
acondicionado, albañiles, y otros servicios profesionales.

El sistema debe permitir:
* Gestionar (Alta, Baja, Modificación) de Tipo de Servicios
* Gestionar Prestadores de Servicios
* Gestionar Consumidores de Servicios
* Gestionar y Buscar Servicios
* Gestionar Trabajos entre Prestador y Consumidor
* Cargar Calificaciones de los Trabajos

## Requerimientos Funcionales 🔧
RF 1:
* El sistema deberá permitir que el administrador de la plataforma dé de alta nuevos
servicios que podrán ser prestados a los consumidores de servicio. Cada servicio estará
compuesto por un conjunto de tareas a realizar.

RF 2:
* El sistema deberá permitir que los prestadores ofrezcan sus servicios a través de la
plataforma. Los prestadores deberán proporcionar información sobre su disponibilidad de
días y horarios de atención, radio de cobertura, una breve descripción de sus experiencias y,
si aplica, fotos de trabajos realizados.

RF 3:
* Los prestadores deberán tener la capacidad de modificar su perfil en la plataforma. Este
perfil incluirá una foto, nombre y apellido, fecha de nacimiento, tipo y número de documento,
CUIT/CUIL y datos de contacto, como teléfonos y correos electrónicos.

RF 4:
* El sistema deberá permitir a los consumidores de servicios la posibilidad de contratar a
un prestador para un trabajo específico. Deben poder especificar claramente la fecha, lugar
y rango horario en el que se llevará a cabo el trabajo, así como seleccionar las tareas
necesarias. Esto permitirá que el prestador establezca un precio. La aceptación del contrato
por parte del prestador será requisito indispensable para llevar a cabo la tarea.

RF 5:
* El sistema deberá permitir a los consumidores de servicios y a los prestadores la opción
de indicar si el trabajo ha sido finalizado o no.

RF 6:
* El sistema deberá permitir que los consumidores de servicios califiquen a los
prestadores en función de los trabajos realizados. Las calificaciones podrán ser de 1 a 5
estrellas, acompañadas de una opinión libre.

RF 7:
* Los consumidores de servicios deberán poder seleccionar criterios de búsqueda, que
pueden incluir el radio de cercanía (especificando los kilómetros a la redonda), días de
atención y horarios de atención. Estos criterios seguirán un algoritmo básico de búsqueda
que filtra a los prestadores, los ordena según su antigüedad y reputación en el sistema y
selecciona a los primeros N, siendo N un número elegido por el usuario

## Requerimientos No Funcionales 🛠️

RNF 1: Seguridad
* Métrica: Cumplimiento con los estándares OWASP Top Ten de seguridad web.
* Estándar: Cumplimiento con las pautas de seguridad OWASP para proteger contra
vulnerabilidades comunes, como inyección SQL, ataques XSS y CSRF.

RNF 2: Rendimiento
* Métrica: Tiempo de respuesta promedio para búsquedas y operaciones de contratación.
* Estándar: El tiempo de respuesta promedio debe ser inferior a 1 segundo

RNF 3: Interfaz de Usuario Intuitiva
* Métrica: Evaluación de usabilidad por parte de los usuarios.
* Estándar: El sistema debe recibir una calificación de usabilidad superior al 80% en las
evaluaciones de usuarios.

RNF 4: Accesibilidad
* Métrica: Puntuación de conformidad con WCAG (Web Content Accessibility Guidelines).
* Estándar: Cumplimiento con el nivel de conformidad AA de las pautas WCAG.

