import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BottomNav, type Screen } from './components/BottomNav';
import { Header } from './components/Header';
import { HistoricoScreen } from './screens/HistoricoScreen';
import { MetricasScreen } from './screens/MetricasScreen';
import { PreencherScreen } from './screens/PreencherScreen';
import { todayISO } from './lib/date';

export default function App() {
  const [screen, setScreen] = useState<Screen>('preencher');
  const [preencherDate, setPreencherDate] = useState(todayISO());

  return (
    <div className="min-h-dvh pb-[calc(var(--safe-bottom)+64px)]">
      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          key={screen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {screen === 'preencher' && (
            <PreencherScreen date={preencherDate} onDateChange={setPreencherDate} />
          )}
          {screen === 'metricas' && <MetricasScreen />}
          {screen === 'historico' && (
            <HistoricoScreen
              onEditDate={(date) => {
                setPreencherDate(date);
                setScreen('preencher');
              }}
            />
          )}
        </motion.main>
      </AnimatePresence>

      <BottomNav screen={screen} onChange={setScreen} />
    </div>
  );
}
