# Cartas digitales con cards: referencias UX/UI para Casa Candy

Fecha: 23 de septiembre de 2026 · Alcance: carta pública de https://ccandy.es (móvil primero, acceso por QR en mesa)

**Cómo leer este informe.** Cada afirmación lleva la URL de su fuente. Cuando algo es una conclusión mía (aplicar una fuente a Casa Candy), va marcado como **[Inferencia]**. Cuando algo no se ha podido verificar, va marcado como **[No verificado]**. De los productos reales (Uber Eats, Just Eat, Toast, Square…) solo se describe lo que se ha podido leer en su página o en su documentación oficial. No se pudo abrir un navegador real para ver el comportamiento visual (sticky, scrollspy, animaciones), así que esos detalles de las apps de delivery se indican como no verificados.

---

## Resumen ejecutivo

- **Scroll continuo con secciones, no pestañas que filtran.** NN/g desaconseja las pestañas cuando hay muchos grupos: si la barra se desborda, las pestañas ocultas se descubren peor ([NN/g, Tabs](https://www.nngroup.com/articles/tabs-used-right/)). Uber Eats, Square («Order Online») y Toast ponen todas las categorías en una sola página ([Uber Eats](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg), [Square](https://squareup.com/us/en/the-bottom-line/starting-your-business/how-to-start-a-free-online-store), [Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ)). El filtro actual de `MenuSection.tsx` va justo en la dirección contraria.
- **Para 12 categorías: barra sticky de chips con scroll horizontal, que resalta la sección visible, más un índice completo.** Material 3 permite chips y tabs con scroll horizontal ([M3 Chips](https://m3.material.io/components/chips/guidelines), [M3 Tabs](https://m3.material.io/components/tabs/overview)). NN/g recomienda resaltar la sección actual en un índice sticky ([NN/g, Table of Contents](https://www.nngroup.com/articles/table-of-contents/)). Toast añade en móvil un panel inferior con todas las categorías y el número de platos de cada una ([Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ)).
- **En móvil, 1 columna tipo lista, no una rejilla de 2.** M3 sugiere cambiar cards por listas en pantallas pequeñas ([M3 Cards](https://m3.material.io/components/cards/guidelines)). NN/g recomienda listas para elementos homogéneos porque así el precio se encuentra siempre en el mismo sitio ([NN/g, Cards](https://www.nngroup.com/articles/cards-component/)). Baymard reserva la rejilla para productos que se eligen por la imagen ([Baymard, PLP](https://baymard.com/blog/product-listing-page-plp-ux)). Con 7 fotos entre 53 platos, la carta de Casa Candy no es visual.
- **Sin foto, mejor nada que un placeholder gris.** Los usuarios miran las imágenes que informan e ignoran las decorativas ([NN/g, Photos as Web Content](https://www.nngroup.com/articles/photos-as-web-content/)). En Uber Eats conviven platos con foto y sin foto en la misma carta ([Uber Eats](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg)). **[Inferencia]** La card tiene que funcionar bien sin foto y la foto se añade como un extra.
- **El formato de precio actual (`€12.50`) es incorrecto en España.** En España el símbolo va detrás de la cifra y separado por un espacio: «15 €» ([FundéuRAE](https://www.fundeu.es/recomendacion/monedas-claves-de-escritura)). `Intl.NumberFormat('es-ES', {style:'currency', currency:'EUR'})` devuelve `12,50 €` con espacio de no separación (comprobado en Node; API en [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)).
- **Hay que corregir el contraste de la paleta en el texto pequeño.** Con WCAG 1.4.3 (4,5:1 para texto normal, [W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)), el terracota sobre papel da **4,31:1**, `ink/60` da **4,34:1** y `ink/40` (precio tachado) da **2,44:1**. Los tres fallan a tamaño normal (cálculo propio con los tokens de `src/index.css`).
- **Menú del día:** va como primera sección de la carta y primer chip, en una card destacada con precio cerrado. Toast recomienda colocar los especiales arriba del todo ([Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ)). NN/g desaconseja los carruseles con muchas diapositivas y el avance automático en móvil ([NN/g, Carousels](https://www.nngroup.com/articles/designing-effective-carousels/)).
- **Objetivos táctiles de ≥44 px en chips y cards.** WCAG 2.2 AA exige 24 px ([2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). Apple fija 44×44 pt como tamaño por defecto ([HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)). M3 pide 48 dp en chips ([M3 Chips](https://m3.material.io/components/chips/guidelines)). Además, la barra sticky no debe tapar el foco ([WCAG 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)).

---

## 1. Patrones de navegación por categorías

### 1.1 Qué dicen las fuentes

| Patrón | A favor | En contra | Fuente |
|---|---|---|---|
| **Pestañas que filtran** (el comportamiento actual) | Dividen el contenido en trozos fáciles de recorrer. | Si hay muchas, la barra se convierte en un carrusel y las pestañas ocultas se descubren peor. Obligan a ir cambiando de pestaña para comparar. NN/g recomienda etiquetas de 1 o 2 palabras y no escribirlas en mayúsculas. | [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) |
| **Control segmentado** | Muy claro con pocas opciones. | Apple recomienda unos 5 segmentos como máximo en iPhone, así que no sirve para 12 categorías. | [Apple HIG, Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) |
| **Chips / pills con scroll horizontal** | M3: si el conjunto ocupa una sola fila, los chips pueden desplazarse en horizontal. Pide ≥8 dp entre chips y un objetivo táctil de 48 dp. | Lo que queda fuera de la pantalla en horizontal se descubre poco. No hay que esconder contenido esencial detrás de un scroll lateral. | [M3 Chips](https://m3.material.io/components/chips/guidelines), [NN/g, Horizontal scrolling](https://www.nngroup.com/articles/horizontal-scrolling/) |
| **Tabs con scroll** | M3: las tabs pueden desplazarse en horizontal, así que admiten tantas como haga falta. | Mismo problema de descubrimiento que con los chips. | [M3 Tabs overview](https://m3.material.io/components/tabs/overview) |
| **Índice con enlaces internos (anclas)** | Dan una visión general de la página y permiten saltar a una sección. En el estudio de NN/g los participantes los usaron y los valoraron. NN/g recomienda rotularlos, por ejemplo «En esta página». | Si no se diseñan con intención, pueden sorprender: el usuario espera que el enlace le lleve a otra página. | [NN/g, In-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/) |
| **Índice sticky con la sección actual resaltada** (scrollspy) | Informa del avance y de dónde está el usuario. La animación sutil ayuda a descubrir el índice. | Los índices sticky *colapsados* pasaron desapercibidos a muchos usuarios en las pruebas. | [NN/g, Table of Contents](https://www.nngroup.com/articles/table-of-contents/) |
| **Acordeones** | En móvil condensan la información y dan una visión general. | Si el contenido es largo, obligan a hacer mucho scroll y pueden desorientar. El contenido plegado se descubre peor. | [NN/g, Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/), [NN/g, Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/) |

Sobre las cabeceras sticky en móvil, NN/g recomienda mantenerlas pequeñas y con fondo opaco (no translúcido) y valorar si compensan el espacio que ocupan ([NN/g, Sticky Headers](https://www.nngroup.com/articles/sticky-headers/)). Baymard describe como patrón eficiente en móvil las tiras horizontales de subcategorías en chips, y la barra sticky de categorías como ayuda para orientarse en scrolls largos ([Baymard, Category pages](https://baymard.com/blog/ecommerce-category-page)). También recomienda resaltar el ámbito actual en la navegación ([Baymard, Navigation](https://baymard.com/research-articles/ecommerce-navigation-best-practice)).

La atención se concentra arriba: en el estudio de NN/g, el 57 % del tiempo se dedicó a lo que se ve sin hacer scroll y el 74 % a las dos primeras pantallas ([NN/g, Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)). **[Inferencia]** Las categorías del final (Quesos, Ensaladas, Postres, Otros) necesitan un acceso directo desde arriba. Si no, casi nadie las verá.

### 1.2 Qué hacen los productos reales

- **Uber Eats** (página web de un gastrobar de Madrid): una sola página con la lista de categorías como enlaces bajo «Menú» (RACIONES, BEBIDAS, HAMBURGUESAS, Bocadillos, Sandwiches, Ensaladas…) y, debajo, cada categoría como sección con su título ([página observada](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg)). **[No verificado]** Si esa lista es sticky y si resalta la categoría visible, porque solo se pudo leer el contenido de la página, no verla en un navegador.
- **Square Online**: con la plantilla «Order Online», cada categoría es una sección dentro de la misma página y no se pueden crear páginas de categoría separadas ([Square](https://squareup.com/us/en/the-bottom-line/starting-your-business/how-to-start-a-free-online-store)).
- **Toast Online Ordering**: en móvil se puede abrir un panel inferior con todas las categorías y el número de platos de cada una, y cambiar de sección sin perder el sitio en la página. Además tiene un buscador que busca en nombres y descripciones ([Toast FAQ](https://support.toasttab.com/en/article/Online-Ordering-FAQ)).
- **Just Eat** (bar-restaurante de Madrid): categorías muy parecidas a las de Casa Candy («Raciones; Bocadillos y Montados; Burgers y Sándwiches; Platos Combinados; Bebidas») y precios con formato «9,50 €» ([página](https://www.just-eat.es/restaurants-bar-restaurante-8-de-diciembre-madrid/menu), según el extracto del buscador). **[No verificado]** La maquetación visual: la extracción de la página no devolvió la carta.
- **Glovo, Deliveroo, TheFork, me&u/Mr Yum**: **[No verificado]**. Sus páginas públicas no devolvieron la carta sin sesión o sin dirección, y no había navegador disponible. Lo único verificable de me&u es que es una carta web que se abre con un QR ([Square App Marketplace, me&u](https://squareup.com/us/en/app-marketplace/app/me-u)).

### 1.3 Cuándo usar cada patrón (aplicado a Casa Candy)

- **Pestañas que filtran:** solo con 2 a 5 grupos grandes y parecidos en tamaño ([NN/g](https://www.nngroup.com/articles/tabs-used-right/), [Apple](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)). **[Inferencia]** Casa Candy tiene 12 grupos muy desiguales (de 1 a 8 platos). Filtrar por «Ensaladas» deja una pantalla con un solo plato y obliga a volver a tocar para ver el resto.
- **Scroll continuo + chips sticky + scrollspy:** la opción por defecto para 12 categorías. Se descubre todo haciendo scroll y la barra sirve de atajo. Las fuentes son las de la tabla anterior.
- **Índice completo (panel inferior o bloque «En esta carta» al principio):** compensa que los chips del final queden fuera de la pantalla ([NN/g, Horizontal scrolling](https://www.nngroup.com/articles/horizontal-scrolling/), [Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ)).
- **Acordeones por categoría:** solo si la carta creciera mucho. Tienen coste de descubrimiento ([NN/g](https://www.nngroup.com/articles/accordions-on-desktop/)).

**Detalles de implementación con fuente:**
- El scrollspy se puede hacer con `IntersectionObserver`, que detecta de forma asíncrona cuándo un elemento entra en el viewport sin cargar el hilo principal ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)).
- Para que al saltar a una sección su título no quede debajo de la barra sticky, se usa `scroll-margin-top` en las secciones ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top)) o `scroll-padding` (técnica [W3C C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)). Esto enlaza con el criterio 2.4.11 (sección 4).
- **[Inferencia]** Al cambiar la categoría activa, conviene desplazar la barra para que el chip activo quede visible. Si no, el resaltado se produce fuera de la pantalla.

---

## 2. Cards de plato

### 2.1 ¿Card, lista o rejilla?

- M3: las cards muestran contenido sobre un único tema, y se desaconseja meter contenido en cards cuando el espacio, los títulos o los separadores bastan para crear jerarquía. En pantallas compactas (<600 dp) sugiere cambiar las cards por listas, que muestran imagen y texto de forma más compacta ([M3 Cards](https://m3.material.io/components/cards/guidelines)). Las listas deben ir de borde a borde en móvil ([M3 Lists](https://m3.material.io/components/lists/guidelines)).
- NN/g: con elementos muy homogéneos (productos parecidos), conviene más una lista vertical que cards para poder recorrerlos y compararlos. En una lista, el precio está siempre en el mismo sitio. En cards de tamaño variable, no ([NN/g, Cards](https://www.nngroup.com/articles/cards-component/)).
- Baymard: rejilla para productos que se eligen por la imagen, lista para productos con muchos datos ([Baymard, PLP](https://baymard.com/blog/product-listing-page-plp-ux)). Una rejilla con mucha información alarga los elementos y empeora la comparación ([Baymard, Telco](https://baymard.com/research-articles/2021-telco-benchmark)). En cada elemento, la misma información debe aparecer de forma coherente y con estilos que la diferencien ([Baymard, List item design](https://baymard.com/research-articles/list-item-design-ecommerce)).

**[Inferencia] Para Casa Candy:** «card» debería entenderse como *contenedor visual del plato* (superficie, borde o fondo que agrupa nombre, descripción y precio), no como obligación de usar una rejilla con foto. En móvil, 1 columna. Solo tendría sentido una rejilla de 2 columnas si casi todos los platos tuvieran foto, y no es el caso: 7 de 53. A 360 px de ancho, 2 columnas dejan unos 160 px por card. Ahí nombres como «Bocadillos y sándwiches» o «Huevos rotos con jamón» se parten en 3 o 4 líneas y el precio cambia de posición en cada card, justo lo que NN/g señala como problema.

### 2.2 Cartas con fotos mixtas

- Uber Eats (observado): en la misma carta, todos los platos de RACIONES tienen miniatura y los de HAMBURGUESAS, ESPECIALIDADES o Bocadillos no. Conviven sin placeholder en el texto extraído ([Uber Eats](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg)). **[No verificado]** Si visualmente reservan un hueco vacío para la foto.
- Toast: las imágenes y las descripciones **no son obligatorias** para publicar la carta. Recomienda las descripciones porque el buscador las usa. Tamaño recomendado de imagen de plato: 750 × 450 px ([Toast FAQ](https://support.toasttab.com/en/article/Online-Ordering-FAQ)). También recomienda añadir imágenes para que los platos resulten más atractivos ([Toast Platform guide](https://doc.toasttab.com/doc/platformguide/platformMenuManagerWorkingWithMenuItems.html)).
- Uber Eats (a los restaurantes): los platos con foto venden más; recomienda fotografiar tantos como sea posible ([Uber Eats blog](https://www.uber.com/au/en/blog/6-ways-to-optimise-your-uber-eats-menu)). Proporción recomendada entre 5:4 y 6:4, un solo plato por foto y sin texto ([Uber Help](https://help.uber.com/merchants-and-restaurants/article/merchant-submitted-menu-catalog-photo-guidelines?nodeId=6985355b-0426-4523-94f2-89bb9b0566e9)). **[No verificado]** No publican una cifra concreta del aumento.
- NN/g: los usuarios examinan las fotos que informan (producto real) e ignoran las decorativas ([NN/g, Photos as Web Content](https://www.nngroup.com/articles/photos-as-web-content/)). Si las imágenes no aportan, los usuarios las rodean como si fueran obstáculos ([NN/g, Zigzag layouts](https://www.nngroup.com/articles/zigzag-page-layout/)).

**[Inferencia] Reglas para Casa Candy:**
1. **No usar placeholders grises.** No informan (NN/g) y, con 43 platos sin foto real, llenarían la carta de huecos repetidos. En los 9 platos con placeholder se debería tratar como «sin foto».
2. **Un diseño base sin imagen** (nombre, descripción, precio) y una **variante con foto**. Da igual que la variante añada una miniatura o una banda superior: el orden del texto y la posición del precio no deben cambiar, para mantener la coherencia que pide Baymard.
3. **Si se quiere un recurso visual en los platos sin foto,** mejor algo tipográfico o de categoría (inicial en Fraunces o una ilustración lineal por categoría) que un falso hueco de imagen. Así sigue siendo decorativo y se reconoce como tal.
4. Los platos más caros (chuletón a 46,50 €, entrecot) no tienen foto. Se pueden destacar con tipografía y jerarquía, o priorizarlos en la próxima sesión de fotos: el consejo de Uber Eats es fotografiar primero los platos más populares ([Uber Eats merchants](https://merchants.ubereats.com/us/en/restaurant-submitted-photos)).

### 2.3 Jerarquía y precio

- **Orden de lectura:** nombre (Fraunces, el elemento más destacado), descripción (Work Sans, 2 líneas como máximo) y precio siempre en la misma posición. Baymard pide que los elementos se distingan visualmente entre sí ([Baymard](https://baymard.com/research-articles/list-item-design-ecommerce)) y NN/g que el precio esté en un lugar predecible ([NN/g](https://www.nngroup.com/articles/cards-component/)).
- **Formato del euro:** en España el símbolo se pospone y se separa con un espacio, «15 €» ([FundéuRAE, monedas](https://www.fundeu.es/recomendacion/monedas-claves-de-escritura); [FundéuRAE, símbolos de divisa](https://www.fundeu.es/consulta/uso-de-los-simbolos-de-divisa-13368)). El código actual (`€{dish.price.toFixed(2)}` en `DishCard.tsx`) produce `€12.50`: símbolo delante y punto decimal. **Hay que cambiarlo.** `new Intl.NumberFormat('es-ES', {style:'currency', currency:'EUR'})` devuelve `12,50 €` con U+00A0 (espacio de no separación) entre cifra y símbolo, así que el precio nunca se parte en dos líneas (verificado localmente; API en [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)). Uber Eats España muestra «14,95€» sin espacio ([observado](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg)) y Just Eat «9,50 €» con espacio ([Just Eat](https://www.just-eat.es/restaurants-bar-restaurante-8-de-diciembre-madrid/menu)). Solo Just Eat sigue la norma de Fundéu.
- **Alineación:** **[Inferencia]** precio alineado a la derecha y con `tabular-nums` (ya se usa) para que las cifras queden en columna al bajar por la lista. La línea de puntos actual («nombre ······ precio») es un recurso clásico de carta impresa que refuerza esa alineación. Encaja bien en la dirección editorial.

### 2.4 Badges y estados

- En M3, los *badges* sirven para notificaciones y contadores sobre iconos de navegación, no para etiquetas como «Nuevo». Si se usan colores propios, deben tener al menos 3:1 de contraste ([M3 Badges](https://m3.material.io/components/badges/guidelines)). **[Inferencia]** Para «Nuevo», «Recomendado» o «Popular» conviene una **etiqueta de texto** (pill pequeña) y no un punto de color.
- El color no puede ser el único medio para transmitir información ([WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). «No disponible» tiene que estar escrito, no solo expresado con gris u opacidad. Hoy existe como texto «No disp.» a 8 px sobre la foto (`DishCard.tsx`). **[Inferencia]** Sin foto, ese aviso desaparecería, así que tiene que pasar a la zona de texto.
- Destacar los más vendidos ayuda a quien no conoce el sitio: NN/g recomienda orientar a los clientes nuevos con los más vendidos ([NN/g, UX lessons from restaurants](https://www.nngroup.com/articles/ux-learn-in-restaurants/)). Uber Eats muestra en sus platos «Popular» y «#1 de tus favoritos» ([observado](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg)).
- **Descuento:** el precio tachado actual usa `text-ink/40`, que da **2,44:1** sobre papel. Incumple WCAG 1.4.3, que exige 4,5:1 para texto normal ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). **[Inferencia]** Hay que subirlo al menos a `ink/65` (5,08:1) y dar el ahorro también en texto, por ejemplo «−20 %», con el % separado por espacio como indica [FundéuRAE](https://www.fundeu.es/consulta/espacio-tipografico-1727).

---

## 3. Menú del día y ofertas

- **Toast:** para que los especiales aparezcan arriba, recomienda crear un menú «Specials» y ordenarlo por encima del resto, o un grupo «Specials» colocado en primer lugar con una descripción ([Toast FAQ](https://support.toasttab.com/en/article/Online-Ordering-FAQ)).
- **Baymard:** en las páginas de categoría, la navegación por subcategorías debe ir antes que los banners promocionales ([Baymard, Category pages](https://baymard.com/blog/ecommerce-category-page)). Recomienda además no dar demasiado protagonismo a la publicidad en la portada ([Baymard, Navigation](https://baymard.com/research-articles/ecommerce-navigation-best-practice)).
- **NN/g sobre carruseles:** 5 diapositivas como máximo y sin avance automático en móvil ([NN/g, Carousels](https://www.nngroup.com/articles/designing-effective-carousels/)).
- **Just Eat:** las ofertas combinadas aparecen como un plato más con nombre explícito, por ejemplo «Oferta Bocadillo y Bebida» ([Just Eat, Super Bocatas](https://www.just-eat.es/restaurants-super-bocatas-madrid/menu), según el extracto del buscador). **[No verificado]** Su tratamiento visual.

**[Inferencia] Propuesta para Casa Candy:** convertir el menú del día, que hoy es un filtro aparte, en la **primera sección de la carta** y el **primer chip** de la barra. Iría en una card destacada, por ejemplo con fondo oliva y texto papel (5,28:1, cumple AA), que muestre:
- el precio cerrado en grande;
- «Primeros» y «Segundos» como listas de texto dentro de la misma card;
- qué incluye (pan, bebida, postre o café) y el horario.

Los platos del menú no llevan precio individual; el componente ya contempla ese caso con `hidePriceInDailyMenu`. No debe ser un carrusel ni un banner que tape la carta. Si el menú solo se sirve a mediodía, la card puede indicarlo en lugar de desaparecer, para que el cliente de la noche no lo busque.

---

## 4. Accesibilidad y usabilidad

### 4.1 Objetivos táctiles

| Referencia | Valor |
|---|---|
| WCAG 2.2 · 2.5.8 (AA) | ≥ 24 × 24 px CSS, o separación suficiente ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)) |
| WCAG 2.2 · 2.5.5 (AAA) | ≥ 44 × 44 px CSS ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)) |
| Apple HIG | 44 × 44 pt por defecto, mínimo 28 × 28 pt; unos 12 pt de separación alrededor de elementos con borde ([Apple](https://developer.apple.com/design/human-interface-guidelines/accessibility)) |
| Material 3 | Chips: objetivo de 48 dp y ≥ 8 dp entre chips ([M3 Chips](https://m3.material.io/components/chips/guidelines)); tabs con texto: 48 dp de alto ([M3 Tabs specs](https://m3.material.io/components/tabs/specs)) |
| NN/g | ≥ 1 cm × 1 cm físicos ([NN/g, Touch targets](https://www.nngroup.com/articles/touch-target-size/)) |

**[Inferencia]** Los filtros actuales (`text-xs`, `pb-1`) son objetivos de unos 20 px de alto, por debajo del mínimo AA de WCAG. Chips de 44 a 48 px de alto con 8 px de separación cumplen todas las referencias. Toda la card del plato ya es un `<button>`, así que su área táctil es amplia.

### 4.2 Contraste con la paleta «Mercado Mediterráneo»

Cálculo propio con la fórmula de WCAG a partir de los tokens HSL de `src/index.css`. Umbrales: 4,5:1 para texto normal y 3:1 para texto grande (≥ 24 px, o ≥ 18,5 px en negrita) ([W3C 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)); 3:1 para componentes de interfaz ([W3C 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)).

| Combinación | Ratio | Texto normal | Texto grande |
|---|---|---|---|
| ink sobre papel | 15,53 | ✅ | ✅ |
| **terracota (L47 %) sobre papel** | **4,31** | ❌ | ✅ |
| terracota sobre blanco (card) | 4,68 | ✅ | ✅ |
| terracota oscurecido L42 % (`--earth-terracotta`) sobre papel | 5,17 | ✅ | ✅ |
| oliva sobre papel | 5,28 | ✅ | ✅ |
| **ink/60 sobre papel** (descripciones) | **4,34** | ❌ | ✅ |
| ink/65 sobre papel | 5,08 | ✅ | ✅ |
| **ink/40 sobre papel** (precio tachado) | **2,44** | ❌ | ❌ |
| blanco sobre terracota (botón o badge) | 4,68 | ✅ | ✅ |
| papel sobre oliva (card del menú del día) | 5,28 | ✅ | ✅ |
| `--line` sobre papel (bordes) | 1,44 | n/a (decorativo) | — |

**[Inferencia]** Para precios y chips activos en terracota sobre papel, usar la variante L42 % (ya existe como `--earth-terracotta`) o poner el texto sobre una card blanca. Las descripciones deben ir al menos a `ink/65`. Si el borde `--line` (1,44:1) es lo único que marca los límites de una card pulsable, no llega al 3:1 de 1.4.11. Hay dos opciones: diferenciar la card por el fondo (blanco sobre papel) más la jerarquía del texto, o aceptar que el borde es decorativo porque el nombre y el precio ya identifican el elemento. Esto último es interpretable y conviene revisarlo con el criterio 1.4.11.

### 4.3 Barra sticky y foco

- WCAG 2.4.11 (AA): el componente que recibe el foco de teclado no puede quedar totalmente oculto por contenido del autor. Las cabeceras y pies sticky son el caso típico, y `scroll-padding` es una técnica suficiente ([W3C 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [C43](https://www.w3.org/WAI/WCAG22/Techniques/css/C43)).
- NN/g: la barra sticky debe ser compacta, opaca y con buen contraste respecto al contenido ([NN/g](https://www.nngroup.com/articles/sticky-headers/)).
- Si se usa desplazamiento suave al tocar un chip, que respete `prefers-reduced-motion`. Poder desactivar las animaciones provocadas por interacción es el criterio 2.3.3, de nivel AAA ([W3C 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).

### 4.4 Legibilidad

- Apple: 17 pt por defecto y 11 pt como mínimo para el texto en iOS ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)). NN/g habla de unos 16 pt para texto legible en cabeceras móviles ([NN/g, Sticky Headers](https://www.nngroup.com/articles/sticky-headers/)). **[Inferencia]** El aviso «No disp.» actual, a 8 px, está muy por debajo. Las descripciones a `text-sm` (14 px) son el mínimo razonable.
- NN/g desaconseja las etiquetas en mayúsculas en tabs porque se leen peor ([NN/g, Tabs](https://www.nngroup.com/articles/tabs-used-right/)). Los filtros actuales usan `uppercase`. **[Inferencia]** En los chips conviene escribir los nombres de categoría normales («Huevos rotos», no «HUEVOS ROTOS»).

### 4.5 Rendimiento e imágenes

- `loading="lazy"` en imágenes fuera de la pantalla inicial, sin aplicarlo a las que se ven al cargar. `width` y `height` en todas las `<img>` para evitar saltos de maquetación ([web.dev](https://web.dev/articles/browser-level-image-lazy-loading)).
- **[Inferencia]** Con solo 7 fotos, el peso de la carta lo marcan sobre todo las fuentes y el JS, no las imágenes. Las fotos deberían servirse ya recortadas a la proporción del diseño: 750 × 450 px según Toast ([Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ)), o entre 5:4 y 6:4 según Uber ([Uber Help](https://help.uber.com/merchants-and-restaurants/article/merchant-submitted-menu-catalog-photo-guidelines?nodeId=6985355b-0426-4523-94f2-89bb9b0566e9)).
- Hoy, `DishCard.tsx` pinta `<img src={dish.image}>` aunque no haya imagen. Sin foto hay que no renderizar la etiqueta `<img>`.

---

## 5. Tres direcciones de diseño para Casa Candy

Las tres comparten una base mínima que la investigación justifica en cualquier caso:
- scroll continuo por secciones en lugar de filtros;
- precio en formato `12,50 €`;
- contrastes corregidos;
- objetivos táctiles de ≥ 44 px;
- menú del día como primera sección;
- nada de placeholders grises.

Donde difieren es en la navegación, en el tipo de card y en el tono.

### Dirección A · «Pizarra editorial»: carta tipográfica sin fotos

**Idea:** convertir la falta de fotos en estilo. La carta se lee como una carta impresa de bar español: Fraunces para las categorías y los nombres, línea de puntos hasta el precio y separadores finos. Las 7 fotos no se muestran en la lista. Se ven en el `DishModal` (o con un pequeño icono de cámara junto al nombre).

- **Navegación:** índice «En esta carta» al principio con las 12 categorías en 2 columnas de enlaces (cabe entero en una pantalla y no depende del scroll lateral) y un botón flotante o un pie discreto «Índice» que lo vuelve a abrir. No hay barra sticky, o hay una muy pequeña que solo muestra la categoría actual.
- **Card:** fila de lista sin contenedor (nombre · puntos · precio, y descripción debajo). Es lo que M3 recomienda cuando el espacio y los separadores bastan para la jerarquía.
- **Fuentes en las que se apoya:**
  - [M3 Cards](https://m3.material.io/components/cards/guidelines): no forzar cards y usar listas en compacto.
  - [NN/g Cards](https://www.nngroup.com/articles/cards-component/): lista para elementos homogéneos y precio predecible.
  - [NN/g Photos](https://www.nngroup.com/articles/photos-as-web-content/): no usar imágenes de relleno.
  - [NN/g In-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/): índice rotulado.
  - [NN/g Sticky headers](https://www.nngroup.com/articles/sticky-headers/): valorar si la barra compensa.
- **Riesgos para esta carta:**
  - Ocultar las pocas fotos que hay renuncia a lo que Uber Eats dice que vende más ([Uber](https://www.uber.com/au/en/blog/6-ways-to-optimise-your-uber-eats-menu)).
  - Sin barra sticky, volver al índice desde Postres cuesta más.
  - Es lo que más se parece a la lista actual, así que puede no percibirse como «rediseño con cards».
  - Las categorías de 1 a 3 platos quedan bien, porque en una lista tipográfica no se notan los huecos.

### Dirección B · «Mercado en tarjetas»: cards de 1 columna con tratamiento sin foto

**Idea:** cards reales (fondo blanco sobre papel, esquinas suaves) en una sola columna, con dos variantes que mantienen la misma estructura de texto:
- **Con foto:** banda de imagen en 5:3 encima del texto. Se usa en los 7 platos con foto.
- **Sin foto:** la card empieza directamente por el nombre, con una marca de categoría (inicial en Fraunces en terracota o un pequeño icono lineal) en la esquina.

El precio va siempre abajo a la derecha. Las etiquetas «Recomendado», «Nuevo» y «No disponible» van escritas, en una pill. El menú del día es una card oliva destacada al principio.

- **Navegación:** barra sticky de chips con scroll horizontal (48 px de alto) y resaltado de la sección visible. El primer chip es «Menú del día», con icono. Al final, un chip «Todas ▾» que abre un panel inferior con las 12 categorías y el número de platos, como Toast.
- **Fuentes en las que se apoya:**
  - [M3 Chips](https://m3.material.io/components/chips/guidelines): scroll horizontal, 48 dp y 8 dp de separación.
  - [NN/g TOC](https://www.nngroup.com/articles/table-of-contents/): resaltar la sección actual.
  - [Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ): panel inferior con contadores; especiales arriba.
  - [Baymard List items](https://baymard.com/research-articles/list-item-design-ecommerce): coherencia entre elementos.
  - [Uber Eats observado](https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg): fotos mixtas en la misma carta.
- **Riesgos para esta carta:**
  - Con 43 cards sin foto y 7 con foto, las de foto «saltan» mucho y pueden dar sensación de carta incompleta. Es importante que la variante sin foto se vea intencionada y no a medias.
  - Las cards ocupan más alto que una fila, así que la carta de 50 platos se hace larga (la atención cae tras las dos primeras pantallas, según [NN/g](https://www.nngroup.com/articles/scrolling-and-attention/)). Por eso son imprescindibles los chips y el panel.
  - Las secciones de 1 a 3 platos (Ensaladas, Otros, Quesos, Postres) se ven como islas pequeñas. Se puede valorar agruparlas visualmente al final («Para terminar»).
  - El chip activo tiene que desplazarse solo dentro de la barra.

### Dirección C · «Pedido rápido»: compacta tipo app de delivery con scrollspy

**Idea:** densidad de app de delivery. Filas compactas: nombre, descripción de 1 o 2 líneas y precio a la izquierda; a la derecha, miniatura cuadrada de unos 88 px *solo si hay foto*. Sin foto, el texto ocupa todo el ancho. Encima de la carta, un carrusel horizontal «Lo más pedido», con las 7 fotos y los platos top como máximo 5 elementos. La navegación va en tabs subrayadas sticky con scrollspy, además de un buscador.

- **Navegación:** tabs de texto sticky con scroll horizontal y el indicador subrayado moviéndose según el scrollspy. Buscador de platos que busca en nombres y descripciones.
- **Fuentes en las que se apoya:**
  - [M3 Tabs](https://m3.material.io/components/tabs/overview): scroll horizontal; 48 dp e indicador de 3 dp según los [specs](https://m3.material.io/components/tabs/specs).
  - [NN/g TOC](https://www.nngroup.com/articles/table-of-contents/): resaltar la sección actual.
  - [M3 Lists](https://m3.material.io/components/lists/guidelines): de borde a borde en móvil.
  - [Toast](https://support.toasttab.com/en/article/Online-Ordering-FAQ): búsqueda en nombre y descripción.
  - [NN/g Carousels](https://www.nngroup.com/articles/designing-effective-carousels/): 5 elementos como máximo y sin avance automático.
  - [NN/g UX en restaurantes](https://www.nngroup.com/articles/ux-learn-in-restaurants/): recomendar los más vendidos.
- **Riesgos para esta carta:**
  - Es la dirección más genérica: puede diluir la identidad «Mercado Mediterráneo» y parecerse a Uber Eats. El cliente está sentado en la mesa, no pidiendo a domicilio.
  - Las tabs con 12 categorías se desbordan, que es justo el caso que NN/g señala como problemático ([NN/g](https://www.nngroup.com/articles/tabs-used-right/)). Hace falta el índice complementario.
  - Con solo 7 fotos, el carrusel «Lo más pedido» quedaría sin imagen o con platos que no son los más pedidos. El carrusel es contenido horizontal que poca gente descubre ([NN/g](https://www.nngroup.com/articles/horizontal-scrolling/)).
  - El buscador sobra con 50 platos si la navegación ya funciona.

### Comparación rápida

| | A · Pizarra editorial | B · Mercado en tarjetas | C · Pedido rápido |
|---|---|---|---|
| Navegación | Índice de anclas + botón «Índice» | Chips sticky + scrollspy + panel con contadores | Tabs sticky + scrollspy + buscador |
| Card | Fila tipográfica sin contenedor | Card blanca, 1 columna, 2 variantes | Fila compacta con miniatura opcional a la derecha |
| Fotos | Solo en el modal | Banda superior si hay foto | Miniatura si hay; carrusel «Lo más pedido» |
| Encaje con pocas fotos | Muy alto | Medio-alto (depende de la variante sin foto) | Medio |
| Encaje con la identidad | Muy alto | Alto | Bajo-medio |
| Riesgo principal | Poco «rediseño»; esconde las fotos | Carta larga; secciones pequeñas como islas | Genérica; 12 tabs desbordadas |

---

## Fuentes

**Nielsen Norman Group**
- Tabs, Used Right: https://www.nngroup.com/articles/tabs-used-right/
- Sticky Headers: https://www.nngroup.com/articles/sticky-headers/
- In-Page Links for Content Navigation: https://www.nngroup.com/articles/in-page-links-content-navigation/
- Table of Contents: The Ultimate Design Guide: https://www.nngroup.com/articles/table-of-contents/
- Cards: UI-Component Definition: https://www.nngroup.com/articles/cards-component/
- Beware Horizontal Scrolling: https://www.nngroup.com/articles/horizontal-scrolling/
- Accordions on Mobile: https://www.nngroup.com/articles/mobile-accordions/
- Accordions on Desktop: https://www.nngroup.com/articles/accordions-on-desktop/
- Carousel Usability: https://www.nngroup.com/articles/designing-effective-carousels/
- Photos as Web Content: https://www.nngroup.com/articles/photos-as-web-content/
- Zigzag Image–Text Layouts: https://www.nngroup.com/articles/zigzag-page-layout/
- Scrolling and Attention: https://www.nngroup.com/articles/scrolling-and-attention/
- Touch Targets on Touchscreens: https://www.nngroup.com/articles/touch-target-size/
- Good UX: What I Learned While Working in Restaurants: https://www.nngroup.com/articles/ux-learn-in-restaurants/

**Baymard Institute**
- Product Listing Page (PLP) UX: https://baymard.com/blog/product-listing-page-plp-ux
- 2 Key Design Principles for Product Listing Information: https://baymard.com/research-articles/list-item-design-ecommerce
- 17 Common UX Pitfalls Telco Websites Suffer From (grid vs. list): https://baymard.com/research-articles/2021-telco-benchmark
- Ecommerce Category Pages: https://baymard.com/blog/ecommerce-category-page
- Homepage & Navigation UX Best Practices: https://baymard.com/research-articles/ecommerce-navigation-best-practice
- Food Delivery & Takeout UX Research (resumen público; las pautas detalladas son de pago y no se han consultado): https://baymard.com/research/online-food-delivery

**Material Design 3 / Apple HIG**
- M3 Chips, guidelines: https://m3.material.io/components/chips/guidelines
- M3 Tabs, overview: https://m3.material.io/components/tabs/overview
- M3 Tabs, specs: https://m3.material.io/components/tabs/specs
- M3 Cards, guidelines: https://m3.material.io/components/cards/guidelines
- M3 Lists, guidelines: https://m3.material.io/components/lists/guidelines
- M3 Badges, guidelines: https://m3.material.io/components/badges/guidelines
- Apple HIG, Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG, Segmented controls: https://developer.apple.com/design/human-interface-guidelines/segmented-controls

**W3C / WCAG 2.2**
- 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- 2.4.11 Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- 2.5.5 Target Size (Enhanced): https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Técnica C43 (scroll-padding): https://www.w3.org/WAI/WCAG22/Techniques/css/C43

**Web / implementación**
- web.dev, Browser-level image lazy loading: https://web.dev/articles/browser-level-image-lazy-loading
- MDN, Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- MDN, scroll-margin-top: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top
- MDN, Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

**Norma lingüística**
- FundéuRAE, Monedas, claves de escritura: https://www.fundeu.es/recomendacion/monedas-claves-de-escritura
- FundéuRAE, Uso de los símbolos de divisa: https://www.fundeu.es/consulta/uso-de-los-simbolos-de-divisa-13368
- FundéuRAE, Espacio tipográfico: https://www.fundeu.es/consulta/espacio-tipografico-1727

**Productos observados y documentación de proveedores**
- Uber Eats, página de restaurante (Alvaro's Gastrobar, Madrid): https://www.ubereats.com/es/store/alvaros-gastrobar/erHijrB_Q_uthJNh-GpFlg
- Uber Eats, 6 ways to optimise your menu: https://www.uber.com/au/en/blog/6-ways-to-optimise-your-uber-eats-menu
- Uber Eats, Menu photography guidelines: https://merchants.ubereats.com/us/en/restaurant-submitted-photos
- Uber Help, Merchant submitted menu photo guidelines: https://help.uber.com/merchants-and-restaurants/article/merchant-submitted-menu-catalog-photo-guidelines?nodeId=6985355b-0426-4523-94f2-89bb9b0566e9
- Just Eat, Bar-Restaurante 8 De Diciembre: https://www.just-eat.es/restaurants-bar-restaurante-8-de-diciembre-madrid/menu
- Just Eat, Super Bocatas: https://www.just-eat.es/restaurants-super-bocatas-madrid/menu
- Toast, Online Ordering FAQ: https://support.toasttab.com/en/article/Online-Ordering-FAQ
- Toast, Working with menu items: https://doc.toasttab.com/doc/platformguide/platformMenuManagerWorkingWithMenuItems.html
- Square, How to start a free online store (plantilla «Order Online»): https://squareup.com/us/en/the-bottom-line/starting-your-business/how-to-start-a-free-online-store
- Square App Marketplace, me&u: https://squareup.com/us/en/app-marketplace/app/me-u

**No verificados** (sin carta legible sin sesión o sin navegador): Glovo, Deliveroo, TheFork y la interfaz de me&u/Mr Yum. Tampoco el comportamiento visual (sticky, scrollspy) de Uber Eats y Just Eat.
