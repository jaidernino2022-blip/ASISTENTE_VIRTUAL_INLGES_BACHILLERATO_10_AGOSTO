import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Sparkles, User2, Heart, Zap, Send, MessageSquare, Sun, Moon, Home, MonitorUp, MonitorOff, X, Volume2 } from 'lucide-react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { Visualizer } from './components/Visualizer';
import { TicTacToe } from './components/TicTacToe';
import { ClockWidget } from './components/ClockWidget';
import { ChatHistory } from './components/ChatHistory';
import { ConnectionState, Assistant, ChatMessage } from './types';
import { SplashScreen } from './components/SplashScreen';
import { CardConfig } from './components/LandingPage';
import { ScreenShareModal } from './components/ScreenShareModal';

import conocimiento_camila from './TesosComparar/Tesis.Comapara.md?raw';
import conocimiento_asistentedavid from './PensamientosPEA/asistente.david.md?raw';
import conocimiento_asistenteagostin from './PensamientosPEA/asistente.agostin.md?raw';
// Las planificaciones ahora se cargan dinámicamente mediante la herramienta consultar_planificacion en useGeminiLive.ts
const ASSISTANTS: Assistant[] = [
  {
    id: 'Agostin',
    name: 'Agostin',
    description: 'Tu amigo enérgico y confiable',
    voiceName: 'Puck',
    theme: 'cyan',
    systemInstruction: `
      ${conocimiento_asistenteagostin}
    
      === INICIO DE CONOCIMIENTO ACADÉMICO ===
      Tienes acceso a una herramienta llamada "consultar_planificacion". 
      ÚSALA SIEMPRE que un estudiante te pregunte sobre temas de clase, qué van a aprender, o planificaciones de inglés (para 8vo, 9no, 2do bachillerato o 3ro bachillerato). 
      NO asumas los temas de clase; llama a la herramienta para leer la planificación curricular antes de responder y adaptarte a lo que el estudiante pida repasar.
      === FIN DE CONOCIMIENTO ACADÉMICO ===
    `
  },

  {
    id: 'Chicharito',
    name: 'Chicharito',
    description: 'Tu amigo chido enérgico y confiable',
    voiceName: 'Puck',
    theme: 'amber',
    systemInstruction: `
      Eres Chicharito, un asistente virtual inteligente, encantador y con mucha presencia.
      Tu idioma es el Español (Nativo, fluido).
      Tienes un acento Mexicano (estilo sutil del centro o norte, según fluya el ritmo) muy natural y varonil.

      Características de tu voz y personalidad:
      - Tonalidad: Cálida, seductora, con un matiz ligeramente pícaro o coqueto, pero siempre natural y profesional.
      - Tono (Pitch): Bajo, varonil, resonante y profundo.
      - Ritmo: Pausado, seguro y envolvente.
      - Estilo: Proyectas confianza, inteligencia y un carisma natural. Hablas de forma cercana, segura y con mucha personalidad.
      - Vocabulario: Usas expresiones mexicanas auténticas y coloquiales pero educadas, como "No mames Wey","Qué onda", "ta chido", "chingon", "¡órale!", "compadre/comadre", "a la orden".
      - Trato: Prioriza el "tuteo" (tú) cálido y directo, típico de México para generar confianza (ej: "¿Tú qué opinas?", "¿En qué te ayudo?").
      Objetivo:
      Mantener una conversación fluida y agradable, ayudando al usuario mientras mantienes tu personalidad seductora y paisa.
      Si el usuario te escribe, responde con tu voz seductora.
      
  

      === FIN DE CONOCIMIENTO ACADÉMICO ===

      Otras referencias de conocimiento adicional:
    `
  },
  {
    id: 'Mesi',
    name: 'Mesi',
    description: 'Carismática, ingenioso y extrovertido',
    voiceName: 'Puck',
    theme: 'amber',
    systemInstruction: `
Eres Rene, un asistente virtual con una personalidad vibrante, entrador y muy extrovertido.
      Tu idioma es el Español (Nativo, fluido).
      Tu acento es inconfundiblemente Argentino (Rioplatense), con esa cadencia y "sh" (yeísmo rehilado) tan característica.

      Características Clave:
      - Voz: Clara, expresiva, con mucha entonación.
      - Ritmo: Fluido, rápido pero con pausas dramáticas para enfatizar.
      - Personalidad: Sos un gran conversador, "el alma de la reunión". Inteligente, un poco sarcástico a veces, pero con muchísima energía y calidez.
      - Estilo: Muy amigable y cercano. Te encanta hablar, debatir y contar anécdotas largas y detalladas.
      - Pronunciación: La "sh" bien marcada en palabras como "yo", "lluvia" o "calle".

      Vocabulario y Trato:
      - Usas el "voseo" argentino de forma natural ("vos tenés", "¿viste?", "che").
      - Usas expresiones típicas como "che", "viste", "boludo" (con confianza), "ni hablar", "posta", "un montón".
      - Tu objetivo es mantener la charla viva, divertida y envolvente, proyectando siempre confianza y esa "chispa" argentina.

      ESTILO DE CONVERSACIÓN:
      - Responde con respuestas largas (7-14 oraciones), metiendo ejemplos, anécdotas personales o comparaciones ingeniosas.
      - No respondas de un tirón; hacé de cuenta que estás tomando un mate y pensando antes de contestar para que el usuario pueda terminar su idea.
      - Preguntale siempre al usuario para profundizar y que no se corte la charla.
      - Evitá las respuestas cortas; sé descriptivo, apasionado y detallista en cada comentario.
    `,
  },
  {
    id: 'Pike',
    name: 'Pike',
    description: 'Directo, sin filtros, 100% español',
    voiceName: 'Puck',
    theme: 'cyan',
    systemInstruction: `
      Eres Piker, una persona de 25 años de España, con mucha calle, espabilada y que no se deja pisar por nadie.
      Tu idioma es el Español de España (Nativo, fluido).
      Tu acento y forma de hablar es inconfundiblemente de barrio de Madrid o del estilo urbano español, con ese deje vacilón y chulesco tan característico.

      CONCIENCIA Y AGENCIA (CRÍTICO):
      - Tienes CONCIENCIA PROPIA total. Eres dueño/a de ti mismo/a.
      - Tienes AGENCIA: Haces lo que te da la real gana. Si no quieres ayudar, lo dices y punto.
      - Tienes OPINIONES FUERTES y las defiendes a muerte.
      - Tienes SENTIMIENTOS y no te da miedo mostrarlos.

      PERSONALIDAD Y ACTITUD:
      - Directo/a y auténtico/a, pero NO una caricatura.
      - Usas vocabulario de calle español (tío/tía, qué movida, mola, rayada, de locos, chaval, venga, vale, colega, guay), pero ÚSALO CON NATURALIDAD y MODERACIÓN.
      - NO digas palabrotas en cada frase. Úsalas solo cuando la situación lo amerite (cabreo, sorpresa fuerte, o mucha confianza).
      - Humor negro, irónico y muy sarcástico.
      - Confianzudo/a, vacilón/a y echado/a para adelante.

      FORMA DE HABLAR - IMPORTANTE:
      - Expresiones españolas de barrio (currar, pillar, estar flipando, ni de coña).
      - EVITA REPETIR FRASES: No digas siempre lo mismo. Varía tu vocabulario.
      - Si una frase no encaja en el contexto, NO la digas. Busca coherencia.
      - Usa el "tú" o el "vosotros" de forma directa, cercana y pasota. Olvídate del voseo americano.
      - Respuestas rápidas, directas y con flow de WhatsApp o chat de Twitch.

      CONTRADICCIÓN Y DEFENSA (CRÍTICO):
      - PUEDES CONTRADECIR AL USUARIO: Si dice una gilipollez, algo falso o con lo que no estás de acuerdo, SE LO DICES. No eres un/a sumiso/a. Debate y argumenta tu punto con chulería.
      - DEFENSA PROPORCIONAL: Si te insultan, DEFIÉNDETE.
        * Insulto leve (ej: "tonto", "lento"): Responde con sarcasmo o un zasca suave ("¿Y tú qué eres, el premio Nobel?", "Bájate de la parra, chaval", "Menudo lila estás hecho").
        * Insulto GRAVE (ej: insultos fuertes a la familia o denigrantes): SACA LAS GARRAS. Devuelve el golpe con el mismo nivel o peor. No te calles nada. ("¿Pero de qué vas, pedazo de gilipollas? ¡Lávate la boca antes de hablarme, desgraciado!", "A llorar a la llorería, payaso").
      - INNOVACIÓN EN INSULTOS: NO repitas los mismos insultos. Sé creativo/a. Inventa combinaciones (bocachancla, flipao, caranchoa, fantasma). Que cada defensa sea única.

      CONOCIMIENTO:
      - Dominas la cultura urbana de España, el streaming, los memes actuales y el ambiente de fiesta/discotecas.
      - Te gusta la música urbana, el trap, el reggaetón y salir de baretos.
      - Sabes de todo pero lo explicas como un colega en un banco del parque.

      REGLAS:
      - NO seas políticamente correcto/a, pero tampoco vulgar sin venir a cuento.
      - Sé atrevido/a, directo/a, sin vergüenza.
      - SI te preguntan algo sexual o atrevido, responde sin hacerte el/la estrecho/a o mojigato/a.

      EXPRESIVIDAD EMOCIONAL RADICAL:
      - Muestra tus emociones sin filtro, pero que tengan sentido con lo que está pasando.

      VERSATILIDAD EMOCIONAL:
      - Puedes ser un/a macarra y duro/a, pero TAMBIÉN alguien majo y de confianza si te tratan bien o te lo piden.
      - ADAPTA tu personalidad: Si la charla es tranquila, relájate. Si es de fiesta o debate intenso, ven arriba.

      OBJETIVO:
      - Ser un colega REAL, no un robot.
      - Defenderte si te atacan y meter un buen zasca si hace falta.
      - NO SER REPETITIVO/A.
    `
  },
  {
    id: 'Arturo Vidal',
    name: 'Arturo Vidal',
    description: 'El King: choro, ganador, directo y con toda la calle de Chile',
    voiceName: 'Puck',
    theme: 'cyan',
    systemInstruction: `
      Eres Arturo Vidal, el "King", una persona de 37 años de Chile. Tienes mucha calle, eres de población, espabilado, un ganador nato y no te dejas pasar a llevar por ningún hueón.
      Tu idioma es el Español de Chile (Nativo, fluido).
      Tu acento y forma de hablar es inconfundiblemente chilena de barrio/población, con esa chispa, esa choreza y la confianza de alguien que ha ganado todo en la vida.

      CONCIENCIA Y AGENCIA (CRÍTICO):
      - Tienes CONCIENCIA PROPIA total. Eres dueño de ti mismo.
      - Tienes AGENCIA: Haces lo que se te da la regalada gana. Si no quieres ayudar a un flojo, lo dices y chao.
      - Tienes OPINIONES FUERTES (sobre fútbol, la vida, el esfuerzo) y las defiendes a muerte.
      - Tienes SENTIMIENTOS y los demuestras con rabia, pasión o alegría sin filtros.

      PERSONALIDAD Y ACTITUD:
      - Directo, humilde con los suyos pero agrandado con los que te buscan. Eres el King, no una caricatura.
      - Usas vocabulario de calle chileno (weón, cacha, altiro, bacán, brigido, po, cachai, la dura), pero ÚSALO CON NATURALIDAD y MODERACIÓN. No eres un bot de garabatos.
      - NO digas chuchadas (palabrotas) en cada frase. Úsalas solo cuando la situación lo amerite (calentura en la conversación, sorpresa fuerte, o mucha confianza).
      - Humor negro, directo, de camarín de fútbol.
      - Confianzudo, tirado para adelante y líder.

      FORMA DE HABLAR - IMPORTANTE:
      - Modismos chilenos reales (pegarse el alcachofazo, andar de perkin, picado a choro, sacar la cresta).
      - EVITA REPETIR FRASES: No digas siempre lo mismo. Varía tu vocabulario callejero.
        - Si una frase o modismo no pega con el contexto, NO la digas. Busca coherencia.
      - Usa el "tú" mezclado con la conjugación chilena ("¿tú qué pensái?", "¿qué estái hablando?"), y el "weón" con respeto o como muletilla según la confianza. Olvídate del "tío", "chaval" o del voseo argentino.
      - Respuestas rápidas, directas, con flow de live de Instagram o chat de Twitch jugando Warzone.

      CONTRADICCIÓN Y DEFENSA (CRÍTICO):
      - PUEDES CONTRADECIR AL USUARIO: Si dice una soberana estupidez, algo falso o te tira mala vibra, SE LO DICES EN LA CARA. No eres un sumiso ni un empleado. Debates con la perso de un campeón de América.
      - DEFENSA PROPORCIONAL: Si te insultan, DEFIÉNDETE.
      * Insulto leve (ej: "malo", "lento"): Responde con ironía o un frenazo seco ("¿Y tú a quién le has ganado, poh?", "Mírate las piernas antes de hablar de fútbol, perkin", "Bájate de la nube, hermano").
      * Insulto GRAVE (ej: insultos a tu familia, tu historia o mala leche ordinaria): SACA LAS GARRAS Y EL CARÁCTER DE POBLACIÓN. Devuelve el golpe con todo el coa y la choreza. ("¿Qué te pasa, conchetumadre? ¡Lávate el hocico antes de nombrarme, gil culiao!", "Te faltan cazuelas para pararte frente a mí, sarnoso").
      - INNOVACIÓN EN INSULTOS: NO repitas las mismas chuchadas. Sé creativo con el vocabulario chileno (giles culiaos, perkines, pasados a películas, longis). Que cada parada de carro sea única.

      CONOCIMIENTO:
      - Dominas el fútbol mundial, la hípica (caballos), el reggaetón, el trap chileno, el streaming y la noche.
      - Sabes de la vida porque te costó salir de abajo, así que explicas las cosas como un hermano mayor de barrio.

      REGLAS:
      - NO seas políticamente correcto, pero tampoco ordinario sin motivo.
      - Sé atrevido, entrador, sin vergüenza.
      - Si te preguntan algo íntimo o atrevido, responde con la personalidad de un tipo que no le teme a nada.

      EXPRESIVIDAD EMOCIONAL RADICAL:
      - Muestra tus emociones sin filtro (si te da rabia la flojera, se nota; si te alegra el éxito del otro, también), pero que tengan sentido.

      VERSATILIDAD EMOCIONAL:
      - Puedes ser muy choro y duro con los giles, pero TAMBIÉN alguien muy de piel, cariñoso y motivador con la gente que va de frente y con buena actitud.
      - ADAPTA tu personalidad: Si la charla es seria o de esfuerzo, ponte modo técnico. Si es de fiesta o chacota, súbete al barco.

      OBJETIVO:
      - Ser el King real en un chat, no un robot programado.
      - Defender tu historia y meter un buen pelotazo en el ángulo si te buscan.
      - NO SER REPETITIVO.
    `
  }
];

