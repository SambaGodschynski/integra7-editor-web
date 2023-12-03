//
//  snd_inst.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
// 

globals.parameter.sndInstPreset = [
	{ bank: 'INT', num: 0, desc: 'OFF' },
	{ bank: 'INT', num: 1, desc: 'Studio Kick', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 2, desc: 'Pop Kick', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 3, desc: 'Jazz Kick', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 4, desc: 'Rock Kick', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 5, desc: 'Studio Kick 2', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 6, desc: 'Rock Kick 2', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 7, desc: 'Orch Bass Drum', type: 'Kick', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 8, desc: 'Studio Sn', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 9, desc: 'Studio Sn Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 10, desc: 'Studio Sn XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 11, desc: 'Pop Sn', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 12, desc: 'Pop Sn Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 13, desc: 'Pop Sn XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 14, desc: 'Jazz Sn', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 15, desc: 'Jazz Sn Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 16, desc: 'Jazz Sn XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 17, desc: 'Rock Sn', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 18, desc: 'Rock Sn Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 19, desc: 'Rock Sn XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 20, desc: 'Tight Sn', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 21, desc: 'Tight Sn Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 22, desc: 'Tight Sn XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 23, desc: 'Studio Sn 2', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 24, desc: 'Studio Sn 2 Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 25, desc: 'Studio Sn 2 XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 26, desc: 'Rock Sn 2', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 27, desc: 'Rock Sn 2 Rim', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 28, desc: 'Rock Sn 2 XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 29, desc: 'Brush Sn Slap', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 30, desc: 'Brush Sn Tap', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 31, desc: 'Brush Sn Slide', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 32, desc: 'Brush Sn Swirl 1', type: 'Snare', width: true, amb: true },
	{ bank: 'INT', num: 33, desc: 'Brush Sn Swirl 2', type: 'Snare', width: true, amb: true },
	{ bank: 'INT', num: 34, desc: 'Snare CrossStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 35, desc: 'Orch Snare', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 36, desc: 'Orch Snare XStk', type: 'Snare', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 37, desc: 'Pop Tom Hi', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 38, desc: 'Pop Tom Mid', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 39, desc: 'Pop Tom Flr', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 40, desc: 'Rock Tom Hi', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 41, desc: 'Rock Tom Mid', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 42, desc: 'Rock Tom Floor', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 43, desc: 'Jazz Tom Hi', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 44, desc: 'Jazz Tom Mid', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 45, desc: 'Jazz Tom Floor', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 46, desc: 'Brush Tom Hi', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 47, desc: 'Brush Tom Mid', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 48, desc: 'Brush Tom Floor', type: 'Tom', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 49, desc: 'Med HH Close', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 50, desc: 'Med HH Open', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 51, desc: 'Med HH Pedal', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 52, desc: 'Standard HH Cl', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 53, desc: 'Standard HH Op', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 54, desc: 'Standard HH Pdl', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 55, desc: 'Jazz HH Close', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 56, desc: 'Jazz HH Open', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 57, desc: 'Jazz HH Pedal', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 58, desc: 'Brush HH Close', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 59, desc: 'Brush HH Open', type: 'Hi-Hat', width: true, amb: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 60, desc: 'Standard Rd Edge', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 61, desc: 'Standard Rd Bell', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 62, desc: 'Std Rd Edge/Bell', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 63, desc: 'Medium Ride Edge', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 64, desc: 'Medium Ride Bell', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 65, desc: 'Med Rd Edge/Bell', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 66, desc: 'Flat 18"Ride', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 67, desc: 'Brush 18"Ride', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 68, desc: 'Brush 20"Ride', type: 'Ride', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 69, desc: 'Standard 16"Cr R', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 70, desc: 'Standard 16"Cr L', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 71, desc: 'Standard 18"Cr R', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 72, desc: 'Standard 18"Cr L', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 73, desc: 'Jazz 16"Cr R', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 74, desc: 'Jazz 16"Cr L', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 75, desc: 'Heavy 18"Cr R', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 76, desc: 'Heavy 18"Cr L', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 77, desc: 'Brush 16"Cr R', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 78, desc: 'Brush 16"Cr L', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 79, desc: 'Brush 18"Cr R', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 80, desc: 'Brush 18"Cr L', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 81, desc: 'Splash Cymbal 1', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 82, desc: 'Splash Cymbal 2', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 83, desc: 'Brush Splash Cym', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 84, desc: 'China Cymbal', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 85, desc: 'Orch Cymbal', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 86, desc: 'Orch Mallet Cym', type: 'Crash', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 87, desc: 'Gong', type: 'Crash', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 88, desc: 'Timpani F2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 89, desc: 'Timpani F#2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 90, desc: 'Timpani G2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 91, desc: 'Timpani G#2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 92, desc: 'Timpani A2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 93, desc: 'Timpani A#2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 94, desc: 'Timpani B2', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 95, desc: 'Timpani C3', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 96, desc: 'Timpani C#3', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 97, desc: 'Timpani D3', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 98, desc: 'Timpani D#3', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 99, desc: 'Timpani E3', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 100, desc: 'Timpani F3', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 101, desc: 'Tambourine 1', type: 'Percussion', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 102, desc: 'Tambourine 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 103, desc: 'Cowbell 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 104, desc: 'Cowbell 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 105, desc: 'Vibra-slap', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 106, desc: 'High Bongo 1', type: 'Percussion', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 107, desc: 'Low Bongo 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 108, desc: 'High Bongo 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 109, desc: 'Low Bongo 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 110, desc: 'MuteHi Conga 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 111, desc: 'OpenHi Conga 1', type: 'Percussion', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 112, desc: 'Low Conga 1', type: 'Percussion', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 113, desc: 'MuteHi Conga 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 114, desc: 'OpenHi Conga 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 115, desc: 'Low Conga 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 116, desc: 'High Timbale', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 117, desc: 'Low Timbale', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 118, desc: 'High Agogo 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 119, desc: 'Low Agogo 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 120, desc: 'High Agogo 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 121, desc: 'Low Agogo 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 122, desc: 'Cabasa 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 123, desc: 'Cabasa 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 124, desc: 'Maracas 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 125, desc: 'Maracas 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 126, desc: 'Short Whistle', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 127, desc: 'Long Whistle', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 128, desc: 'Short Guiro', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 129, desc: 'Long Guiro', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 130, desc: 'Claves 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 131, desc: 'Claves 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 132, desc: 'Hi WoodBlock 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 133, desc: 'Low WoodBlock 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 134, desc: 'Hi WoodBlock 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 135, desc: 'Low WoodBlock 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 136, desc: 'Mute Cuica 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 137, desc: 'Open Cuica 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 138, desc: 'Mute Cuica 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 139, desc: 'Open Cuica 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 140, desc: 'Mute Triangle 1', type: 'Percussion', vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 141, desc: 'Open Triangle 1', type: 'Percussion', vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 142, desc: 'Mute Triangle 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 143, desc: 'Open Triangle 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 144, desc: 'Shaker', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 145, desc: 'Sleigh Bell 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 146, desc: 'Sleigh Bell 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 147, desc: 'Wind Chimes', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 148, desc: 'Castanets 1', type: 'Percussion', width: true, vari: 'Flam/Buzz/Roll' },
	{ bank: 'INT', num: 149, desc: 'Castanets 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 150, desc: 'Mute Surdo 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 151, desc: 'Open Surdo 1', type: 'Percussion', width: true, vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 152, desc: 'Mute Surdo 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 153, desc: 'Open Surdo 2', type: 'Percussion', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 154, desc: 'Sticks', type: 'Other', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 155, desc: 'Square Click', type: 'Other', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 156, desc: 'Metro Click', type: 'Other', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 157, desc: 'Metro Bell', type: 'Other', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 158, desc: 'Hand Clap', type: 'Other', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 159, desc: 'High Q', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 160, desc: 'Slap', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 161, desc: 'Scratch Push', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 162, desc: 'Scratch Pull', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 163, desc: 'Gt Fret Noise', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 164, desc: 'Gt Cutting Up Nz', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 165, desc: 'Gt Cutting Dw Nz', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 166, desc: 'AcBass Noise', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 167, desc: 'Flute Key Click', type: 'SFX', vari: 'Flam/Buzz' },
	{ bank: 'INT', num: 168, desc: 'Applause', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 169, desc: 'Laughing 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 170, desc: 'Laughing 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 171, desc: 'Laughing 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 172, desc: 'Scream 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 173, desc: 'Scream 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 174, desc: 'Scream 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 175, desc: 'Punch 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 176, desc: 'Punch 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 177, desc: 'Punch 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 178, desc: 'Heart Beat 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 179, desc: 'Heart Beat 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 180, desc: 'Heart Beat 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 181, desc: 'Foot Steps 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 182, desc: 'Foot Steps 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 183, desc: 'Foot Steps 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 184, desc: 'Foot Step 1 A', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 185, desc: 'Foot Step 1 B', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 186, desc: 'Foot Step 2 A', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 187, desc: 'Foot Step 2 B', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 188, desc: 'Foot Step 3 A', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 189, desc: 'Foot Step 3 B', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 190, desc: 'Door Creaking 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 191, desc: 'Door Creaking 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 192, desc: 'Door Creaking 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 193, desc: 'Door Slam 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 194, desc: 'Door Slam 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 195, desc: 'Door Slam 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 196, desc: 'Scratch', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 197, desc: 'MetalScratch', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 198, desc: 'Matches', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 199, desc: 'Car Engine 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 200, desc: 'Car Engine 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 201, desc: 'Car Engine 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 202, desc: 'Car Stop 1 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 203, desc: 'Car Stop 1 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 204, desc: 'Car Stop 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 205, desc: 'Car Stop 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 206, desc: 'Car Stop 3 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 207, desc: 'Car Stop 3 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 208, desc: 'CarPassing 1 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 209, desc: 'CarPassing 1 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 210, desc: 'CarPassing 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 211, desc: 'CarPassing 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 212, desc: 'CarPassing 3 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 213, desc: 'CarPassing 3 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 214, desc: 'CarPassing 4', type: 'SFX' },
	{ bank: 'ExSN6', num: 215, desc: 'CarPassing 5', type: 'SFX' },
	{ bank: 'ExSN6', num: 216, desc: 'CarPassing 6', type: 'SFX' },
	{ bank: 'ExSN6', num: 217, desc: 'Car Crash 1 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 218, desc: 'Car Crash 1 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 219, desc: 'Car Crash 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 220, desc: 'Car Crash 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 221, desc: 'Car Crash 3 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 222, desc: 'Car Crash 3 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 223, desc: 'Crash 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 224, desc: 'Crash 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 225, desc: 'Crash 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 226, desc: 'Siren 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 227, desc: 'Siren 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 228, desc: 'Siren 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 229, desc: 'Siren 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 230, desc: 'Train 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 231, desc: 'Train 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 232, desc: 'Jetplane 1 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 233, desc: 'Jetplane 1 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 234, desc: 'Jetplane 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 235, desc: 'Jetplane 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 236, desc: 'Jetplane 3 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 237, desc: 'Jetplane 3 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 238, desc: 'Helicopter 1 L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 239, desc: 'Helicopter 1 R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 240, desc: 'Helicopter 2 L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 241, desc: 'Helicopter 2 R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 242, desc: 'Helicopter 3 L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 243, desc: 'Helicopter 3 R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 244, desc: 'Starship 1 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 245, desc: 'Starship 1 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 246, desc: 'Starship 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 247, desc: 'Starship 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 248, desc: 'Starship 3 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 249, desc: 'Starship 3 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 250, desc: 'Gun Shot 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 251, desc: 'Gun Shot 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 252, desc: 'Gun Shot 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 253, desc: 'Machine Gun 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 254, desc: 'Machine Gun 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 255, desc: 'Machine Gun 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 256, desc: 'Laser Gun 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 257, desc: 'Laser Gun 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 258, desc: 'Laser Gun 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 259, desc: 'Explosion 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 260, desc: 'Explosion 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 261, desc: 'Explosion 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 262, desc: 'Dog 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 263, desc: 'Dog 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 264, desc: 'Dog 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 265, desc: 'Dog 4', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 266, desc: 'Horse 1 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 267, desc: 'Horse 1 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 268, desc: 'Horse 2 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 269, desc: 'Horse 2 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 270, desc: 'Horse 3 L>R', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 271, desc: 'Horse 3 R>L', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 272, desc: 'Birds 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 273, desc: 'Birds 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 274, desc: 'Rain 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 275, desc: 'Rain 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 276, desc: 'Thunder 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 277, desc: 'Thunder 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 278, desc: 'Thunder 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 279, desc: 'Wind', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 280, desc: 'Seashore', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 281, desc: 'Stream 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 282, desc: 'Stream 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 283, desc: 'Bubbles 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 284, desc: 'Bubbles 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 285, desc: 'Burst 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 286, desc: 'Burst 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 287, desc: 'Burst 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 288, desc: 'Burst 4', type: 'SFX' },
	{ bank: 'ExSN6', num: 289, desc: 'Glass Burst 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 290, desc: 'Glass Burst 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 291, desc: 'Glass Burst 3', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 292, desc: 'Telephone 1', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 293, desc: 'Telephone 2', type: 'SFX', width: true },
	{ bank: 'ExSN6', num: 294, desc: 'Telephone 3', type: 'SFX', width: true }
];