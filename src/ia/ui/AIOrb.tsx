// Orbe IA animado (copiloto adaptativo). Puro CSS, ligero.
export function AIOrb({ size = 120, thinking = false, className = '' }: { size?: number; thinking?: boolean; className?: string }) {
  return (
    <div className={`ai-orb ${thinking ? 'ai-orb--thinking' : ''} ${className}`} style={{ width: size, height: size }} aria-hidden>
      <div className="ai-orb__glow" />
      <div className="ai-orb__ring" />
      <div className="ai-orb__ring2" />
      <div className="ai-orb__core" />
      <div className="ai-orb__shine" />
    </div>
  );
}