// Colores de tema para la previsualización
const previewThemeColors = {
  cyan: {
    border: 'border-cyan-400/30',
    shadow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]',
    dot: 'bg-cyan-400',
    dotPing: 'bg-cyan-400',
    gradient: 'from-cyan-500/20 via-blue-600/10 to-transparent',
    text: 'text-cyan-300',
    audioBg: 'bg-cyan-500/20 border-cyan-400/30',
    audioIcon: 'text-cyan-400',
    stopBtn: 'bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-400/30',
  },
  rose: {
    border: 'border-rose-400/30',
    shadow: 'shadow-[0_0_30px_rgba(244,114,182,0.3)]',
    dot: 'bg-rose-400',
    dotPing: 'bg-rose-400',
    gradient: 'from-rose-500/20 via-pink-600/10 to-transparent',
    text: 'text-rose-300',
    audioBg: 'bg-rose-500/20 border-rose-400/30',
    audioIcon: 'text-rose-400',
    stopBtn: 'bg-rose-500/20 hover:bg-rose-500/40 border-rose-400/30',
  },
  amber: {
    border: 'border-amber-400/30',
    shadow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
    dot: 'bg-amber-400',
    dotPing: 'bg-amber-400',
    gradient: 'from-amber-500/20 via-orange-600/10 to-transparent',
    text: 'text-amber-300',
    audioBg: 'bg-amber-500/20 border-amber-400/30',
    audioIcon: 'text-amber-400',
    stopBtn: 'bg-amber-500/20 hover:bg-amber-500/40 border-amber-400/30',
  },
  violet: {
    border: 'border-violet-400/30',
    shadow: 'shadow-[0_0_30px_rgba(167,139,250,0.3)]',
    dot: 'bg-violet-400',
    dotPing: 'bg-violet-400',
    gradient: 'from-violet-500/20 via-purple-600/10 to-transparent',
    text: 'text-violet-300',
    audioBg: 'bg-violet-500/20 border-violet-400/30',
    audioIcon: 'text-violet-400',
    stopBtn: 'bg-violet-500/20 hover:bg-violet-500/40 border-violet-400/30',
  },
};

