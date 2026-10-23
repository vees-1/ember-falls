# Emberfall audio direction

## The Ashen Crown

An original medieval strategy battle theme composed and synthesized for Emberfall.

| Property | Value |
| --- | --- |
| Duration | 48 seconds; looping |
| Form | 16 bars, 4/4 |
| Tempo | 80 BPM |
| Tonal center | D minor, with a dominant cadence |
| Arrangement | Plucked ostinato, sustained string-like harmony, horn-like melody, low drums, and soft percussive accents |
| Runtime asset | `dist/assets/ashen-crown.wav` |
| Score and instruments | `scripts/music-score.cjs` |
| Rebuild command | `node scripts/render-music.cjs` |

The composition uses an original melody and arrangement. All sound is generated from oscillator, envelope, and noise models; no soundtrack recordings or third-party samples are included. Instrument names describe their synthesized character, rather than sampled acoustic performances.

The first eight bars establish the theme; the second eight lift the melody before returning to the opening tonal center. Short rests and restrained orchestration leave room for combat cues. The rendered file is mono PCM at 22,050 Hz, 16-bit, and is served as a local static asset.

## Playback and mixing

Battle music, environmental ambience, and effects have separate gain controls beneath the master volume. The browser audio context starts from a player gesture. The theme loads once, loops through a dedicated music bus, and fades when combat pauses. The audio dialog offers a twelve-second music preview.

The separate 32-second ambience adds wind, a low drone, and distant drums. The 23-cue effects library covers creature deployment, melee clashes, ranged attacks, heavy impacts, spellcasting, healing, and battle outcomes. Dynamic compression, bounded source peaks, short envelopes, and per-cue rate limiting keep busy scenes controlled.

Muted or background tabs do not output the mix. Player settings are retained locally without an account or server-side preference store.

## Verification

`node scripts/music-test.cjs` checks finite samples, usable headroom, non-silent bars, development across the arrangement, smooth loop endpoints, valid WAV metadata, and an exact match between the source renderer and committed audio asset.

`node scripts/audio-test.cjs` validates the effect cues and environmental loop. These checks establish signal and file integrity; speaker and headphone listening remains a separate quality review.
