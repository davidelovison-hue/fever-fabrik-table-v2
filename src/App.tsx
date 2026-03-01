import { useState, useEffect, useRef } from 'react';

type TabType = 'general' | 'mesas' | 'bono';

interface TicketItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
}

interface ZoneData {
  id: string;
  name: string;
  shortName: string;
  price: number;
  capacity: number;
  description: string;
  features: string[];
  color: string;
}

const SVG_ID_MAP: Record<string, string> = {
  'DJbooth': 'djbooth',
  'cristal': 'cristal',
  'vip': 'vip',
  'cielo': 'cielo',
  'palco_x5F_derecho': 'palco-dcha',
  'placo_x5F_izq': 'palco-izq',
  'backstage_x5F_izquierdo': 'backstage-1',
  'backstage_x5F_derecho': 'backstage-2',
  'pista_x5F_izquierda': 'pista-izq',
  'pista_x5F_derecha': 'pista-dcha',
};

const ZONE_TO_SVG_ID: Record<string, string[]> = {
  'djbooth': ['DJbooth'],
  'cristal': ['cristal'],
  'vip': ['vip'],
  'cielo': ['cielo'],
  'palco-dcha': ['palco_x5F_derecho'],
  'palco-izq': ['placo_x5F_izq'],
  'backstage-1': ['backstage_x5F_izquierdo'],
  'backstage-2': ['backstage_x5F_derecho'],
  'pista-izq': ['pista_x5F_izquierda'],
  'pista-dcha': ['pista_x5F_derecha'],
};