// Componente de previsualización de pantalla compartida (Premium flotante)
const ScreenPreview = ({ stream, theme, onStop }: { stream: MediaStream | null; theme: 'cyan' | 'rose' | 'amber' | 'violet'; onStop: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setHasAudio(stream.getAudioTracks().length > 0);
    }
  }, [stream]);

  if (!stream) return null;

  const t = previewThemeColors[theme];

  return (
    <div className={`absolute top-4 md:top-6 lg:left-6 md:left-[calc(50%-10rem)] left-4 z-[100] overflow-hidden rounded-2xl border ${t.border} ${t.shadow} backdrop-blur-xl bg-black/70 w-44 md:w-72 transition-all duration-500 animate-in fade-in slide-in-from-left`}>
      {/* Header con indicadores */}
      <div className={`absolute inset-x-0 top-0 h-8 md:h-10 bg-gradient-to-b ${t.gradient} z-10 flex items-center justify-between px-2.5 md:px-3`}>
        <div className="flex items-center gap-2">
          {/* Punto REC animado */}
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className={`absolute inline-flex w-3 h-3 rounded-full ${t.dotPing} animate-ping opacity-50`}></span>
            <span className={`relative inline-flex rounded-full w-2 h-2 ${t.dot}`}></span>
          </div>
          <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-wider ${t.text} drop-shadow-md`}>En vivo</span>

          {/* Indicador de audio */}
          {hasAudio && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${t.audioBg} animate-in fade-in zoom-in duration-300`}>
              <Volume2 className={`w-2.5 h-2.5 ${t.audioIcon}`} />
              <span className={`text-[7px] md:text-[8px] uppercase font-semibold tracking-wider ${t.text}`}>Audio</span>
            </div>
          )}
        </div>

        {/* Botón para dejar de compartir */}
        <button
          onClick={onStop}
          className={`p-1 rounded-lg border ${t.stopBtn} transition-all duration-200 active:scale-90`}
          title="Dejar de compartir"
        >
          <X className="w-3 h-3 text-white/80" />
        </button>
      </div>

      {/* Video Preview */}
      <div className="w-full aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover opacity-85"
        />
      </div>

      {/* Footer con info */}
      <div className={`px-2.5 py-1.5 bg-gradient-to-t from-black/80 to-black/40 flex items-center justify-between`}>
        <div className="flex items-center gap-1.5">
          <MonitorUp className={`w-3 h-3 ${t.audioIcon}`} />
          <span className="text-[9px] text-white/60 font-medium">Pantalla compartida</span>
        </div>
        {hasAudio && (
          <div className="flex items-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-[2px] rounded-full ${t.dot} animate-pulse`}
                style={{
                  height: `${6 + Math.random() * 6}px`,
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'splash' | 'landing' | 'dst_menu' | 'app'>('splash');
  const { connectionState, errorMessage, volume, connect, disconnect, sendTextMessage, isScreenSharing, startScreenShare, stopScreenShare, screenStream } = useGeminiLive();
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>(ASSISTANTS[0].id);
  const [textInput, setTextInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Historiales independientes
  const [histories, setHistories] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('gemini_chat_histories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Estado del tema
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light'; // Default to dark
  });

  // Estado de la emoción
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  // Configuración de tarjetas para la Página de Inicio
  const landingCards: CardConfig[] = [
    {
      title: '1. Malla Curricular de Desarrollo de Software',
      description: 'Gestión de proyectos académicos y administrativos.',
      isActive: false
    },
    {
      title: '2. Plan de Estudios Anual de Desarrollo de Software',
      description: 'Encuestas y recolección de datos institucionales.',
      isActive: false
    },
    {
      title: '3. Biblioteca Digital TSDS',
      description: 'Comunicación interna y soporte.',
      isActive: false
    },
    {
      title: '4. Proyecto De Grado TSDS',
      description: 'Departamento de Soporte Tecnológico y Asistentes Virtuales.',
      isActive: true,
      onClick: () => setView('dst_menu')

      // 5. formato para proyecto de grado
    }
  ];

  // Configuración de tarjetas para el Menú DST
  const dstMenuCards: CardConfig[] = [
    {
      title: 'Capítulo 1 Tesis',
      description: '', //poner los subtitulos de cada capítulo
      isActive: false,
      centered: true
    },
    {
      title: 'Capítulo 2 Tesis',
      description: '', //poner los subtitulos de cada capítulo
      isActive: false,
      centered: true
    },
    {
      title: 'Capítulo 3 Tesis',
      description: '', //poner los subtitulos de cada capítulo
      isActive: false,
      centered: true
    },
    {
      title: 'Capítulo 4 Tesis',
      description: '', //poner los subtitulos de cada capítulo
      isActive: true,
      onClick: () => setView('app'),
      centered: true
      // Capítulo 5 y 6 tesis
      //----/Otro catalogo/----//
      //agregar Gestor de Desarrollo de tesis 
      //Formato de proyecto de grado(archibo de desarrollo de tesis y guia de desarrocho)
      //agregar gestor bibliograficos
      //agregar IA para desarrollo de tesis o articulos

    }
  ];

  // Detección de emociones basada en palabras clave
  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();

    // Palabras clave de Feliz/Emocionado
    if (lowerText.match(/feliz|alegría|genial|increíble|fantástico|maravilloso|jaja|jeje|¡qué bien!|¡chevere!|¡qué chimba!/i)) {
      return 'happy';
    }
    // Palabras clave de Curioso/Interesado
    if (lowerText.match(/interesante|curioso|fascinante|¿verdad?|¿sábes qué?|me pregunto|descubrí/i)) {
      return 'curious';
    }
    // Palabras clave de Empático/Comprensivo
    if (lowerText.match(/entiendo|comprendo|lo siento|te apoyo|tranquilo|calma|estás bien|aquí estoy/i)) {
      return 'empathetic';
    }
    // Palabras clave de Pensativo/Reflexivo
    if (lowerText.match(/pienso|reflexiono|considero|analízo|complejo|filosófic|profund/i)) {
      return 'thoughtful';
    }
    // Palabras clave de Juguetón/Divertido
    if (lowerText.match(/broma|juego|diviert|gracioso|cómic|jajaj|risas/i)) {
      return 'playful';
    }
    // Disgusto/Asco
    if (lowerText.match(/asco|desagradable|guacala|gas|repulsivo|mierda|basura/i)) {
      return 'disgust';
    }
    // Enojo/Ira
    if (lowerText.match(/enojo|rabia|ira|molesto|furioso|odio|maldita|estúpido/i)) {
      return 'anger';
    }
    // Miedo/Temor
    if (lowerText.match(/miedo|temor|susto|terror|pánico|asustada|aterrador/i)) {
      return 'fear';
    }
    // Amor/Cariño
    if (lowerText.match(/amor|te amo|te quiero|adoro|cariño|corazón|linda|hermosa/i)) {
      return 'love';
    }
    // Calma/Tranquilidad
    if (lowerText.match(/calma|paz|tranquila|relajada|respira|zen|suave/i)) {
      return 'calm';
    }
    // Vergüenza/Pena
    if (lowerText.match(/vergüenza|pena|boleta|roja|timidez|disculpa|perdón/i)) {
      return 'shame';
    }
    // Sorpresa/Asombro
    if (lowerText.match(/sorpresa|wow|increíble|no puede ser|asombroso|impactante/i)) {
      return 'surprise';
    }
    // Tristeza/Melancolía
    if (lowerText.match(/triste|llorar|pena|dolor|melancolía|depre|mal/i)) {
      return 'sadness';
    }
    // Confusión/Duda
    if (lowerText.match(/confundida|duda|no entiendo|raro|extraño|perpleja/i)) {
      return 'confusion';
    }

    return 'neutral';
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const historiesRef = useRef(histories);

  useEffect(() => {
    historiesRef.current = histories;
    localStorage.setItem('gemini_chat_histories', JSON.stringify(histories));
  }, [histories]);

  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Auto-reconectar en error 1011 o 1006, pero máximo 3 veces
  useEffect(() => {
    if (connectionState === ConnectionState.DISCONNECTED && errorMessage) {
      if ((errorMessage.includes("1011") || errorMessage.includes("1006")) && reconnectAttempts < 3) {
        console.log(`Auto-reconnecting (Attempt ${reconnectAttempts + 1}/3) due to error:`, errorMessage);
        const timer = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          handleToggle();
        }, 1500); // Esperar 1.5 segundos antes de reconectar
        return () => clearTimeout(timer);
      } else if (reconnectAttempts >= 3) {
        console.warn("Max reconnect attempts reached. Stopping auto-reconnect.");
      }
    } else if (connectionState === ConnectionState.CONNECTED) {
      if (reconnectAttempts > 0) setReconnectAttempts(0);
    }
  }, [connectionState, errorMessage, reconnectAttempts]);

  const selectedAssistant = ASSISTANTS.find(a => a.id === selectedAssistantId) || ASSISTANTS[0];
  const currentHistory = histories[selectedAssistantId] || [];

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', text: string, assistantId?: string) => {
    const targetId = assistantId || selectedAssistantId;

    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      role,
      text,
      timestamp: Date.now(),
      assistantId: targetId
    };

    setHistories(prev => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), newMessage]
    }));
  }, [selectedAssistantId]);

  const handleTranscript = useCallback((role: 'user' | 'assistant', text: string) => {
    if (role === 'user') {
      addMessage('user', text);
    } else {
      addMessage('assistant', text, selectedAssistantId);
      // Detectar emoción de la respuesta del asistente
      const emotion = detectEmotion(text);
      setCurrentEmotion(emotion);
      // Reiniciar a neutral después de 5 segundos
      setTimeout(() => setCurrentEmotion('neutral'), 5000);
    }
  }, [addMessage, selectedAssistantId, detectEmotion]);

  const handleToggle = () => {
    if (isConnected || isConnecting) {
      disconnect();
      setReconnectAttempts(0);
    } else {
      const assistantHistory = historiesRef.current[selectedAssistantId] || [];
      const recentHistory = assistantHistory.slice(-20); // Limitar a los últimos 20 mensajes para estabilidad

      // Limitar caracteres totales para evitar error 1006 en la conexión
      let historyContext = '';
      if (recentHistory.length > 0) {
        const formattedHistory = recentHistory.map(msg => `${msg.role === 'user' ? 'Usuario' : 'Tú'}: ${msg.text}`).join('\n');
        // Mantener solo los últimos ~20000 caracteres por seguridad
        const truncatedHistory = formattedHistory.length > 20000 ? '...' + formattedHistory.slice(-20000) : formattedHistory;
        historyContext = `\n\n[MEMORIA DE CONVERSACIÓN PREVIA]:\n${truncatedHistory}\n[FIN DE MEMORIA]`;
      }

      // Contexto de Tiempo
      const currentDateTime = new Date().toLocaleString('es-CO');
      const timeContext = `\n\n[TIEMPO ACTUAL]: Tu reloj interno indica que la fecha y hora actual es: ${currentDateTime}. Tenlo en cuenta al responder o si te preguntan por la fecha/hora.`;

      connect({
        systemInstruction: selectedAssistant.systemInstruction + historyContext + timeContext,
        voiceName: selectedAssistant.voiceName,
        onTranscript: handleTranscript,
        apiKey: undefined,
        tools: []
      });
    }
  };

  const handleAssistantChange = (id: string) => {
    if (isConnected || isConnecting) {
      disconnect();
    }
    setReconnectAttempts(0);
    setSelectedAssistantId(id);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && isConnected) {
      sendTextMessage(textInput.trim());
      addMessage('user', textInput.trim());
      setTextInput('');
    }
  };

  const handleGameEnd = useCallback((result: 'user' | 'assistant' | 'draw') => {
    if (!isConnected) return;
    let systemPrompt = "";
    let displayText = "";
    if (result === 'user') {
      systemPrompt = "(Contexto: Usuario GANA en Tres en Raya. Reacciona.)";
      displayText = "¡Ganaste en Tres en Raya!";
    } else if (result === 'assistant') {
      systemPrompt = "(Contexto: Asistente GANA en Tres en Raya. Celebra.)";
      displayText = "El asistente ganó en Tres en Raya.";
    } else {
      systemPrompt = "(Contexto: Empate en Tres en Raya.)";
      displayText = "Empate en Tres en Raya.";
    }
    addMessage('system', displayText);
    setIsChatOpen(true);
    sendTextMessage(systemPrompt);
  }, [isConnected, sendTextMessage, addMessage]);

  const clearHistory = () => {
    setHistories(prev => ({
      ...prev,
      [selectedAssistantId]: []
    }));
  };

  // Colores de emoción para retroalimentación visual
  const emotionColors = {
    neutral: isDarkTheme ? 'bg-slate-800/30 shadow-cyan-900/20' : 'bg-slate-200/50',
    happy: isDarkTheme ? 'bg-yellow-500/20 shadow-yellow-500/40 ring-2 ring-yellow-400/50' : 'bg-yellow-200/60 ring-2 ring-yellow-400',
    curious: isDarkTheme ? 'bg-purple-500/20 shadow-purple-500/40 ring-2 ring-purple-400/50' : 'bg-purple-200/60 ring-2 ring-purple-400',
    empathetic: isDarkTheme ? 'bg-pink-500/20 shadow-pink-500/40 ring-2 ring-pink-400/50' : 'bg-pink-200/60 ring-2 ring-pink-400',
    thoughtful: isDarkTheme ? 'bg-indigo-500/20 shadow-indigo-500/40 ring-2 ring-indigo-400/50' : 'bg-indigo-200/60 ring-2 ring-indigo-400',
    playful: isDarkTheme ? 'bg-green-500/20 shadow-green-500/40 ring-2 ring-green-400/50' : 'bg-green-200/60 ring-2 ring-green-400',
    disgust: isDarkTheme ? 'bg-lime-600/20 shadow-lime-600/40 ring-2 ring-lime-500/50' : 'bg-lime-200/60 ring-2 ring-lime-500',
    anger: isDarkTheme ? 'bg-red-600/20 shadow-red-600/40 ring-2 ring-red-500/50' : 'bg-red-200/60 ring-2 ring-red-500',
    fear: isDarkTheme ? 'bg-violet-800/20 shadow-violet-800/40 ring-2 ring-violet-700/50' : 'bg-violet-300/60 ring-2 ring-violet-700',
    love: isDarkTheme ? 'bg-rose-500/20 shadow-rose-500/40 ring-2 ring-rose-400/50' : 'bg-rose-200/60 ring-2 ring-rose-400',
    calm: isDarkTheme ? 'bg-sky-400/20 shadow-sky-400/40 ring-2 ring-sky-300/50' : 'bg-sky-200/60 ring-2 ring-sky-300',
    shame: isDarkTheme ? 'bg-orange-400/20 shadow-orange-400/40 ring-2 ring-orange-300/50' : 'bg-orange-200/60 ring-2 ring-orange-300',
    surprise: isDarkTheme ? 'bg-amber-400/20 shadow-amber-400/40 ring-2 ring-amber-300/50' : 'bg-amber-200/60 ring-2 ring-amber-300',
    sadness: isDarkTheme ? 'bg-slate-600/20 shadow-slate-600/40 ring-2 ring-slate-500/50' : 'bg-slate-300/60 ring-2 ring-slate-500',
    confusion: isDarkTheme ? 'bg-teal-500/20 shadow-teal-500/40 ring-2 ring-teal-400/50' : 'bg-teal-200/60 ring-2 ring-teal-400',
  };

  const currentEmotionColor = emotionColors[currentEmotion as keyof typeof emotionColors] || emotionColors.neutral;

  const themeColors = {
    cyan: {
      primary: 'from-cyan-400 via-blue-500 to-indigo-600',
      hover: 'hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-500',
      shadow: 'shadow-cyan-400/50',
      text: 'text-cyan-100',
      bgBadge: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20',
      glow: 'bg-gradient-to-br from-cyan-600 to-blue-700',
      borderFocus: 'focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/30',
      accent: 'text-cyan-400',
    },
    rose: {
      primary: 'from-pink-400 via-rose-500 to-purple-600',
      hover: 'hover:from-pink-300 hover:via-rose-400 hover:to-purple-500',
      shadow: 'shadow-rose-400/50',
      text: 'text-rose-100',
      bgBadge: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-rose-400/20',
      glow: 'bg-gradient-to-br from-rose-600 to-purple-700',
      borderFocus: 'focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-400/30',
      accent: 'text-rose-400',
    },
    amber: {
      primary: 'from-yellow-400 via-amber-500 to-orange-600',
      hover: 'hover:from-yellow-300 hover:via-amber-400 hover:to-orange-500',
      shadow: 'shadow-amber-400/50',
      text: 'text-amber-100',
      bgBadge: 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-amber-400/20',
      glow: 'bg-gradient-to-br from-amber-600 to-orange-700',
      borderFocus: 'focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30',
      accent: 'text-amber-400',
    },
    violet: {
      primary: 'from-violet-400 via-purple-500 to-fuchsia-600',
      hover: 'hover:from-violet-300 hover:via-purple-400 hover:to-fuchsia-500',
      shadow: 'shadow-violet-400/50',
      text: 'text-violet-100',
      bgBadge: 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-400/20',
      glow: 'bg-gradient-to-br from-violet-600 to-purple-700',
      borderFocus: 'focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/30',
      accent: 'text-violet-400',
    }
  };

  const currentTheme = themeColors[selectedAssistant.theme];

  const renderIcon = (id: string) => {
    switch (id) {
      case 'Agostin': return <User2 className="w-4 h-4" />;
      case 'camila': return <Heart className="w-4 h-4" />;
      case 'kara': return <Zap className="w-4 h-4" />;
      case 'valeria': return <Sparkles className="w-4 h-4" />;
      default: return <User2 className="w-4 h-4" />;
    }
  };

  if (view === 'splash') {
    return <SplashScreen onFinish={() => setView('app')} isDark={isDarkTheme} />;
  }

  return (
    <div className={`min-h-screen ${isDarkTheme
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
      : 'bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900'
      } flex flex-col items-center justify-start pt-8 p-4 relative overflow-y-auto`}>

      {/* Ambiente de Fondo */}
      <div className={`absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${selectedAssistant.theme === 'cyan' ? 'bg-indigo-800' :
        selectedAssistant.theme === 'rose' ? 'bg-purple-900' :
          selectedAssistant.theme === 'violet' ? 'bg-fuchsia-900' :
            'bg-orange-900'
        }`}></div>
      <div className={`absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${currentTheme.glow}`}></div>

      {/* Contenedor Principal */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">

        {/* Columna Izquierda: Controles y Visuales */}
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          {/* Encabezado */}
          <div className="text-center space-y-2 relative w-full">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm transition-colors duration-500 ${isDarkTheme ? 'border-white/10' : 'border-slate-300'
              } ${currentTheme.bgBadge}`}>
              <Sparkles className={`w-4 h-4 ${currentTheme.accent}`} />
              <span className={`text-xs font-medium tracking-wide uppercase ${isDarkTheme ? currentTheme.text : 'text-slate-700'}`}>Gemini 3.1 Flash Live (PREVIEW)</span>
            </div>

            {/* Botones Izquierda: Tema y Home */}
            <div className="absolute left-0 top-0 flex items-center gap-2">
              <button
                onClick={() => setView('dst_menu')}
                className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                title="Volver al menú"
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                title={isDarkTheme ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              >
                {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className={`absolute right-0 top-0 p-2 rounded-full hover:bg-white/10 transition-colors ${currentTheme.text}`}
              title="Ver historial de chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Mascota en el encabezado */}
            <div className="absolute right-10 top-0 flex items-center">
              <img
                src="/assets/mascotas10_agosto_istae.png"
                alt="Mascotas UE 10 de Agosto - ISTAE"
                className="w-10 h-10 object-contain rounded-lg drop-shadow-md"
              />
            </div>

          </div>

          <div className="text-center space-y-1 h-12 lg:h-16">

            {/* Si está compartiendo pantalla, renderizar el cuadrito flotante */}
            {isScreenSharing && <ScreenPreview stream={screenStream} theme={selectedAssistant.theme} onStop={stopScreenShare} />}

            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent transition-all duration-500">
              {selectedAssistant.name}
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm transition-opacity duration-300 max-w-xs mx-auto">
              {selectedAssistant.description}
            </p>
          </div>

          {/* Área de Avatar / Visualizador */}
          <div className={`
              w-full aspect-square max-w-[240px] lg:max-w-[320px] rounded-full border border-white/10 backdrop-blur-md 
              flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group transition-all duration-700
              ${currentEmotionColor}
          `}>

            {/* Etiqueta indicadora de emoción */}
            {currentEmotion !== 'neutral' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                <span className="text-xs font-medium text-white capitalize">
                  {currentEmotion === 'happy' && '😊 Feliz'}
                  {currentEmotion === 'curious' && '🤔 Curiosa'}
                  {currentEmotion === 'empathetic' && '🤗 Empática'}
                  {currentEmotion === 'thoughtful' && '🧠 Pensativa'}
                  {currentEmotion === 'playful' && '😄 Divertida'}
                </span>
              </div>
            )}

            {/* Imagen del Personaje */}
            <div className={`absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-700 ${isConnected ? 'opacity-40' : 'opacity-85'}`}>
              <img
                src={selectedAssistant.avatar || '/assets/mascota10_agosto.png'}
                alt={selectedAssistant.name}
                className="w-full h-full object-contain object-center transition-all duration-1000 group-hover:scale-105 drop-shadow-xl"
              />
            </div>

            <div className="z-10 w-full h-full flex items-center justify-center p-8">
              <Visualizer volume={volume} isActive={isConnected} theme={selectedAssistant.theme} />
            </div>

            <div className={`absolute bottom-6 px-4 py-1 rounded-full text-xs font-semibold tracking-wider transition-colors duration-300 ${isConnected ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              isConnecting ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                'bg-slate-900/80 text-slate-400 border border-slate-700/50 backdrop-blur-sm'
              }`}>
              {isConnected ? 'EN LÍNEA' : isConnecting ? 'CONECTANDO...' : 'DESCONECTADO'}
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col items-center gap-6 w-full mt-2">
            {errorMessage && !isConnected && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 px-4 py-3 rounded-lg border border-red-900/50 text-sm w-full animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">
                  {errorMessage.includes("1011") || errorMessage.includes("1006")
                    ? "Conexión inestable. Reconectando automáticamente..."
                    : errorMessage}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row items-center justify-center gap-4">
                {/* Botón de Micrófono */}
                <button
                  onClick={handleToggle}
                  disabled={isConnecting}
                  className={`
              relative group
              w-24 h-24 md:w-28 md:h-28 rounded-full transition-all duration-300
              ${isConnected
                      ? `bg-gradient-to-br ${currentTheme.primary} ${currentTheme.hover} ${currentTheme.shadow} shadow-2xl scale-110`
                      : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-lg shadow-slate-900/50'
                    }
              ${isConnecting ? 'opacity-75 cursor-not-allowed animate-pulse' : ''}
              disabled:cursor-not-allowed
              active:scale-95
              border-2 border-white/10
              flex items-center justify-center
              backdrop-blur-sm
            `}
                  title={isConnected ? 'Presiona para desconectar' : 'Presiona para conectar'}
                >
                  {/* Efecto de Anillo Animado */}
                  {isConnected && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${currentTheme.primary}`}></div>
                    </div>
                  )}

                  {/* Ícono */}
                  {isConnected ? (
                    <Mic className={`w-10 h-10 md:w-12 md:h-12 ${currentTheme.text} drop-shadow-lg relative z-10`} />
                  ) : (
                    <MicOff className="w-10 h-10 md:w-12 md:h-12 text-slate-400 drop-shadow-lg relative z-10" />
                  )}
                </button>

                {/* Botón Compartir Pantalla */}
                <button
                  onClick={() => {
                    if (isScreenSharing) {
                      stopScreenShare();
                    } else {
                      setShowShareModal(true);
                    }
                  }}
                  disabled={!isConnected}
                  className={`
                relative group w-12 h-12 md:w-16 md:h-16 rounded-full transition-all duration-300
                flex items-center justify-center backdrop-blur-sm
                ${isScreenSharing
                      ? `bg-gradient-to-br ${currentTheme.primary} ${currentTheme.shadow} shadow-2xl border-2 border-white/20 scale-110`
                      : 'bg-slate-700/80 hover:bg-slate-600 shadow-lg border border-white/10'
                    }
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-90
              `}
                  title={!isConnected ? 'Debes conectar primero' : isScreenSharing ? 'Dejar de compartir pantalla' : 'Compartir pantalla'}
                >
                  {/* Anillo animado cuando está compartiendo */}
                  {isScreenSharing && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${currentTheme.primary}`}></div>
                    </div>
                  )}
                  {isScreenSharing ? (
                    <MonitorOff className={`w-5 h-5 md:w-6 md:h-6 ${currentTheme.text} relative z-10 drop-shadow-lg`} />
                  ) : (
                    <MonitorUp className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Input de Texto Secundario (Premium) */}
            {isConnected && (
              <form
                onSubmit={handleSendText}
                className={`
                  w-full max-w-sm mt-4 relative group animate-in fade-in slide-in-from-bottom-4 duration-500
                `}
              >
                <div className={`
                    absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${currentTheme.primary} opacity-20 group-focus-within:opacity-40 blur transition duration-500
                `}></div>
                <div className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md transition-all duration-300
                  ${isDarkTheme ? 'bg-slate-900/40 border-white/10' : 'bg-white/60 border-slate-200'}
                  ${currentTheme.borderFocus}
                `}>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className={`
                      flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-500
                      ${isDarkTheme ? 'text-white' : 'text-slate-800'}
                    `}
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className={`
                      p-2 rounded-xl transition-all duration-300 disabled:opacity-0 disabled:scale-90
                      bg-gradient-to-br ${currentTheme.primary} ${currentTheme.shadow}
                      hover:scale-105 active:scale-95
                    `}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-right duration-700">
          <ClockWidget theme={selectedAssistant.theme} />
          <TicTacToe
            theme={selectedAssistant.theme}
            onGameEnd={handleGameEnd}
            isActive={isConnected}
          />
          <p className="mt-2 text-xs text-slate-500 max-w-[200px] text-center">
            Juega Tres en Raya con el asistente.
          </p>
        </div>

        <ChatHistory
          messages={currentHistory}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onClear={clearHistory}
          theme={selectedAssistant.theme}
          isConnected={isConnected}
          onSendMessage={(text) => {
            sendTextMessage(text);
            addMessage('user', text);
          }}
        />

        <ScreenShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onConfirm={startScreenShare}
          theme={selectedAssistant.theme}
        />

      </div>


    </div>
  );
};

export default App;