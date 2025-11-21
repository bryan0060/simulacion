import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Layers, 
  Code, 
  Activity, 
  ArrowRight,
  Zap,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Play,
  Shield,
  RefreshCw,
  FileText,
  ChevronRight,
  Lock
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const stages = [
  {
    id: 1,
    title: "1. Desarrollo Asistido (IDE)",
    icon: <Code size={20} />,
    description: "La IA detecta código ineficiente o inseguro mientras escribes.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500",
    toolName: "VS Code Simulator + Copilot"
  },
  {
    id: 2,
    title: "2. Build & Docker (IA Audit)",
    icon: <Box size={20} />,
    description: "Auditoría de seguridad y optimización de tamaño de imagen.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500",
    toolName: "Docker AI Optimizer"
  },
  {
    id: 3,
    title: "3. K8s & Seguridad",
    icon: <Layers size={20} />,
    description: "Validación de manifiestos y asignación de recursos.",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500",
    toolName: "K8s Dashboard"
  },
  {
    id: 4,
    title: "4. Ops & Auto-Healing",
    icon: <Activity size={20} />,
    description: "Respuesta automática a incidentes en producción.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500",
    toolName: "Grafana Live Monitor"
  }
];

export default function App() {
  const [activeStage, setActiveStage] = useState(0);
  
  // --- ESTADOS INTERNOS ---
  
  // Stage 1: IDE
  const [codeFixed, setCodeFixed] = useState(false);
  
  // Stage 2: Docker Advanced
  const [dockerStep, setDockerStep] = useState('init'); 
  const [buildProgress, setBuildProgress] = useState(0);

  // Stage 3: K8s Dashboard
  const [k8sResources, setK8sResources] = useState({ cpu: 'Unset', memory: 'Unset', status: 'Warning' });

  // Stage 4: Monitor
  const [traffic, setTraffic] = useState(20);
  const [pods, setPods] = useState(2);
  const [alertActive, setAlertActive] = useState(false);

  const changeStage = (index) => {
    setActiveStage(index);
    setCodeFixed(false);
    setDockerStep('init');
    setBuildProgress(0);
    setK8sResources({ cpu: 'Unset', memory: 'Unset', status: 'Warning' });
    setTraffic(20);
    setPods(2);
    setAlertActive(false);
  };

  // --- LOGICA DE TEXTOS DOCKER ---
  const badDockerfile = `FROM node:latest
WORKDIR /app
COPY . .
# ❌ Instala todo, incluyendo devDependencies
RUN npm install 
# ❌ Ejecuta como root (inseguro)
CMD ["npm", "start"]`;

  const goodDockerfile = `# ✅ Stage 1: Builder (Cache eficiente)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ✅ Stage 2: Runner (Imagen mínima)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
# ✅ Usuario no-root por seguridad
USER node
CMD ["node", "dist/index.js"]`;

  // RENDERIZADO
  const renderIDE = () => (
    <div className="flex flex-col h-full font-mono text-sm">
      <div className="bg-slate-800 p-2 flex items-center gap-2 text-xs text-slate-400 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500"/>
        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
        <div className="w-3 h-3 rounded-full bg-green-500"/>
        <span className="ml-2">user_service.js</span>
      </div>
      <div className="p-4 flex-1 overflow-auto relative bg-slate-900 text-slate-300">
        <div className="opacity-50">1  function login(user, pass) {'{'}</div>
        <div className="opacity-50">2    // TODO: Connect DB</div>
        <div className={codeFixed ? "text-green-400 transition-colors duration-500" : "text-red-400"}>
          3    {codeFixed ? "const query = 'SELECT * FROM users WHERE id=?';" : "const query = 'SELECT * FROM users WHERE id=' + user;"}
        </div>
        <div className="opacity-50">4    db.execute(query);</div>
        <div className="opacity-50">5  {'}'}</div>

        {!codeFixed && (
          <div className="absolute bottom-4 right-4 bg-slate-800 border border-blue-500 p-3 rounded shadow-xl z-10 animate-bounce-subtle w-64">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
              <Zap size={12} /> COPILOT ALERT
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Detectada vulnerabilidad de inyección SQL.
            </p>
            <button 
              onClick={() => setCodeFixed(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded w-full transition-colors"
            >
              Corregir con IA
            </button>
          </div>
        )}
        {codeFixed && (
          <div className="mt-4 text-green-500 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle size={14} /> Vulnerabilidad corregida.
          </div>
        )}
      </div>
    </div>
  );

  const startDockerBuild = () => {
    setDockerStep('building');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setBuildProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setDockerStep('done');
      }
    }, 100);
  };

  const renderDockerOptimizer = () => (
    <div className="flex flex-col h-full bg-slate-900 font-mono text-xs md:text-sm">
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-400">
          <FileText size={16} />
          <span>Dockerfile</span>
          <span className={`text-xs px-2 py-0.5 rounded ${dockerStep === 'init' || dockerStep === 'analyzing' ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'}`}>
             {dockerStep === 'init' || dockerStep === 'analyzing' ? 'DRAFT' : 'OPTIMIZED'}
          </span>
        </div>
        <div className="flex gap-2">
           {dockerStep === 'init' && (
             <button 
               onClick={() => setDockerStep('analyzing')}
               className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
             >
               <Zap size={14} /> Auditar con IA
             </button>
           )}
           {dockerStep === 'analyzing' && (
             <button 
               onClick={() => setDockerStep('fixed')}
               className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded flex items-center gap-2 animate-pulse"
             >
               <Shield size={14} /> Aplicar Cambios
             </button>
           )}
           {dockerStep === 'fixed' && (
             <button 
               onClick={startDockerBuild}
               className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded flex items-center gap-2"
             >
               <Play size={14} /> Construir Imagen
             </button>
           )}
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-auto relative bg-slate-900 border-r border-slate-800 transition-all">
          <pre className={`${dockerStep === 'fixed' || dockerStep === 'building' || dockerStep === 'done' ? 'text-green-300' : 'text-red-300'} transition-all duration-500`}>
            {dockerStep === 'init' || dockerStep === 'analyzing' ? badDockerfile : goodDockerfile}
          </pre>
          {dockerStep === 'analyzing' && (
            <div className="mt-6 space-y-2 animate-fade-in-up">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Hallazgos de IA:</div>
              <div className="bg-red-500/10 border border-red-500/30 p-2 rounded flex items-start gap-2 text-red-300">
                 <AlertTriangle size={14} className="mt-0.5 shrink-0"/>
                 <div>
                   <span className="font-bold">Imagen Base Pesada:</span> "node:latest" pesa ~1GB. Se sugiere "alpine".
                 </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded flex items-start gap-2 text-yellow-300">
                 <Lock size={14} className="mt-0.5 shrink-0"/>
                 <div>
                   <span className="font-bold">Riesgo Seguridad:</span> El contenedor corre como Root.
                 </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 p-2 rounded flex items-start gap-2 text-blue-300">
                 <Layers size={14} className="mt-0.5 shrink-0"/>
                 <div>
                   <span className="font-bold">Ineficiencia:</span> Código fuente incluido en producción. Usar Multi-stage build.
                 </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-1/3 bg-black p-4 flex flex-col border-l border-slate-800">
          <div className="text-slate-500 text-xs font-bold mb-2 flex items-center gap-2">
            <Terminal size={14} /> SALIDA DEL SISTEMA
          </div>
          <div className="flex-1 overflow-auto font-mono text-xs space-y-1 text-slate-300">
            {dockerStep === 'building' || dockerStep === 'done' ? (
              <>
                 <div><span className="text-purple-400">$</span> docker build .</div>
                 <div className="text-slate-500">Sending build context to Docker daemon...</div>
                 {buildProgress > 10 && <div>Step 1/8 : FROM node:18-alpine AS builder</div>}
                 {buildProgress > 30 && <div className="text-green-400"> {'--->'} Using cache</div>}
                 {buildProgress > 50 && <div>Step 5/8 : COPY --from=builder</div>}
                 {buildProgress > 70 && <div>Step 7/8 : USER node</div>}
                 {buildProgress > 90 && <div className="text-blue-400">Successfully built image</div>}
                 {dockerStep === 'done' && (
                   <div className="mt-6 bg-slate-900 border border-green-500 p-3 rounded text-center animate-bounce-subtle">
                     <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Tamaño Final</div>
                     <div className="text-2xl text-white font-bold">85 MB</div>
                     <div className="text-xs text-green-400 mt-1">⬇ 92% Reducción (vs 1.1GB)</div>
                   </div>
                 )}
              </>
            ) : (
               <div className="text-slate-600 italic mt-10 text-center">
                 Esperando optimización del Dockerfile...
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderK8s = () => (
    <div className="h-full flex flex-col bg-slate-900 p-4">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
        <div className="text-sm font-bold text-slate-300">Deployment: payment-service</div>
        <div className={`text-xs px-2 py-1 rounded ${k8sResources.status === 'OK' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
          Status: {k8sResources.status}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 p-3 rounded border border-slate-700">
          <div className="text-xs text-slate-500 mb-1">CPU Request</div>
          <div className="font-mono text-lg text-white">{k8sResources.cpu}</div>
        </div>
        <div className="bg-slate-800 p-3 rounded border border-slate-700">
          <div className="text-xs text-slate-500 mb-1">Memory Limit</div>
          <div className="font-mono text-lg text-white">{k8sResources.memory}</div>
        </div>
      </div>
      {k8sResources.status === 'Warning' ? (
        <div className="bg-slate-800/50 border border-green-500/30 p-4 rounded relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"/>
          <h4 className="text-green-400 text-sm font-bold mb-2 flex items-center gap-2">
            <Zap size={16}/> Sugerencia de IA
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Basado en el historial de tráfico, este servicio requiere límites específicos para evitar OOMKilled.
          </p>
          <button 
            onClick={() => setK8sResources({ cpu: '250m', memory: '512Mi', status: 'OK' })}
            className="w-full bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded font-bold transition-colors"
          >
            Aplicar Configuración Recomendada
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-green-500 animate-fade-in">
          <Shield size={48} className="mb-2 opacity-50" />
          <span className="text-sm font-bold">Configuración Validada</span>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (activeStage !== 3) return;
    const interval = setInterval(() => {
      setTraffic(prev => {
        if (alertActive) return Math.min(prev + 15, 100); 
        return Math.max(prev + (Math.random() * 10 - 5), 10);
      });
      if (alertActive && traffic > 80 && pods < 8) setPods(prev => prev + 1);
      if (!alertActive && pods > 2) setPods(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeStage, alertActive, traffic, pods]);

  const renderMonitor = () => (
    <div className="h-full flex flex-col bg-slate-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-end opacity-20 pointer-events-none">
         {Array.from({ length: 20 }).map((_, i) => (
           <div 
             key={i} 
             className="flex-1 bg-blue-500 mx-0.5 transition-all duration-300"
             style={{ height: `${Math.random() * traffic}%` }}
           />
         ))}
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h3 className="text-sm font-bold text-slate-300">Tráfico en tiempo real</h3>
             <div className="text-3xl font-mono text-white">{Math.round(traffic)} <span className="text-xs text-slate-500">req/s</span></div>
          </div>
          <div className="text-right">
             <h3 className="text-sm font-bold text-slate-300">Réplicas (Pods)</h3>
             <div className={`text-3xl font-mono transition-colors ${pods > 2 ? 'text-orange-400' : 'text-blue-400'}`}>
               {pods}
             </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded p-4 border border-slate-700">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold text-slate-400">CONTROLES DE SIMULACIÓN</span>
             {alertActive && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">CRITICAL LOAD</span>}
           </div>
           <button
             onClick={() => setAlertActive(!alertActive)}
             className={`w-full py-2 rounded text-xs font-bold transition-all ${alertActive ? 'bg-slate-700 text-slate-300' : 'bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50'}`}
           >
             {alertActive ? "Detener Pico de Tráfico" : "🔥 Simular Ataque DDoS / Pico"}
           </button>
           {alertActive && (
             <div className="mt-3 text-xs text-orange-300 flex items-center gap-2 animate-fade-in">
               <RefreshCw size={12} className="animate-spin"/>
               AI Scaling: Provisionando nuevos nodos...
             </div>
           )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 text-center max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Laboratorio Interactivo: IA + Kubernetes
        </h1>
        <p className="text-slate-400 text-sm">
          Haz clic en las etapas de la izquierda para operar las herramientas simuladas.
        </p>
      </header>
      <div className="w-full max-w-6xl grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              onClick={() => changeStage(index)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group
                ${activeStage === index 
                  ? `${stage.borderColor} ${stage.bgColor}` 
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}
              `}
            >
              {activeStage === index && (
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${stage.color.split('-')[1]}-500 to-transparent w-full animate-shimmer`}/>
              )}
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-lg ${activeStage === index ? 'bg-slate-950 shadow-lg' : 'bg-slate-800'} ${stage.color}`}>
                  {stage.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${activeStage === index ? 'text-white' : 'text-slate-400'}`}>
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-tight">
                    {stage.description}
                  </p>
                </div>
                {activeStage === index && (
                  <ChevronRight className={`ml-auto ${stage.color}`} size={18} />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 flex flex-col h-[500px] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              {stages[activeStage].icon}
              <span>Herramienta: {stages[activeStage].toolName}</span>
            </div>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            {activeStage === 0 && renderIDE()}
            {activeStage === 1 && renderDockerOptimizer()}
            {activeStage === 2 && renderK8s()}
            {activeStage === 3 && renderMonitor()}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
