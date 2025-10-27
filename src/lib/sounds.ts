// Web Audio API-based sound generation for game actions
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.2) {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    noise.buffer = buffer;
    noise.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.start(ctx.currentTime);
  }

  // Dogfight sounds
  dogfightClaimTo() {
    // Ascending engine sound
    this.playTone(200, 0.3, 'sawtooth', 0.25);
    setTimeout(() => this.playTone(300, 0.2, 'sawtooth', 0.2), 100);
  }

  dogfightDiveSix() {
    // Descending dive sound
    this.playTone(400, 0.15, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(250, 0.15, 'sawtooth', 0.25), 80);
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.2), 160);
  }

  dogfightScissors() {
    // Quick alternating tones
    this.playTone(350, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(300, 0.1, 'square', 0.2), 100);
    setTimeout(() => this.playTone(350, 0.1, 'square', 0.2), 200);
  }

  dogfightSplitS() {
    // Sharp turn sound
    this.playTone(500, 0.08, 'sawtooth', 0.25);
    setTimeout(() => this.playTone(200, 0.2, 'sawtooth', 0.2), 80);
  }

  dogfightTightTurn() {
    // Curved sound
    this.playTone(300, 0.25, 'triangle', 0.25);
  }

  // Magic sounds
  magicCharge() {
    // Building energy sound
    this.playTone(150, 0.3, 'sine', 0.2);
    setTimeout(() => this.playTone(200, 0.3, 'sine', 0.25), 100);
    setTimeout(() => this.playTone(250, 0.3, 'sine', 0.3), 200);
  }

  magicCounter() {
    // Shield/deflect sound
    this.playTone(600, 0.15, 'triangle', 0.25);
    setTimeout(() => this.playTone(400, 0.15, 'triangle', 0.2), 80);
  }

  magicFry() {
    // Fire spell
    this.playNoise(0.2, 0.15);
    this.playTone(800, 0.2, 'sawtooth', 0.2);
  }

  magicDry() {
    // Ice/drain spell
    this.playTone(1200, 0.25, 'sine', 0.2);
    setTimeout(() => this.playTone(800, 0.2, 'sine', 0.15), 100);
  }

  magicWet() {
    // Water spell
    this.playNoise(0.15, 0.1);
    this.playTone(400, 0.2, 'sine', 0.2);
  }

  // Brawling sounds
  brawlingRest() {
    // Breath/recover sound
    this.playTone(150, 0.4, 'sine', 0.15);
  }

  brawlingFend() {
    // Block sound
    this.playTone(200, 0.1, 'square', 0.25);
    setTimeout(() => this.playNoise(0.05, 0.1), 50);
  }

  brawlingPunch() {
    // Impact sound
    this.playNoise(0.08, 0.25);
    this.playTone(100, 0.1, 'square', 0.2);
  }

  brawlingGrab() {
    // Grapple sound
    this.playTone(150, 0.15, 'sawtooth', 0.2);
    setTimeout(() => this.playNoise(0.1, 0.15), 80);
  }

  brawlingKick() {
    // Whoosh + impact
    this.playNoise(0.12, 0.2);
    setTimeout(() => this.playTone(120, 0.12, 'square', 0.25), 60);
  }

  // Impact sounds
  hitImpact(damage: number) {
    // Louder for bigger damage
    const volume = Math.min(0.4, 0.15 + (Math.abs(damage) * 0.05));
    this.playNoise(0.1, volume);
    this.playTone(150, 0.15, 'square', volume * 0.8);
  }

  // UI sounds
  buttonClick() {
    this.playTone(600, 0.05, 'sine', 0.15);
  }

  buttonHover() {
    this.playTone(800, 0.03, 'sine', 0.08);
  }

  victory() {
    this.playTone(523, 0.2, 'sine', 0.25); // C
    setTimeout(() => this.playTone(659, 0.2, 'sine', 0.25), 150); // E
    setTimeout(() => this.playTone(784, 0.4, 'sine', 0.3), 300); // G
  }

  defeat() {
    this.playTone(400, 0.2, 'sine', 0.25);
    setTimeout(() => this.playTone(300, 0.2, 'sine', 0.25), 150);
    setTimeout(() => this.playTone(200, 0.4, 'sine', 0.3), 300);
  }

  enemyDefeated() {
    this.playTone(800, 0.15, 'square', 0.2);
    setTimeout(() => this.playNoise(0.2, 0.15), 100);
  }
}

export const soundPlayer = new SoundGenerator();

// Map action names to sound methods
export function playActionSound(action: string, themeKey: string) {
  if (!action) return; // Guard against undefined actions
  
  const actionLower = action.toLowerCase().replace(/[\s-]/g, '');
  const themePrefix = themeKey === 'dogflight' ? 'dogflight' : themeKey;
  const methodName = `${themePrefix}${action.replace(/[\s-]/g, '')}`;
  
  // Try exact match first
  if (methodName in soundPlayer && typeof (soundPlayer as any)[methodName] === 'function') {
    (soundPlayer as any)[methodName]();
    return;
  }

  // Fallback mappings
  const soundMap: Record<string, () => void> = {
    'dogflightclaimto': () => soundPlayer.dogfightClaimTo(),
    'dogflightdivesix': () => soundPlayer.dogfightDiveSix(),
    'dogflightscissors': () => soundPlayer.dogfightScissors(),
    'dogflightsplits': () => soundPlayer.dogfightSplitS(),
    'dogflighttightturn': () => soundPlayer.dogfightTightTurn(),
    'magiccharge': () => soundPlayer.magicCharge(),
    'magiccounter': () => soundPlayer.magicCounter(),
    'magicfry': () => soundPlayer.magicFry(),
    'magicdry': () => soundPlayer.magicDry(),
    'magicwet': () => soundPlayer.magicWet(),
    'brawlingrest': () => soundPlayer.brawlingRest(),
    'brawlingfend': () => soundPlayer.brawlingFend(),
    'brawlingpunch': () => soundPlayer.brawlingPunch(),
    'brawlinggrab': () => soundPlayer.brawlingGrab(),
    'brawlingkick': () => soundPlayer.brawlingKick(),
  };

  const key = actionLower;
  if (soundMap[key]) {
    soundMap[key]();
  } else {
    // Generic fallback
    soundPlayer.buttonClick();
  }
}
