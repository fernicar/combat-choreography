# Asset Requirements

This document outlines the visual assets needed for the BRAWLINGDANCE proof-of-concept.

## Technical Specifications
- **Dimensions**: 512x512 pixels
- **Format**: PNG with transparent background
- **Naming Convention**: `{theme}_{character}_{state}.png` (e.g., `dogfight_player_idle.png`)

## General Style Notes
- **Enemy Sprites**: For `idle`, `attack`, and `hit` states, the enemy sprite should be a horizontally-flipped and color-adjusted version of the player's sprite to signify a mirrored opponent. A unique `defeat` sprite is required for the enemy.

---

## 1. Dogfight Theme
- **Style**: Stylized, bold lines, slightly cel-shaded. Dynamic and action-oriented.
- **Color Palette**: Player is primarily blues and silvers. Enemy is reds and dark grays.

### Player Sprites (Sleek Fighter Jet)
- **`dogfight_player_idle.png`**: A sleek fighter jet, side profile, flying level.
- **`dogfight_player_attack.png`**: The fighter jet, angled slightly towards the viewer, firing missiles with visible smoke trails and dynamic motion lines.
- **`dogfight_player_hit.png`**: The fighter jet trailing black smoke, with electrical sparks visible on the fuselage.
- **`dogfight_player_victory.png`**: The fighter jet performing a triumphant barrel roll, leaving colorful celebratory smoke trails.
- **`dogfight_player_defeat.png`**: The fighter jet, broken in half, plummeting downwards in a fiery explosion.

### Enemy Sprites (Mirrored Fighter Jet)
- **`dogfight_enemy_defeat.png`**: The enemy fighter jet exploding in a massive, fiery burst.

---

## 2. Magic Duel Theme
- **Style**: Mystical, with glowing runes and vibrant energy effects. High-fantasy illustration.
- **Color Palette**: Player features cool blues, purples, and silver trim. Enemy features aggressive reds, oranges, and black.

### Player Sprites (Blue Robed Wizard)
- **`magic_player_idle.png`**: A wizard in flowing blue robes holding a glowing staff, standing in a ready stance with mystical energy swirling around their hands.
- **`magic_player_attack.png`**: The wizard thrusting their staff forward, unleashing a crackling bolt of lightning.
- **`magic_player_hit.png`**: The wizard recoiling from an impact as a magical shield shatters in front of them.
- **`magic_player_victory.png`**: The wizard raising their staff to the sky, levitating slightly in a triumphant aura of light.
- **`magic_player_defeat.png`**: The wizard collapsing to their knees, staff dropped, as their magical energy dissipates.

### Enemy Sprites (Red Robed Wizard)
- **`magic_enemy_defeat.png`**: The enemy wizard's flames are extinguished as they are turned to stone and begin to crumble away.

---

## 3. Brawling Match Theme
- **Style**: Gritty, high-contrast silhouettes with dynamic poses. Reminiscent of a comic book ink style.
- **Color Palette**: Player silhouette is a dark, cool gray with electric blue highlights. Enemy silhouette is a deep charcoal with fiery orange highlights.

### Player Sprites (Lean Boxer)
- **`brawling_player_idle.png`**: Silhouette of a lean boxer in a fighting stance with fists raised.
- **`brawling_player_attack.png`**: Silhouette of the boxer mid-punch, with explosive motion lines indicating speed and impact.
- **`brawling_player_hit.png`**: Silhouette of the boxer staggering back from a blow, with a visible impact star effect.
- **`brawling_player_victory.png`**: Silhouette of the boxer with one fist raised in victory.
- **`brawling_player_defeat.png`**: Silhouette of the boxer knocked out on the ground.

### Enemy Sprites (Heavy Brawler)
- **`brawling_enemy_defeat.png`**: Silhouette of a large brawler falling backwards, having been knocked off their feet.