const ZONES: ZoneData[] = [
  {
    id: 'djbooth',
    name: 'DJ Booth',
    shortName: 'DJ Booth',
    price: 1500,
    capacity: 8,
    description: 'La experiencia total en una de las mesas de escenario, detrás del dj y a apenas dos metros de la acción',
    features: ['3 botellas premium', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Aparcacoches', 'Baño privado'],
    color: '#d49bb9',
  },
  {
    id: 'cristal',
    name: 'Cristal 1ª fila',
    shortName: 'Cristal',
    price: 800,
    capacity: 8,
    description: 'Una de las zonas más exclusivas de FABRIK, en frente de la cabina y con las mejores vistas de la sala',
    features: ['2 botellas premium', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Aparcacoches', 'Baño privado', 'Barra privada', 'Ropero privado', 'Acceso terraza'],
    color: '#3099ca',
  },
  {
    id: 'vip',
    name: 'VIP',
    shortName: 'VIP',
    price: 300,
    capacity: 5,
    description: 'Vista panorámica de toda la main room desde una de las esquinas superiores de la misma',
    features: ['1 botella', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Parking VIP', 'Baño privado', 'Barra privada', 'Ropero privado', 'Acceso terraza'],
    color: '#ead500',
  },
  {
    id: 'palco-izq',
    name: 'Palco Izquierdo',
    shortName: 'Palco Izq',
    price: 560,
    capacity: 8,
    description: 'Amplia zona de palcos con mesas amplias y grandes, zona perfecta para grupos numerosos. Situadas en los laterales de la pista en la zona superior',
    features: ['2 botellas', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Parking VIP', 'Baño privado', 'Barra privada', 'Acceso terraza'],
    color: '#a1cae0',
  },
  {
    id: 'palco-dcha',
    name: 'Palco Derecho',
    shortName: 'Palco Dcha',
    price: 560,
    capacity: 8,
    description: 'Amplia zona de palcos con mesas amplias y grandes, zona perfecta para grupos numerosos. Situadas en los laterales de la pista en la zona superior',
    features: ['2 botellas', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Parking VIP', 'Baño privado', 'Barra privada'],
    color: '#a1cae0',
  },
  {
    id: 'backstage-1',
    name: 'Backstage 1ª',
    shortName: 'Backstage 1ª',
    price: 750,
    capacity: 5,
    description: 'Disfruta la inmensidad de FABRIK desde una de las zonas más increíbles y exclusivas, mesas en cabina por encima del DJ para disfrutar de las mejores vistas de la main room del club',
    features: ['2 botellas premium', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Aparcacoches', 'Baño privado', 'Barra privada'],
    color: '#dfa12e',
  },
  {
    id: 'backstage-2',
    name: 'Backstage 2ª/3ª',
    shortName: 'Backstage 2ª/3ª',
    price: 700,
    capacity: 5,
    description: 'Disfruta la inmensidad de FABRIK desde una de las zonas más increíbles y exclusivas, mesas en cabina por encima del DJ para disfrutar de las mejores vistas de la main room del club',
    features: ['2 botellas premium', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Aparcacoches', 'Baño privado', 'Barra privada'],
    color: '#dfa12e',
  },
  {
    id: 'cielo',
    name: 'Cielo',
    shortName: 'Cielo',
    price: 350,
    capacity: 5,
    description: 'Vive el evento en la parte más alta de la discoteca, nuestra zona cielo es perfecta para disfrutar de todo el show audiovisual',
    features: ['1 botella premium', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Parking VIP', 'Baño privado', 'Barra privada', 'Ropero privado', 'Acceso terraza'],
    color: '#86ae1d',
  },
  {
    id: 'pista-izq',
    name: 'Pista Izquierda',
    shortName: 'Pista Izq',
    price: 250,
    capacity: 5,
    description: 'Vive la experiencia exclusiva de nuestra zona VIP pero como si estuvieras en "el barro". Mesas con botella a pie de pista',
    features: ['1 botella', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Parking VIP'],
    color: '#94629a',
  },
  {
    id: 'pista-dcha',
    name: 'Pista Derecha',
    shortName: 'Pista Dcha',
    price: 250,
    capacity: 5,
    description: 'Vive la experiencia exclusiva de nuestra zona VIP pero como si estuvieras en "el barro". Mesas con botella a pie de pista',
    features: ['1 botella', 'Acceso al evento con pulsera y sello de salida', 'Fast access', 'Parking VIP'],
    color: '#94629a',
  },
];

const TICKETS: Record<TabType, TicketItem[]> = {
  general: [
    { id: 'general-1', name: 'Entrada General', subtitle: 'Tercer tramo', price: 30 },
    { id: 'vip-exp', name: 'VIP Experience', subtitle: 'Segundo tramo', price: 90 },
    { id: 'backstage-exp', name: 'Backstage Experience', subtitle: 'Segundo tramo', price: 120 },
  ],
  mesas: ZONES.map(z => ({ id: z.id, name: z.name, subtitle: `Para ${z.capacity} personas`, price: z.price })),
  bono: [
    { id: 'bono-1', name: 'Bono Cultural Joven', subtitle: 'Solo menores de 30', price: 20 },
  ],
};

const HERO_IMAGE = 'https://www.figma.com/api/mcp/asset/03bf645b-2afc-48ce-8ff1-122995f4a427';
const ZONE_IMAGE = 'https://www.figma.com/api/mcp/asset/2bf6125e-a10f-48b7-a86a-9ae90ed40b17';
const FEVER_LOGO = 'https://www.figma.com/api/mcp/asset/d5426a0c-222b-41aa-83b8-9cb157738ebe';

function TicketSelector({ 
  activeTab, 
  onTabChange, 
  quantities, 
  onQuantityChange,
  selectedZone,
  onZoneSelect,
}: { 
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  quantities: Record<string, number>;
  onQuantityChange: (id: string, delta: number) => void;
  selectedZone: string;
  onZoneSelect: (zoneId: string) => void;
}) {
  const currentTickets = TICKETS[activeTab];
  const getQty = (id: string) => quantities[id] || 0;

  return (
    <div 
      className="flex flex-col w-full max-w-[412px]"
      style={{ 
        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.24)',
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <div 
        className="bg-white flex items-center gap-[4px] p-[16px]"
        style={{ 
          borderTopLeftRadius: '8px', 
          borderTopRightRadius: '8px',
          borderBottom: '1px solid #ccd2d8'
        }}
      >
        <svg className="w-[24px] h-[24px] text-[#031419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="flex-1 text-[20px] text-[#031419] font-semibold" style={{ lineHeight: '26px' }}>
          Selecciona tipo de entrada
        </span>
      </div>

      <div className="bg-white flex flex-col overflow-hidden pb-[16px]" style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
        <div className="bg-white px-[16px] overflow-hidden">
          <div className="flex items-center justify-center overflow-x-auto py-[16px]" style={{ borderBottom: '1px solid #ccd2d8' }}>
            <div className="flex gap-[12px] items-center justify-center flex-wrap">
              {(['general', 'mesas', 'bono'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`h-[36px] flex items-center justify-center px-[16px] py-[8px] rounded-[64px] whitespace-nowrap ${
                    activeTab === tab ? 'bg-black text-white' : 'bg-white text-black border border-[#dadadd]'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', lineHeight: '20px' }}
                >
                  {tab === 'general' && 'Entrada General'}
                  {tab === 'mesas' && 'Mesas Main Room'}
                  {tab === 'bono' && 'Bono Cultural Joven'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col px-[16px] pb-[16px]">
          {currentTickets.map((ticket, index) => {
            const qty = getQty(ticket.id);
            const isSelected = qty > 0 || (activeTab === 'mesas' && selectedZone === ticket.id);
            const isLast = index === currentTickets.length - 1;

            return (
              <div 
                key={ticket.id} 
                className="relative flex items-center py-[16px] rounded-[4px] cursor-pointer"
                style={{ marginBottom: isLast ? 0 : '-16px' }}
                onClick={() => activeTab === 'mesas' && onZoneSelect(ticket.id)}
              >
                <div className="flex flex-1 flex-row items-center self-stretch">
                  <div 
                    className="flex flex-1 flex-col gap-[8px] h-full p-[12px] rounded-[4px]"
                    style={{
                      minHeight: '96px',
                      borderLeft: `1px solid ${isSelected ? '#0079ca' : '#ccd2d8'}`,
                      borderTop: `1px solid ${isSelected ? '#0079ca' : '#ccd2d8'}`,
                      borderBottom: `1px solid ${isSelected ? '#0079ca' : '#ccd2d8'}`,
                    }}
                  >
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[14px] text-[#031419] font-semibold" style={{ lineHeight: '18px' }}>
                        {ticket.name} - {ticket.subtitle}
                      </p>
                      <div className="py-[4px]">
                        <p className="text-[12px] text-[#0079ca] font-semibold" style={{ lineHeight: '16px' }}>Ver más</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[4px] justify-end">
                      <p className="text-[14px] text-[#031419] font-semibold" style={{ lineHeight: '18px' }}>
                        {activeTab === 'mesas' ? `desde ${ticket.price}€` : `${ticket.price.toFixed(2)}€`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center self-stretch">
                  <div 
                    className="flex flex-col h-full items-center justify-center p-[12px] rounded-[4px] w-[136px]"
                    style={{
                      minHeight: '96px',
                      background: isSelected ? '#e6f4ff' : 'white',
                      borderRight: `1px solid ${isSelected ? '#0079ca' : '#ccd2d8'}`,
                      borderTop: `1px solid ${isSelected ? '#0079ca' : '#ccd2d8'}`,
                      borderBottom: `1px solid ${isSelected ? '#0079ca' : '#ccd2d8'}`,
                    }}
                  >
                    <div className="bg-white flex items-center justify-center p-[4px] rounded-[100px]">
                      <button
                        onClick={(e) => { e.stopPropagation(); onQuantityChange(ticket.id, -1); }}
                        className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[18px]"
                        style={{ background: qty > 0 ? '#e6f4ff' : '#f2f3f3', color: qty > 0 ? '#0079ca' : '#ccd2d8' }}
                      >−</button>
                      <span className="w-[40px] text-center text-[16px] text-[#031419]" style={{ fontWeight: isSelected ? 600 : 400, lineHeight: '24px' }}>{qty}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onQuantityChange(ticket.id, 1); }}
                        className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[18px]"
                        style={{ background: '#e6f4ff', color: '#0079ca' }}
                      >+</button>
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="absolute w-[16px]" style={{ right: '128px', top: '8px', bottom: '0' }}>
                    <div className="absolute w-px" style={{ left: '7.5px', top: '16px', bottom: '24px', borderLeft: `1px dashed ${isSelected ? '#0079ca' : '#ccd2d8'}` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="bg-white flex items-center justify-between px-[24px] py-[12px] w-full fixed top-0 left-0 right-0 z-50" style={{ borderBottom: '1px solid #f2f3f3' }}>
      <div className="flex items-center gap-[24px]">
        <img src={FEVER_LOGO} alt="Fever" className="h-[32px]" />
        <div className="hidden md:flex items-center gap-[8px] text-[#031419]">
          <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-[16px]">New York</span>
        </div>
        <div className="hidden md:flex items-center gap-[8px] text-[#031419]">
          <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-[16px]">All categories</span>
        </div>
      </div>
      
      <div className="flex-1 max-w-[600px] mx-[24px] hidden lg:flex">
        <div className="flex items-center gap-[8px] bg-white border border-[#ccd2d8] rounded-[32px] px-[16px] py-[12px] w-full">
          <svg className="w-[20px] h-[20px] text-[#536b75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[16px] text-[#536b75]">Search for Candlelight concerts</span>
        </div>
      </div>

      <div className="flex items-center gap-[16px]">
        <div className="w-[42px] h-[42px] rounded-full bg-[#e6f4ff] flex items-center justify-center">
          <svg className="w-[20px] h-[20px] text-[#0079ca]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <div className="relative w-full">
      <div 
        className="w-full h-[300px] md:h-[405px] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${HERO_IMAGE})` }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-[16px] md:p-[32px]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-end gap-[24px]">
          <div className="hidden md:block">
            <img src={HERO_IMAGE} alt="Fabrik" className="w-[375px] h-[375px] object-cover rounded-[4px]" />
          </div>
          <div className="flex-1 flex flex-col gap-[16px]">
            <h1 className="text-[28px] md:text-[28px] font-semibold text-white leading-[40px]">
              Fabrik Template con mesas
            </h1>
            <div className="flex gap-[12px]">
              <button className="bg-white rounded-full p-[8px] shadow-[0px_2px_4px_rgba(0,0,0,0.12)]">
                <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="bg-white rounded-full p-[8px] shadow-[0px_2px_4px_rgba(0,0,0,0.12)]">
                <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentTabs({ activeContentTab, setActiveContentTab }: { activeContentTab: number; setActiveContentTab: (tab: number) => void }) {
  return (
    <div className="flex items-end w-full border-b border-[#ccd2d8]">
      <button 
        onClick={() => setActiveContentTab(0)}
        className={`h-[40px] px-[12px] py-[8px] text-[16px] ${activeContentTab === 0 ? 'text-[#0079ca] border-b-2 border-[#0079ca] font-semibold' : 'text-[#031419]'}`}
      >
        Entrada General
      </button>
      <button 
        onClick={() => setActiveContentTab(1)}
        className={`h-[40px] px-[12px] py-[8px] text-[16px] ${activeContentTab === 1 ? 'text-[#0079ca] border-b-2 border-[#0079ca] font-semibold' : 'text-[#031419]'}`}
      >
        Mesas Main Room
      </button>
      <div className="flex-1" />
    </div>
  );
}

function Description() {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-[#031419] leading-[24px]">
        Vive el evento desde una mesa en la sala principal, con acceso preferente y servicios exclusivos.
      </p>
      <div>
        <p className="text-[16px] text-[#031419] font-semibold leading-[24px]">Qué incluye</p>
        <ul className="list-disc ml-[20px] mt-[8px]">
          <li className="text-[16px] text-[#031419] leading-[24px]">Acceso al evento</li>
          <li className="text-[16px] text-[#031419] leading-[24px]">Mesa reservada en la sala principal</li>
          <li className="text-[16px] text-[#031419] leading-[24px]">Servicio en mesa</li>
          <li className="text-[16px] text-[#031419] leading-[24px]">Posibilidad de salir y volver a entrar durante la sesión</li>
        </ul>
      </div>
    </div>
  );
}

function InteractiveMap({ selectedZone, onZoneSelect }: { selectedZone: string; onZoneSelect: (zoneId: string) => void }) {
  const svgRef = useRef<HTMLObjectElement>(null);
  const [svgDoc, setSvgDoc] = useState<Document | null>(null);
  const selectedRef = useRef(selectedZone);
  const onZoneSelectRef = useRef(onZoneSelect);
  
  // Keep refs in sync
  useEffect(() => {
    selectedRef.current = selectedZone;
  }, [selectedZone]);
  
  useEffect(() => {
    onZoneSelectRef.current = onZoneSelect;
  }, [onZoneSelect]);

  const ORIGINAL_COLORS: Record<string, string> = {
    'DJbooth': '#d49bb9',
    'cristal': '#3099ca',
    'placo_x5F_izq': '#a1cae0',
    'palco_x5F_derecho': '#a1cae0',
    'backstage_x5F_izquierdo': '#dfa12e',
    'backstage_x5F_derecho': '#dfa12e',
    'pista_x5F_izquierda': '#94629a',
    'pista_x5F_derecha': '#94629a',
    'vip': '#ead500',
    'cielo': '#86ae1d',
  };

  const setZoneFill = (doc: Document, svgId: string, color: string) => {
    const element = doc.getElementById(svgId);
    if (!element) return;
    
    const isGroup = element.tagName.toLowerCase() === 'g';
    if (isGroup) {
      element.querySelectorAll('path').forEach(p => p.setAttribute('fill', color));
    } else {
      element.setAttribute('fill', color);
    }
  };

  const resetAllZones = (doc: Document) => {
    Object.keys(SVG_ID_MAP).forEach(svgId => {
      setZoneFill(doc, svgId, ORIGINAL_COLORS[svgId] || '#cccccc');
    });
  };

  const handleSvgLoad = () => {
    const obj = svgRef.current;
    if (!obj || !obj.contentDocument) return;
    
    const doc = obj.contentDocument;
    setSvgDoc(doc);

    // Add click handlers - use ref for current selection
    Object.entries(SVG_ID_MAP).forEach(([svgId, zoneId]) => {
      const el = doc.getElementById(svgId);
      if (el) {
        el.style.cursor = 'pointer';
        el.onclick = () => onZoneSelectRef.current(zoneId);
        el.onmouseenter = () => {
          // Only highlight if not already selected
          if (zoneId !== selectedRef.current) {
            setZoneFill(doc, svgId, '#0079ca');
          }
        };
        el.onmouseleave = () => {
          // Only reset if not the selected zone
          if (zoneId !== selectedRef.current) {
            setZoneFill(doc, svgId, ORIGINAL_COLORS[svgId] || '#cccccc');
          }
        };
      }
    });
  };

  // Update selection highlighting when selection changes
  useEffect(() => {
    if (!svgDoc) return;
    
    // Reset all to original colors
    resetAllZones(svgDoc);
    
    // Highlight only the selected zone
    if (selectedZone) {
      const svgIds = ZONE_TO_SVG_ID[selectedZone] || [];
      svgIds.forEach(svgId => {
        setZoneFill(svgDoc, svgId, '#0079ca');
      });
    }
  }, [selectedZone, svgDoc]);

  return (
    <div className="flex flex-col gap-[12px]">
      <h2 className="text-[20px] text-[#031419] font-semibold leading-[26px]">
        Explora las zonas de reservados
      </h2>
      <p className="text-[16px] text-[#536b75] leading-[24px]">
        Vive el evento desde una mesa en la sala principal, con acceso preferente y servicios exclusivos.
      </p>
      <div className="relative rounded-[8px] overflow-hidden border border-[#e5e5e5]">
        <object
          ref={svgRef}
          type="image/svg+xml"
          data="/fever-fabrik-table/ReservadosMainRoom.svg"
          className="w-full h-auto block"
          onLoad={handleSvgLoad}
          style={{ minHeight: '300px' }}
        >
          Tu navegador no soporta SVG
        </object>
      </div>
    </div>
  );
}

function ZoneSelector({ selectedZone, onZoneSelect }: { selectedZone: string; onZoneSelect: (zoneId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentZone = ZONES.find(z => z.id === selectedZone);

  return (
    <div className="w-full relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[#ccd2d8] rounded-[8px] h-[56px] px-[12px] flex items-center justify-between"
      >
        <div className="flex flex-col items-start">
          <span className="text-[12px] text-[#536b75] font-semibold">Selecciona una zona</span>
          <span className="text-[16px] text-[#031419]">{currentZone?.shortName || 'Seleccionar'}</span>
        </div>
        <svg className={`w-[20px] h-[20px] text-[#536b75] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-[60px] left-0 right-0 bg-white border border-[#ccd2d8] rounded-[8px] shadow-lg z-10 max-h-[300px] overflow-y-auto">
          {ZONES.map(zone => (
            <button
              key={zone.id}
              onClick={() => { onZoneSelect(zone.id); setIsOpen(false); }}
              className={`w-full px-[12px] py-[12px] text-left hover:bg-[#f5f5f5] flex items-center justify-between ${
                selectedZone === zone.id ? 'bg-[#e6f4ff]' : ''
              }`}
            >
              <div className="flex items-center gap-[8px]">
                <div className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: zone.color }} />
                <span className="text-[16px] text-[#031419]">{zone.shortName}</span>
              </div>
              <span className="text-[14px] text-[#536b75]">desde {zone.price}€</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneCard({ selectedZone, onZoneSelect }: { selectedZone: string; onZoneSelect: (zoneId: string) => void }) {
  const zone = ZONES.find(z => z.id === selectedZone);
  if (!zone) return null;

  return (
    <div 
      className="bg-white border border-[#ccd2d8] rounded-[8px] shadow-[0px_2px_4px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row cursor-pointer"
      onClick={() => onZoneSelect(zone.id)}
    >
      <div className="relative w-full md:w-[331px] h-[200px] md:h-[304px]">
        <img src={ZONE_IMAGE} alt={zone.name} className="w-full h-full object-cover" />
        <div 
          className="absolute top-[12px] left-[12px] px-[8px] py-[4px] rounded-[4px] text-white text-[12px] font-semibold"
          style={{ backgroundColor: zone.color }}
        >
          {zone.shortName}
        </div>
      </div>
      <div className="flex-1 p-[16px] md:p-[24px] flex flex-col gap-[16px]">
        <div>
          <h3 className="text-[18px] text-[#031419] font-semibold leading-[24px] uppercase">{zone.shortName}</h3>
          <p className="text-[14px] text-[#031419] font-semibold mt-[4px]">desde {zone.price}€</p>
          <p className="text-[14px] text-[#536b75]">Para {zone.capacity} personas</p>
        </div>
        <p className="text-[14px] text-[#031419] leading-[20px]">{zone.description}</p>
        <div className="flex flex-col gap-[4px]">
          {zone.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-[4px]">
              <div className="w-[15px] h-[15px] flex items-center justify-center flex-shrink-0 mt-[2px]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#22AD5C]" />
              </div>
              <span className="text-[14px] text-[#031419] leading-[20px]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertNotification() {
  return (
    <div className="bg-[#f0ebfd] rounded-[8px] p-[12px] flex items-center gap-[8px] relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#6f41d7]" />
      <svg className="w-[20px] h-[20px] text-[#6f41d7] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      <p className="text-[16px] text-[#6f41d7] leading-[24px]">
        Revisa y confirma tu selección en el selector.
      </p>
    </div>
  );
}

function HelpSection() {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[4px]">
        <svg className="w-[26px] h-[26px] text-[#031419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[20px] text-[#031419] font-semibold">¿Alguna duda?</span>
      </div>
      <p className="text-[16px] text-[#031419]">
        ¿Necesitas ayuda? Ponte en contacto con el Servicio al Cliente a través de <span className="text-[#0079ca] cursor-pointer">este enlace</span>.
      </p>
    </div>
  );
}

function LocationSection() {
  return (
    <div className="flex flex-col md:flex-row gap-[32px]">
      <div className="flex-1 flex flex-col gap-[24px]">
        <div className="flex items-center gap-[4px]">
          <svg className="w-[26px] h-[26px] text-[#031419]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-[20px] text-[#031419] font-semibold">¿Cómo llegar?</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[18px] text-[#031419] font-semibold underline">Fabrik</p>
          <p className="text-[16px] text-[#031419]">
            Avenida de la Industria, 82, Humanes de Madrid, 28970
          </p>
        </div>
      </div>
      <div className="w-full md:w-[352px] h-[198px] rounded-[4px] overflow-hidden">
        <img src={HERO_IMAGE} alt="Location map" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('mesas');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeContentTab, setActiveContentTab] = useState(1);
  const [selectedZone, setSelectedZone] = useState('cielo');
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setQuantities({});
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[id] || 0) + delta);
      if (activeTab === 'mesas') {
        setSelectedZone(id);
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    setActiveTab('mesas');
    setActiveContentTab(1);
    // Auto-set quantity to 1 for selected zone
    setQuantities(prev => ({ ...prev, [zoneId]: Math.max(1, prev[zoneId] || 0) }));
  };

  const scrollToSelector = () => {
    selectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const currentTickets = TICKETS[activeTab];
  const totalPrice = currentTickets.reduce((sum, t) => sum + (quantities[t.id] || 0) * t.price, 0);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      
      <Navbar />
      
      <main className="pt-[62px] pb-[80px] lg:pb-0">
        <HeroSection />
        
        <div className="max-w-[1280px] mx-auto px-[16px] md:px-[32px] py-[32px]">
          <div className="flex flex-col lg:flex-row gap-[32px]">
            {/* Left Column - Content */}
            <div className="flex-1 flex flex-col gap-[32px]">
              <ContentTabs activeContentTab={activeContentTab} setActiveContentTab={setActiveContentTab} />
              <Description />
              <InteractiveMap selectedZone={selectedZone} onZoneSelect={handleZoneSelect} />
              <ZoneSelector selectedZone={selectedZone} onZoneSelect={handleZoneSelect} />
              <ZoneCard selectedZone={selectedZone} onZoneSelect={handleZoneSelect} />
              
              {/* Mobile Ticket Selector - after cards */}
              <div ref={selectorRef} className="lg:hidden">
                <TicketSelector 
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  quantities={quantities}
                  onQuantityChange={handleQuantityChange}
                  selectedZone={selectedZone}
                  onZoneSelect={handleZoneSelect}
                />
              </div>
              
              <AlertNotification />
              <HelpSection />
              <LocationSection />
            </div>
            
            {/* Right Column - Sticky Ticket Selector (Desktop) */}
            <div className="hidden lg:block w-[412px]">
              <div className="sticky top-[80px]">
                <TicketSelector 
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  quantities={quantities}
                  onQuantityChange={handleQuantityChange}
                  selectedZone={selectedZone}
                  onZoneSelect={handleZoneSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA - scrolls to selector */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#ccd2d8] px-[16px] py-[12px] safe-area-pb">
        <button 
          onClick={scrollToSelector}
          className="w-full h-[48px] rounded-[64px] flex items-center justify-center"
          style={{ background: totalQty > 0 ? '#0079ca' : '#0079ca' }}
        >
          <span className="text-white text-[16px] font-semibold">
            {totalQty > 0 ? `${totalPrice.toFixed(2)} € — Comprar ahora` : 'Seleccionar entradas'}
          </span>
        </button>
      </div>
    </div>
  );
}
