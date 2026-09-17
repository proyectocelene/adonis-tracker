// MOTOR DE MATCHING INTELIGENTE Y CÓDIGO UNIFICADO DE 3 SEGMENTOS
// Arquitectura clínica: [GRUPO-MÁQUINA-ESPEC_UBIC]
// Garantiza aislamiento total entre estaciones e historial sin contaminación cruzada.

import { LOAD_FAMILIES, scientificProtocol } from '../data/scientificProtocol.js';
import { UNIFIED_EXERCISE_LIBRARY } from '../data/unifiedExerciseLibrary.js';
import { isExerciseUnilateral } from '../hooks/useWorkoutCalculations.js';

// Cache maestro de alias para resolución instantánea de variantes de nombres históricos
export const CANONICAL_ALIAS_MAP = new Map();

// DICCIONARIO MAESTRO DE RETROCOMPATIBILIDAD
// Mapea todos los códigos legados de versiones anteriores a sus códigos canónicos definitivos de 3 segmentos
export const LEGACY_CODE_TO_CANONICAL_MAP = {
  // Pecho
  '[PECH-MAQ-01]': '[PECH-CHEST_PRESS-CONV_01]',
  '[PECH-CHEST_PRESS-CONV_01]': '[PECH-CHEST_PRESS-CONV_01]',
  '[PECH-FLY-02]': '[PECH-PEC_DECK-STACK_01]',
  '[PECH-PEC_DECK-STACK_01]': '[PECH-PEC_DECK-STACK_01]',
  '[PECH-CAB-03]': '[PECH-CABLE_CROSS-MID_01]',
  '[PECH-CABLE_CROSS-MID_01]': '[PECH-CABLE_CROSS-MID_01]',
  '[PECH-CABLE_CROSS-LOW_01]': '[PECH-CABLE_CROSS-LOW_01]',
  '[PECH-INC-04]': '[PECH-INC_PRESS-NITRO_01]',
  '[PECH-FLAT-06]': '[PECH-CHEST_PRESS-MANC_FLAT_01]',
  '[PECH-INC_PRESS-MANC_30]': '[PECH-INC_PRESS-MANC_30]',
  '[PECH-INC_PRESS-SMITH_01]': '[PECH-INC_PRESS-SMITH_01]',
  '[PECH-INC_PRESS-NITRO_01]': '[PECH-INC_PRESS-NITRO_01]',
  '[PECH-INC_PRESS-BAR_30]': '[PECH-INC_PRESS-BAR_30]',
  '[PECH-INC_PRESS-DISC_HAMMER]': '[PECH-INC_PRESS-DISC_HAMMER]',
  '[PECH-FLY-MANC_FLAT_01]': '[PECH-FLY-MANC_FLAT_01]',
  '[PECH-CHEST_PRESS-MANC_FLAT_01]': '[PECH-CHEST_PRESS-MANC_FLAT_01]',
  '[PECH-CHEST_PRESS-SMITH_01]': '[PECH-CHEST_PRESS-SMITH_01]',

  // Espalda
  '[ESPA-PULL-01]': '[ESPA-PULLDOWN-WIDE_01]',
  '[ESPA-PULLDOWN-WIDE_01]': '[ESPA-PULLDOWN-WIDE_01]',
  '[ESPA-ROW-02]': '[ESPA-SEATED_ROW-GIRONDA_01]',
  '[ESPA-SEATED_ROW-GIRONDA_01]': '[ESPA-SEATED_ROW-GIRONDA_01]',
  '[ESPA-MAQ-03]': '[ESPA-MACHINE_ROW-CHEST_SUPP_01]',
  '[ESPA-MACHINE_ROW-CHEST_SUPP_01]': '[ESPA-MACHINE_ROW-CHEST_SUPP_01]',
  '[ESPA-PULOV-04]': '[ESPA-PULLOVER-HIGH_CABLE_01]',
  '[ESPA-PULLOVER-HIGH_CABLE_01]': '[ESPA-PULLOVER-HIGH_CABLE_01]',
  '[ESPA-NEUT-05]': '[ESPA-PULLDOWN-V_GRIP_01]',
  '[ESPA-PULLDOWN-V_GRIP_01]': '[ESPA-PULLDOWN-V_GRIP_01]',
  '[ESPA-CHINUP-WIDE_01]': '[ESPA-CHINUP-WIDE_01]',
  '[ESPA-PULLDOWN-UNI_CABLE_01]': '[ESPA-PULLDOWN-UNI_CABLE_01]',
  '[ESPA-TBAR_ROW-CHEST_01]': '[ESPA-TBAR_ROW-CHEST_01]',
  '[ESPA-PULLOVER-MANC_01]': '[ESPA-PULLOVER-MANC_01]',
  '[ESPA-PULLOVER-MAQ_01]': '[ESPA-PULLOVER-MAQ_01]',
  '[ESPA-PULLDOWN-SUPINE_01]': '[ESPA-PULLDOWN-SUPINE_01]',
  '[ESPA-CHINUP-CLOSE_NEUTRAL_01]': '[ESPA-CHINUP-CLOSE_NEUTRAL_01]',
  '[ESPA-ONE_ARM_ROW-MANC_01]': '[ESPA-ONE_ARM_ROW-MANC_01]',

  // Hombros
  '[HOMB-LAT-01]': '[HOMB-LAT_RAISE-MAQ_01]',
  '[HOMB-LAT_RAISE-MAQ_01]': '[HOMB-LAT_RAISE-MAQ_01]',
  '[HOMB-PRESS-02]': '[HOMB-SHOULDER_PRESS-CONV_01]',
  '[HOMB-SHOULDER_PRESS-CONV_01]': '[HOMB-SHOULDER_PRESS-CONV_01]',
  '[HOMB-POST-03]': '[HOMB-REAR_DELT-PEC_DECK_01]',
  '[HOMB-REAR_DELT-PEC_DECK_01]': '[HOMB-REAR_DELT-PEC_DECK_01]',
  '[HOMB-FACE-04]': '[HOMB-FACE_PULL-HIGH_CABLE_01]',
  '[HOMB-FACE_PULL-HIGH_CABLE_01]': '[HOMB-FACE_PULL-HIGH_CABLE_01]',
  '[HOMB-DUMB-05]': '[HOMB-LAT_RAISE-MANC_01]',
  '[HOMB-LAT_RAISE-MANC_01]': '[HOMB-LAT_RAISE-MANC_01]',
  '[HOMB-LAT_RAISE-CABLE_01]': '[HOMB-LAT_RAISE-CABLE_01]',
  '[HOMB-LAT_RAISE-MANC_SIDE_30]': '[HOMB-LAT_RAISE-MANC_SIDE_30]',
  '[HOMB-REAR_DELT-CABLE_01]': '[HOMB-REAR_DELT-CABLE_01]',
  '[HOMB-LAT_RAISE-BEHIND_CABLE_01]': '[HOMB-LAT_RAISE-BEHIND_CABLE_01]',
  '[HOMB-REAR_DELT-MANC_INC_01]': '[HOMB-REAR_DELT-MANC_INC_01]',
  '[HOMB-UPRIGHT_ROW-CABLE_01]': '[HOMB-UPRIGHT_ROW-CABLE_01]',

  // Cuádriceps
  '[CUAD-PRENS-01]': '[CUAD-LEG_PRESS-DISC_45_PB]',
  '[CUAD-LEG_PRESS-DISC_45_PB]': '[CUAD-LEG_PRESS-DISC_45_PB]',
  '[CUAD-HACK-02]': '[CUAD-HACK_SQUAT-DISC_01]',
  '[CUAD-HACK_SQUAT-DISC_01]': '[CUAD-HACK_SQUAT-DISC_01]',
  '[CUAD-EXT-03]': '[CUAD-LEG_EXT-STACK_01]',
  '[CUAD-LEG_EXT-STACK_01]': '[CUAD-LEG_EXT-STACK_01]',
  '[CUAD-BULGAR-DB]': '[CUAD-BULGARIAN-MANC_01]',
  '[CUAD-BULGARIAN-MANC_01]': '[CUAD-BULGARIAN-MANC_01]',
  '[CUAD-BULGAR-SMITH]': '[CUAD-BULGARIAN-SMITH_01]',
  '[CUAD-BULGARIAN-SMITH_01]': '[CUAD-BULGARIAN-SMITH_01]',
  '[CUAD-SISSY_SQUAT-BENCH_01]': '[CUAD-SISSY_SQUAT-BENCH_01]',
  '[CUAD-LEG_EXT-UNI_01]': '[CUAD-LEG_EXT-UNI_01]',
  '[CUAD-V_SQUAT-MAQ_01]': '[CUAD-V_SQUAT-MAQ_01]',
  '[CUAD-SQUAT-SMITH_01]': '[CUAD-SQUAT-SMITH_01]',
  '[CUAD-LEG_PRESS-HORIZ_01]': '[CUAD-LEG_PRESS-HORIZ_01]',
  '[CUAD-HACK_SQUAT-REVERSE_01]': '[CUAD-HACK_SQUAT-REVERSE_01]',
  '[CUAD-LEG_PRESS-UNI_01]': '[CUAD-LEG_PRESS-UNI_01]',

  // Isquiotibiales
  '[ISQU-CURL-01]': '[ISQU-LEG_CURL-SEATED_01]',
  '[ISQU-LEG_CURL-SEATED_01]': '[ISQU-LEG_CURL-SEATED_01]',
  '[ISQU-RDL-03]': '[ISQU-RDL-MANC_01]',
  '[ISQU-RDL-DB]': '[ISQU-RDL-MANC_01]',
  '[ISQU-RDL-MANC_01]': '[ISQU-RDL-MANC_01]',
  '[ISQU-RDL-SMITH]': '[ISQU-RDL-SMITH_01]',
  '[ISQU-RDL-SMITH_01]': '[ISQU-RDL-SMITH_01]',
  '[ISQU-RDL-BB]': '[ISQU-RDL-BARBELL_01]',
  '[ISQU-RDL-BARBELL_01]': '[ISQU-RDL-BARBELL_01]',
  '[ISQU-LEG_CURL-LYING_01]': '[ISQU-LEG_CURL-LYING_01]',
  '[ISQU-NORDIC_CURL-ASSIST_01]': '[ISQU-NORDIC_CURL-ASSIST_01]',
  '[ISQU-DEADLIFT-TRAP_BAR_01]': '[ISQU-DEADLIFT-TRAP_BAR_01]',

  // Glúteos
  '[GLUT-HIP-02]': '[GLUT-HIP_THRUST-MAQ_01]',
  '[GLUT-HIP_THRUST-MAQ_01]': '[GLUT-HIP_THRUST-MAQ_01]',
  '[ABDU-MAQ-02]': '[ABDU-ABDUCTOR-STACK_01]',
  '[ABDU-ABDUCTOR-STACK_01]': '[ABDU-ABDUCTOR-STACK_01]',
  '[GLUT-BUTT_BLASTER-MAQ_01]': '[GLUT-BUTT_BLASTER-MAQ_01]',
  '[GLUT-ROMAN-04]': '[GLUT-ROMAN_CHAIR-45_01]',
  '[GLUT-ROMAN_CHAIR-45_01]': '[GLUT-ROMAN_CHAIR-45_01]',
  '[GLUT-LEG_PRESS-HIGH_FEET_45]': '[GLUT-LEG_PRESS-HIGH_FEET_45]',
  '[ABDU-CABLE-ANKLE_01]': '[ABDU-CABLE-ANKLE_01]',
  '[GLUT-CABLE_KICK-ANKLE_01]': '[GLUT-CABLE_KICK-ANKLE_01]',
  '[ABDU-CABLE_KICK-ANKLE_01]': '[ABDU-CABLE_KICK-ANKLE_01]',

  // Bíceps
  '[BICEP-PRED-01]': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  '[BICEP-POLE-04]': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  '[BICEP-DUMB-05]': '[BICEP-INCLINE_CURL-MANC_60_01]',
  '[BICEP-INCLINE_CURL-MANC_60_01]': '[BICEP-INCLINE_CURL-MANC_60_01]',
  '[BICEP-CABLE_CURL-BAYESIAN_01]': '[BICEP-CABLE_CURL-BAYESIAN_01]',
  '[BICEP-BARBELL_CURL-EZ_BAR_01]': '[BICEP-BARBELL_CURL-EZ_BAR_01]',
  '[BICEP-HAMMER_CURL-MANC_01]': '[BICEP-HAMMER_CURL-MANC_01]',
  '[BICEP-PREACHER_CURL-EZ_BAR_01]': '[BICEP-PREACHER_CURL-EZ_BAR_01]',
  '[BICEP-CONCENTRATION_CURL-MANC_01]': '[BICEP-CONCENTRATION_CURL-MANC_01]',

  // Tríceps
  '[TRIC-PUSH-02]': '[TRIC-PUSHDOWN-CABLE_01]',
  '[TRIC-PUSHDOWN-CABLE_01]': '[TRIC-PUSHDOWN-CABLE_01]',
  '[TRIC-DIPS-03]': '[TRIC-DIPS-ASSIST_01]',
  '[TRIC-DIPS-ASSIST_01]': '[TRIC-DIPS-ASSIST_01]',
  '[TRIC-KATANA_EXT-CABLE_01]': '[TRIC-KATANA_EXT-CABLE_01]',
  '[TRIC-OVER-07]': '[TRIC-OVERHEAD_EXT-MANC_01]',
  '[TRIC-OVERHEAD_EXT-MANC_01]': '[TRIC-OVERHEAD_EXT-MANC_01]',
  '[TRIC-OVERHEAD_EXT-ROPE_01]': '[TRIC-OVERHEAD_EXT-ROPE_01]',
  '[TRIC-FRENCH_PRESS-MANC_01]': '[TRIC-FRENCH_PRESS-MANC_01]',
  '[TRIC-SEATED_EXT-MAQ_01]': '[TRIC-SEATED_EXT-MAQ_01]',

  // Pantorrillas & Core
  '[PANT-MAQ-01]': '[PANT-CALF_RAISE-MAQ_01]',
  '[PANT-CALF_RAISE-MAQ_01]': '[PANT-CALF_RAISE-MAQ_01]',
  '[PANT-CALF_RAISE-LEG_PRESS_01]': '[PANT-CALF_RAISE-LEG_PRESS_01]',
  '[PANT-CALF_RAISE-SMITH_01]': '[PANT-CALF_RAISE-SMITH_01]',
  '[ABDO-CRUN-02]': '[ABDO-CRUNCH-CABLE_01]',
  '[ABDO-CRUNCH-CABLE_01]': '[ABDO-CRUNCH-CABLE_01]',
  '[ABDO-VACU-03]': '[ABDO-VACUUM-ISOM_01]',
  '[ABDO-VACUUM-ISOM_01]': '[ABDO-VACUUM-ISOM_01]',
  '[ABDO-PALL-04]': '[ABDO-PALLOF_PRESS-CABLE_01]',
  '[ABDO-PALLOF_PRESS-CABLE_01]': '[ABDO-PALLOF_PRESS-CABLE_01]',
  '[ABDO-PLANK-ISOM_01]': '[ABDO-PLANK-ISOM_01]',
  '[ADUC-MAQ-01]': '[ADUC-ADUCTOR-STACK_01]',
  '[ADUC-ADUCTOR-STACK_01]': '[ADUC-ADUCTOR-STACK_01]',

  // Cardio
  '[CARD-ZONA2-CAM-01]': '[CARD-TREADMILL-ZONA2_01]',
  '[CARD-TREADMILL-ZONA2_01]': '[CARD-TREADMILL-ZONA2_01]',
  '[CARD-ZONA2-BIC-02]': '[CARD-BIKE-STATIONARY_01]',
  '[CARD-BIKE-STATIONARY_01]': '[CARD-BIKE-STATIONARY_01]',
  '[CARD-TREADMILL-INCLINE_01]': '[CARD-TREADMILL-INCLINE_01]',
  '[CARD-ELLIPTICAL-ZONA2_01]': '[CARD-ELLIPTICAL-ZONA2_01]'
};

// DICCIONARIO DE IDENTIFICADORES HISTÓRICOS (Exactamente extraído de scientificProtocol y Biblioteca Original)
export const HISTORICAL_ID_TO_CANONICAL_MAP = {
  // Protocol Day 1
  'd1_e1': '[PECH-INC_PRESS-MANC_30]',
  'd1_e1_eq1': '[PECH-INC_PRESS-SMITH_01]',
  'd1_e1_eq2': '[PECH-INC_PRESS-NITRO_01]',
  'd1_e5': '[HOMB-LAT_RAISE-MAQ_01]',
  'd1_e5_eq1': '[HOMB-LAT_RAISE-CABLE_01]',
  'd1_e5_eq2': '[HOMB-LAT_RAISE-MANC_SIDE_30]',
  'd1_e2': '[PECH-INC_PRESS-NITRO_01]',
  'd1_e2_eq1': '[PECH-INC_PRESS-BAR_30]',
  'd1_e2_eq2': '[PECH-INC_PRESS-DISC_HAMMER]',
  'd1_e4': '[PECH-PEC_DECK-STACK_01]',
  'd1_e4_eq1': '[PECH-CABLE_CROSS-MID_01]',
  'd1_e4_eq2': '[PECH-FLY-MANC_FLAT_01]',
  'd1_e6': '[TRIC-OVERHEAD_EXT-CABLE_01]',
  'd1_e6_eq1': '[TRIC-KATANA_EXT-CABLE_01]',
  'd1_e6_eq2': '[TRIC-FRENCH_PRESS-MANC_01]',
  'd1_e6_eq3': '[TRIC-PUSHDOWN-STRAIGHT_01]',
  'd1_e8': '[ABDO-VACUUM-ISOM_01]',
  'd1_e8_eq1': '[ABDO-PLANK-ISOM_01]',
  'd1_e9': '[CARD-TREADMILL-ZONA2_01]',
  'd1_e9_eq1': '[CARD-TREADMILL-INCLINE_01]',
  'd1_e9_eq2': '[CARD-BIKE-STATIONARY_01]',

  // Protocol Day 2
  'd2_e3': '[CUAD-LEG_EXT-STACK_01]',
  'd2_e3_eq1': '[CUAD-SISSY_SQUAT-BENCH_01]',
  'd2_e3_eq2': '[CUAD-LEG_EXT-UNI_01]',
  'd2_e1': '[CUAD-HACK_SQUAT-DISC_01]',
  'd2_e1_eq1': '[CUAD-V_SQUAT-MAQ_01]',
  'd2_e1_eq2': '[CUAD-SQUAT-SMITH_01]',
  'd2_e2': '[CUAD-LEG_PRESS-DISC_45_PB]',
  'd2_e2_eq1': '[CUAD-LEG_PRESS-HORIZ_01]',
  'd2_e2_eq2': '[CUAD-HACK_SQUAT-REVERSE_01]',
  'd2_e4': '[CUAD-LEG_PRESS-UNI_01]',
  'd2_e6': '[ABDU-ABDUCTOR-STACK_01]',
  'd2_e6_eq1': '[ABDU-CABLE-ANKLE_01]',
  'd2_e5': '[ADUC-ADUCTOR-STACK_01]',
  'd2_e7': '[PANT-CALF_RAISE-MAQ_01]',
  'd2_e7_eq1': '[PANT-CALF_RAISE-LEG_PRESS_01]',
  'd2_e7_eq2': '[PANT-CALF_RAISE-SMITH_01]',
  'd2_e9': '[CARD-TREADMILL-ZONA2_01]',
  'd2_e9_eq1': '[CARD-TREADMILL-INCLINE_01]',
  'd2_e9_eq2': '[CARD-BIKE-STATIONARY_01]',

  // Protocol Day 3
  'd3_e1': '[ESPA-PULLDOWN-WIDE_01]',
  'd3_e1_eq1': '[ESPA-CHINUP-WIDE_01]',
  'd3_e1_eq2': '[ESPA-PULLDOWN-UNI_CABLE_01]',
  'd3_e2': '[ESPA-MACHINE_ROW-CHEST_SUPP_01]',
  'd3_e2_eq1': '[ESPA-TBAR_ROW-CHEST_01]',
  'd3_e2_eq2': '[ESPA-SEATED_ROW-GIRONDA_01]',
  'd3_e3': '[ESPA-PULLOVER-HIGH_CABLE_01]',
  'd3_e3_eq1': '[ESPA-PULLOVER-MANC_01]',
  'd3_e3_eq2': '[ESPA-PULLOVER-MAQ_01]',
  'd3_e4': '[HOMB-FACE_PULL-HIGH_CABLE_01]',
  'd3_e4_eq1': '[HOMB-REAR_DELT-PEC_DECK_01]',
  'd3_e4_eq2': '[HOMB-REAR_DELT-CABLE_01]',
  'd3_e5': '[BICEP-CABLE_CURL-BAYESIAN_01]',
  'd3_e5_eq_cable': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  'd3_e5_eq1': '[BICEP-INCLINE_CURL-MANC_60_01]',
  'd3_e5_eq_scott': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  'd3_e6': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  'd3_e6_eq_bayes': '[BICEP-CABLE_CURL-BAYESIAN_01]',
  'd3_e6_eq_incline': '[BICEP-INCLINE_CURL-MANC_60_01]',
  'd3_e6_eq1': '[BICEP-BARBELL_CURL-EZ_BAR_01]',
  'd3_e6_eq2': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  'd3_e7': '[ABDO-VACUUM-ISOM_01]',
  'd3_e7_eq1': '[ABDO-PLANK-ISOM_01]',
  'd3_e8': '[CARD-TREADMILL-ZONA2_01]',
  'd3_e8_eq1': '[CARD-TREADMILL-INCLINE_01]',
  'd3_e8_eq2': '[CARD-ELLIPTICAL-ZONA2_01]',

  // Protocol Day 4
  'd4_e1': '[PECH-CHEST_PRESS-CONV_01]',
  'd4_e1_eq1': '[PECH-CHEST_PRESS-MANC_FLAT_01]',
  'd4_e1_eq2': '[PECH-CHEST_PRESS-SMITH_01]',
  'd4_e4': '[HOMB-LAT_RAISE-BEHIND_CABLE_01]',
  'd4_e4_eq1': '[HOMB-LAT_RAISE-MAQ_01]',
  'd4_e4_eq2': '[HOMB-LAT_RAISE-MANC_01]',
  'd4_e2': '[PECH-INC_PRESS-NITRO_01]',
  'd4_e2_eq1': '[PECH-INC_PRESS-MANC_30]',
  'd4_e2_eq2': '[PECH-INC_PRESS-SMITH_01]',
  'd4_e3': '[PECH-PEC_DECK-STACK_01]',
  'd4_e3_eq1': '[PECH-CABLE_CROSS-MID_01]',
  'd4_e3_eq2': '[PECH-CABLE_CROSS-LOW_01]',
  'd4_e6': '[TRIC-PUSHDOWN-CABLE_01]',
  'd4_e5': '[TRIC-SEATED_EXT-MAQ_01]',
  'd4_e6_eq1': '[TRIC-KATANA_EXT-CABLE_01]',
  'd4_e7': '[ABDO-VACUUM-ISOM_01]',
  'd4_e7_eq1': '[ABDO-PLANK-ISOM_01]',
  'd4_e9': '[CARD-TREADMILL-ZONA2_01]',
  'd4_e9_eq1': '[CARD-TREADMILL-INCLINE_01]',
  'd4_e9_eq2': '[CARD-BIKE-STATIONARY_01]',

  // Protocol Day 5
  'd5_e2': '[ISQU-LEG_CURL-SEATED_01]',
  'd5_e2_eq1': '[ISQU-LEG_CURL-LYING_01]',
  'd5_e2_eq2': '[ISQU-NORDIC_CURL-ASSIST_01]',
  'd5_e3': '[GLUT-LEG_PRESS-HIGH_FEET_45]',
  'd5_e3_eq1': '[GLUT-HIP_THRUST-MAQ_01]',
  'd5_e1': '[ISQU-RDL-MANC_01]',
  'd5_e1_eq1': '[ISQU-RDL-BARBELL_01]',
  'd5_e1_eq2': '[ISQU-DEADLIFT-TRAP_BAR_01]',
  'd5_e4': '[GLUT-BUTT_BLASTER-MAQ_01]',
  'd5_e4_eq1': '[GLUT-ROMAN_CHAIR-45_01]',
  'd5_e4_eq2': '[GLUT-CABLE_KICK-ANKLE_01]',
  'd5_e5': '[ABDU-ABDUCTOR-STACK_01]',
  'd5_e6': '[ADUC-ADUCTOR-STACK_01]',
  'd5_e5_eq1': '[ABDU-CABLE_KICK-ANKLE_01]',
  'd5_e7': '[PANT-CALF_RAISE-MAQ_01]',
  'd5_e7_eq1': '[PANT-CALF_RAISE-SMITH_01]',
  'd5_e8': '[ABDO-VACUUM-ISOM_01]',
  'd5_e8_eq1': '[ABDO-PLANK-ISOM_01]',
  'd5_e9': '[CARD-TREADMILL-ZONA2_01]',
  'd5_e9_eq1': '[CARD-TREADMILL-INCLINE_01]',
  'd5_e9_eq2': '[CARD-BIKE-STATIONARY_01]',

  // Protocol Day 6
  'd6_e1': '[ESPA-PULLDOWN-V_GRIP_01]',
  'd6_e1_eq_wide': '[ESPA-PULLDOWN-WIDE_01]',
  'd6_e1_eq1': '[ESPA-PULLDOWN-SUPINE_01]',
  'd6_e1_eq2': '[ESPA-CHINUP-CLOSE_NEUTRAL_01]',
  'd6_e2': '[ESPA-SEATED_ROW-GIRONDA_01]',
  'd6_e2_eq_comp': '[ESPA-MACHINE_ROW-CHEST_SUPP_01]',
  'd6_e2_eq1': '[ESPA-ONE_ARM_ROW-MANC_01]',
  'd6_e4': '[HOMB-LAT_RAISE-MANC_01]',
  'd6_e4_eq_mach': '[HOMB-LAT_RAISE-MAQ_01]',
  'd6_e4_eq_cable_back': '[HOMB-LAT_RAISE-BEHIND_CABLE_01]',
  'd6_e4_eq1': '[HOMB-LAT_RAISE-CABLE_01]',
  'd6_e3': '[HOMB-FACE_PULL-HIGH_CABLE_01]',
  'd6_e3_eq1': '[HOMB-REAR_DELT-PEC_DECK_01]',
  'd6_e3_eq_db': '[HOMB-REAR_DELT-MANC_INC_01]',
  'd6_e3_eq2': '[HOMB-UPRIGHT_ROW-CABLE_01]',
  'd6_e5': '[BICEP-INCLINE_CURL-MANC_60_01]',
  'd6_e5_eq_bayes': '[BICEP-CABLE_CURL-BAYESIAN_01]',
  'd6_e5_eq_cable': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  'd6_e5_eq_scott': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  'd6_e5_eq1': '[BICEP-HAMMER_CURL-MANC_01]',
  'd6_e5_eq_barbell': '[BICEP-BARBELL_CURL-EZ_BAR_01]',
  'd6_e6': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  'd6_e6_eq_bayes': '[BICEP-CABLE_CURL-BAYESIAN_01]',
  'd6_e6_eq_cable': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  'd6_e6_eq_incline': '[BICEP-INCLINE_CURL-MANC_60_01]',
  'd6_e6_eq1': '[BICEP-PREACHER_CURL-EZ_BAR_01]',
  'd6_e6_eq2': '[BICEP-CONCENTRATION_CURL-MANC_01]',
  'd6_e7': '[ABDO-VACUUM-ISOM_01]',
  'd6_e7_eq1': '[ABDO-PLANK-ISOM_01]',
  'd6_e7_eq_pallof': '[ABDO-PALLOF_PRESS-CABLE_01]',
  'd6_e8': '[CARD-TREADMILL-ZONA2_01]',
  'd6_e8_eq1': '[CARD-TREADMILL-INCLINE_01]',
  'd6_e8_eq2': '[CARD-BIKE-STATIONARY_01]',
  'd6_e8_eq3': '[CARD-ELLIPTICAL-ZONA2_01]',

  // Biblioteca Legada Original (lib_pecho_1, etc.)
  'lib_pecho_1': '[PECH-CHEST_PRESS-CONV_01]',
  'lib_pecho_2': '[PECH-PEC_DECK-STACK_01]',
  'lib_pecho_3': '[PECH-CABLE_CROSS-MID_01]',
  'lib_pecho_4': '[PECH-INC_PRESS-NITRO_01]',
  'lib_pecho_5': '[PECH-CHEST_PRESS-MANC_FLAT_01]',
  'lib_esp_1': '[ESPA-PULLDOWN-WIDE_01]',
  'lib_esp_2': '[ESPA-SEATED_ROW-GIRONDA_01]',
  'lib_esp_3': '[ESPA-MACHINE_ROW-CHEST_SUPP_01]',
  'lib_esp_4': '[ESPA-PULLOVER-HIGH_CABLE_01]',
  'lib_esp_5': '[ESPA-PULLDOWN-V_GRIP_01]',
  'lib_homb_1': '[HOMB-LAT_RAISE-MAQ_01]',
  'lib_homb_2': '[HOMB-SHOULDER_PRESS-CONV_01]',
  'lib_homb_3': '[HOMB-REAR_DELT-PEC_DECK_01]',
  'lib_homb_4': '[HOMB-FACE_PULL-HIGH_CABLE_01]',
  'lib_homb_5': '[HOMB-LAT_RAISE-MANC_01]',
  'lib_piern_1': '[CUAD-LEG_PRESS-DISC_45_PB]',
  'lib_piern_2': '[CUAD-HACK_SQUAT-DISC_01]',
  'lib_piern_3': '[CUAD-LEG_EXT-STACK_01]',
  'lib_piern_4': '[ISQU-LEG_CURL-SEATED_01]',
  'lib_piern_5': '[ISQU-RDL-MANC_01]',
  'lib_piern_6': '[GLUT-HIP_THRUST-MAQ_01]',
  'lib_piern_7': '[ABDU-ABDUCTOR-STACK_01]',
  'lib_piern_8': '[PANT-CALF_RAISE-MAQ_01]',
  'lib_brazo_1': '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]',
  'lib_brazo_2': '[TRIC-PUSHDOWN-CABLE_01]',
  'lib_brazo_3': '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]',
  'lib_brazo_4': '[TRIC-DIPS-ASSIST_01]',
  'lib_brazo_5': '[BICEP-INCLINE_CURL-MANC_60_01]',
  'lib_brazo_6': '[TRIC-OVERHEAD_EXT-MANC_01]',
  'lib_core_1': '[ABDO-CRUNCH-CABLE_01]',
  'lib_core_2': '[ABDO-VACUUM-ISOM_01]',
  'lib_core_3': '[ABDO-PALLOF_PRESS-CABLE_01]',
  'lib_core_4': '[ADUC-ADUCTOR-STACK_01]',
  'lib_cardio_1': '[CARD-TREADMILL-ZONA2_01]',
  'lib_cardio_2': '[CARD-BIKE-STATIONARY_01]'
};

// DICCIONARIO DE VARIANTES REALES AUDITADAS DEL HISTORIAL (77 Nombres del Usuario)
const REAL_DATABASE_ALIASES = [
  // Prensa 45 Central (Cuádriceps)
  { name: 'Prensa de Piernas (Posición Central)', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },
  { name: 'Prensa de Piernas 45° (Posición Central)', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },
  { name: 'Prensa de Piernas', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },
  { name: 'Prensa 45', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },
  { name: 'Prensa 45°', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },
  { name: 'Prensa de Pierna Inclinada 45° (Leg Press 45°)', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },
  { name: 'Prensa Central', code: '[CUAD-LEG_PRESS-DISC_45_PB]' },

  // Prensa Pies Altos (Glúteos & Isquios)
  { name: 'Prensa de Piernas con Pies Altos y Anchos (High Stance Leg Press)', code: '[GLUT-LEG_PRESS-HIGH_FEET_45]' },
  { name: 'Prensa de Piernas (Pies Altos y Abiertos)', code: '[GLUT-LEG_PRESS-HIGH_FEET_45]' },
  { name: 'Prensa de Piernas 45° (Pies Altos y Separados)', code: '[GLUT-LEG_PRESS-HIGH_FEET_45]' },
  { name: 'High Stance Leg Press', code: '[GLUT-LEG_PRESS-HIGH_FEET_45]' },
  { name: 'Prensa Pies Altos', code: '[GLUT-LEG_PRESS-HIGH_FEET_45]' },

  // Prensa Unilateral
  { name: 'Prensa Unilateral a 1 Pierna (Pie Alto)', code: '[CUAD-LEG_PRESS-UNI_01]' },

  // Cuádriceps / Sentadillas / Extensiones
  { name: 'Sentadilla Búlgara con Mancuernas o Smith', code: '[CUAD-BULGARIAN-MANC_01]' },
  { name: 'Sentadilla en Máquina Hack', code: '[CUAD-HACK_SQUAT-DISC_01]' },
  { name: 'Sentadilla en Máquina Hack (Hack Squat)', code: '[CUAD-HACK_SQUAT-DISC_01]' },
  { name: 'Extensión de Cuádriceps (Leg Extension)', code: '[CUAD-LEG_EXT-STACK_01]' },
  { name: 'Extensión de Cuádriceps (Pre-activación)', code: '[CUAD-LEG_EXT-STACK_01]' },
  { name: 'Extensiones de Cuádriceps en Máquina Sentado (Leg Extension)', code: '[CUAD-LEG_EXT-STACK_01]' },

  // Pecho
  { name: 'Nitro Incline Press Machine (30°)', code: '[PECH-INC_PRESS-NITRO_01]' },
  { name: 'Press Inclinado con Mancuernas (30°)', code: '[PECH-INC_PRESS-MANC_30]' },
  { name: 'Machine Chest Press (Prensa Pecho Plano)', code: '[PECH-CHEST_PRESS-CONV_01]' },
  { name: 'Machine Chest Press (Prensa de Pecho Plano)', code: '[PECH-CHEST_PRESS-CONV_01]' },
  { name: 'Pec Deck (Cristos en Máquina)', code: '[PECH-PEC_DECK-STACK_01]' },
  { name: 'Cristos en Máquina (Pec Deck)', code: '[PECH-PEC_DECK-STACK_01]' },

  // Espalda
  { name: 'Jalón al Pecho (Agarre Ancho Pronado)', code: '[ESPA-PULLDOWN-WIDE_01]' },
  { name: 'Jalón al Pecho en Polea (Agarre Ancho PRONADO)', code: '[ESPA-PULLDOWN-WIDE_01]' },
  { name: 'Jalón al Pecho Agarre Estrecho Neutro', code: '[ESPA-PULLDOWN-V_GRIP_01]' },
  { name: 'Remo Compuesto en Máquina', code: '[ESPA-MACHINE_ROW-CHEST_SUPP_01]' },
  { name: 'Remo Compuesto en Máquina (Apoyo al pecho)', code: '[ESPA-MACHINE_ROW-CHEST_SUPP_01]' },
  { name: 'Remo en Máquina o Gironda (Agarre Neutro)', code: '[ESPA-SEATED_ROW-GIRONDA_01]' },

  // Hombros
  { name: 'Press Militar en Máquina (Dual Axis)', code: '[HOMB-SHOULDER_PRESS-CONV_01]' },
  { name: 'Elevaciones Laterales en Polea o Máquina', code: '[HOMB-LAT_RAISE-MAQ_01]' },
  { name: 'Elevaciones Laterales en Polea Baja', code: '[HOMB-LAT_RAISE-CABLE_01]' },
  { name: 'Elevaciones Laterales con Mancuernas (o Máquina)', code: '[HOMB-LAT_RAISE-MANC_01]' },
  { name: 'Face Pulls en Polea Alta (con Cuerda)', code: '[HOMB-FACE_PULL-HIGH_CABLE_01]' },

  // Brazos (Bíceps y Tríceps)
  { name: 'Curl de Bíceps en Polea (Barra Recta)', code: '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]' },
  { name: 'Curl de Bíceps en Polea Baja (Barra Recta o Cuerda)', code: '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]' },
  { name: 'Curl en Polea Baja', code: '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]' },
  { name: 'Curl polea barra', code: '[BICEP-CABLE_CURL-LOW_STRAIGHT_01]' },
  { name: 'Arm Curl Machine', code: '[BICEP-PREACHER_CURL-SCOTT_MAQ_01]' },
  { name: 'Curl de Bíceps con Mancuernas (Supinado al subir)', code: '[BICEP-INCLINE_CURL-MANC_60_01]' },
  { name: 'Curl de Bíceps con Mancuernas (Supinado)', code: '[BICEP-INCLINE_CURL-MANC_60_01]' },
  { name: 'Bayesian Cable Curl (Bíceps en Estiramiento Humeral)', code: '[BICEP-CABLE_CURL-BAYESIAN_01]' },
  { name: 'Extensión de Tríceps Cruzada en Polea (Sobre la Cabeza)', code: '[TRIC-KATANA_EXT-CABLE_01]' },
  { name: 'Extensión de Tríceps en Máquina', code: '[TRIC-SEATED_EXT-MAQ_01]' },
  { name: 'Extensión de Tríceps en Máquina (Sentado)', code: '[TRIC-SEATED_EXT-MAQ_01]' },
  { name: 'Extensión de Tríceps en Polea (Pushdown)', code: '[TRIC-PUSHDOWN-CABLE_01]' },
  { name: 'Extensión de Tríceps en Polea Alta con Cuerda o Barra (Triceps Pushdown)', code: '[TRIC-PUSHDOWN-CABLE_01]' },

  // Glúteos y Aductores
  { name: 'Glute Butt Blaster', code: '[GLUT-BUTT_BLASTER-MAQ_01]' },
  { name: 'Glute Butt Blaster en Máquina', code: '[GLUT-BUTT_BLASTER-MAQ_01]' },
  { name: 'Hip Abductor Machine (Abrir Cadera)', code: '[ABDU-ABDUCTOR-STACK_01]' },
  { name: 'Hip Adductor Machine (Cerrar Cadera)', code: '[ADUC-ADUCTOR-STACK_01]' },
  { name: 'Aductores en Máquina (Hip Adduction)', code: '[ADUC-ADUCTOR-STACK_01]' },
  { name: 'Extensiones de Glúteo a 45° en Banco Romano', code: '[GLUT-ROMAN_CHAIR-45_01]' },

  // Pantorrillas
  { name: 'Elevación de Pantorrillas (Rotary Calf)', code: '[PANT-CALF_RAISE-MAQ_01]' },
  { name: 'Elevación de Pantorrillas de Pie en Smith', code: '[PANT-CALF_RAISE-SMITH_01]' },
  { name: 'Elevación en Smith de pie sobre plataforma', code: '[PANT-CALF_RAISE-SMITH_01]' },
  { name: 'Elevación en Smith sobre escalón o en Prensa', code: '[PANT-CALF_RAISE-SMITH_01]' },

  // Cardio & Core
  { name: 'Cardio Bicicleta', code: '[CARD-BIKE-STATIONARY_01]' },
  { name: 'Vacuum Abdominal (Transverso)', code: '[ABDO-VACUUM-ISOM_01]' }
];

export function normalizeExerciseNameFull(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[()]/g, ' ') // Conservar palabras que estaban entre paréntesis
    .replace(/[^a-z0-9\s]/g, ' ') // Quitar signos
    .replace(/\b(en|con|de|la|el|para|un|una|a|al|y|o|por|sobre|exactos|grados)\b/g, ' ') // Quitar conectores
    .replace(/\s+/g, ' ')
    .trim();
}

function registerAlias(name, parsed) {
  if (!name || typeof name !== 'string') return;
  // 1. MÁXIMA PRIORIDAD: Normalización completa conservando especificaciones parentéticas
  const normFull = normalizeExerciseNameFull(name);
  if (normFull && normFull.length >= 3) CANONICAL_ALIAS_MAP.set(normFull, parsed);

  // 2. Normalización estándar (sin paréntesis) solo si no sobreescribe una clave ya existente
  const norm = normalizeExerciseName(name);
  if (norm && norm.length >= 3 && !CANONICAL_ALIAS_MAP.has(norm)) {
    CANONICAL_ALIAS_MAP.set(norm, parsed);
  }

  // 3. Indexar partes de paréntesis individualmente
  const parenMatch = name.match(/^(.*?)\((.*?)\)(.*)$/);
  if (parenMatch) {
    const outside = `${parenMatch[1]} ${parenMatch[3]}`.trim();
    const inside = parenMatch[2].trim();
    const normOutside = normalizeExerciseName(outside);
    const normInside = normalizeExerciseName(inside);
    if (normOutside && normOutside.length >= 3 && !CANONICAL_ALIAS_MAP.has(normOutside)) {
      CANONICAL_ALIAS_MAP.set(normOutside, parsed);
    }
    if (normInside && normInside.length >= 3 && !CANONICAL_ALIAS_MAP.has(normInside)) {
      CANONICAL_ALIAS_MAP.set(normInside, parsed);
    }

    const normInsideFull = normalizeExerciseNameFull(inside);
    if (normInsideFull && normInsideFull.length >= 3 && !CANONICAL_ALIAS_MAP.has(normInsideFull)) {
      CANONICAL_ALIAS_MAP.set(normInsideFull, parsed);
    }
  }
}

/**
 * Inicializa el diccionario de alias indexando todos los nombres canónicos,
 * nombres comerciales, variantes de la biblioteca, del protocolo y de la base de datos real.
 */
function initCanonicalRegistry() {
  if (CANONICAL_ALIAS_MAP.size > 0) return;

  if (Array.isArray(UNIFIED_EXERCISE_LIBRARY)) {
    for (const item of UNIFIED_EXERCISE_LIBRARY) {
      if (!item.unifiedCode) continue;
      const parsed = parseUnifiedCode(item.unifiedCode);
      if (!parsed) continue;

      registerAlias(item.name, parsed);

      if (Array.isArray(item.aliases)) {
        for (const alias of item.aliases) {
          registerAlias(alias, parsed);
        }
      }
    }
  }

  if (Array.isArray(scientificProtocol)) {
    for (const d of scientificProtocol) {
      for (const e of (d.exercises || [])) {
        if (!e.unifiedCode) continue;
        const parsed = parseUnifiedCode(e.unifiedCode);
        if (!parsed) continue;
        registerAlias(e.name, parsed);

        for (const eq of (e.equivalents || [])) {
          if (!eq.unifiedCode) continue;
          const eqParsed = parseUnifiedCode(eq.unifiedCode);
          if (!eqParsed) continue;
          registerAlias(eq.name, eqParsed);
        }
      }
    }
  }

  // Indexar todas las variantes auditadas del historial real del usuario
  for (const item of REAL_DATABASE_ALIASES) {
    const parsed = parseUnifiedCode(item.code);
    if (parsed) {
      registerAlias(item.name, parsed);
    }
  }
}

/**
 * Parsea un código unificado de 3 segmentos ([GRUPO-MÁQUINA-ESPEC])
 * o formatos legados ([PECH-MAQ-01], [HIPER-GRUPO-MÁQUINA-ESPEC], etc.).
 * Retorna { group, machine, spec, canonical, machineKey, ... } o null.
 */
export function parseUnifiedCode(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return null;
  let clean = rawCode.trim().replace(/^\[/, '').replace(/\]$/, '').trim();

  // Si contiene AUTO (código de índice temporal / fallback legado), NO es un código canónico físico
  if (clean.includes('AUTO')) return null;

  // Normalizar prefijo HIPER- o CARD- legado
  if (clean.startsWith('HIPER-')) {
    clean = clean.replace(/^HIPER-/, '');
  } else if (clean.startsWith('CARD-') && !clean.startsWith('CARD-TREADMILL') && !clean.startsWith('CARD-BIKE') && !clean.startsWith('CARD-ELLIPTICAL')) {
    clean = clean.replace(/^CARD-/, '');
  }

  // Comprobar si coincide con el diccionario de retrocompatibilidad de códigos legados
  const bracketed = `[${clean}]`;
  if (LEGACY_CODE_TO_CANONICAL_MAP[bracketed]) {
    const target = LEGACY_CODE_TO_CANONICAL_MAP[bracketed];
    if (target !== bracketed) {
      return parseUnifiedCode(target);
    }
  }

  const parts = clean.split('-');

  // 1. Formato canónico de 3 segmentos: [GRUPO-MÁQUINA-ESPEC]
  if (parts.length === 3) {
    const group = parts[0].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const machine = parts[1].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const spec = parts[2].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Si el grupo es 'HIPER', no es un grupo muscular válido
    if (group === 'HIPER') return null;

    const machineKey = `${group}-${machine}`;
    return {
      group,
      machine,
      spec,
      canonical: `[${group}-${machine}-${spec}]`,
      machineKey,
      isPlateLoaded: spec.includes('DISC') || spec.includes('HAMMER'),
      isSmith: spec.includes('SMITH'),
      isDumbbell: spec.includes('MANC'),
      isBarbell: spec.includes('BAR'),
      isCable: spec.includes('CABLE') || spec.includes('STACK') || spec.includes('POLEA'),
      isMachine: spec.includes('MAQ') || spec.includes('CONV') || spec.includes('NITRO')
    };
  }

  // 2. Formato legado de 4 segmentos: [HIPER/CARD-GRUPO-MÁQUINA-ESPEC]
  if (parts.length === 4 && (parts[0].toUpperCase() === 'HIPER' || parts[0].toUpperCase() === 'CARD')) {
    const subCode = `[${parts[1]}-${parts[2]}-${parts[3]}]`;
    if (LEGACY_CODE_TO_CANONICAL_MAP[subCode]) {
      return parseUnifiedCode(LEGACY_CODE_TO_CANONICAL_MAP[subCode]);
    }
    const group = parts[1].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const machine = parts[2].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const spec = parts[3].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const machineKey = `${group}-${machine}`;
    return {
      group,
      machine,
      spec,
      canonical: `[${group}-${machine}-${spec}]`,
      machineKey,
      isPlateLoaded: spec.includes('DISC') || spec.includes('HAMMER'),
      isSmith: spec.includes('SMITH'),
      isDumbbell: spec.includes('MANC'),
      isBarbell: spec.includes('BAR'),
      isCable: spec.includes('CABLE') || spec.includes('STACK') || spec.includes('POLEA'),
      isMachine: spec.includes('MAQ') || spec.includes('CONV') || spec.includes('NITRO')
    };
  }

  return null;
}

/**
 * Obtiene el código unificado de un ejercicio, ya sea de su propia propiedad unifiedCode,
 * resolviendo códigos legados, identificadores históricos de slot o biblioteca,
 * o consultando el registro inteligente de alias canónicos.
 */
export function getUnifiedCodeForExercise(ex) {
  if (!ex) return null;
  initCanonicalRegistry();

  // 1. Si tiene código unificado explícito
  if (ex.unifiedCode && typeof ex.unifiedCode === 'string') {
    const parsed = parseUnifiedCode(ex.unifiedCode);
    if (parsed) return parsed;
  }

  // 2. Si tiene nombre, buscar en el registro inteligente de alias canónicos (PRIORIDAD ALTA: El nombre refleja la máquina real)
  const exName = (ex.name || '').trim();
  if (exName) {
    const normFull = normalizeExerciseNameFull(exName);
    if (normFull && CANONICAL_ALIAS_MAP.has(normFull)) {
      return CANONICAL_ALIAS_MAP.get(normFull);
    }
    const norm = normalizeExerciseName(exName);
    if (norm && CANONICAL_ALIAS_MAP.has(norm)) {
      return CANONICAL_ALIAS_MAP.get(norm);
    }
  }

  // 3. Si tiene un ID histórico de rutina o biblioteca (ej. 'd1_e1', 'lib_pecho_1', 'd4_e1_eq1')
  const exId = ex.id || '';
  if (exId && HISTORICAL_ID_TO_CANONICAL_MAP[exId]) {
    const parsed = parseUnifiedCode(HISTORICAL_ID_TO_CANONICAL_MAP[exId]);
    if (parsed) return parsed;
  }

  // 4. Buscar en la biblioteca unificada de ejercicios por ID o por nombre
  if (Array.isArray(UNIFIED_EXERCISE_LIBRARY)) {
    for (const lib of UNIFIED_EXERCISE_LIBRARY) {
      if ((exId && lib.id === exId) || (exName && lib.name && lib.name.trim().toLowerCase() === exName.toLowerCase())) {
        if (lib.unifiedCode) return parseUnifiedCode(lib.unifiedCode);
      }
    }
  }

  // 5. Buscar en el protocolo científico oficial
  if (Array.isArray(scientificProtocol)) {
    for (const day of scientificProtocol) {
      if (!day.exercises) continue;
      for (const dEx of day.exercises) {
        if ((exId && dEx.id === exId) || (exName && dEx.name && dEx.name.trim().toLowerCase() === exName.toLowerCase())) {
          if (dEx.unifiedCode) return parseUnifiedCode(dEx.unifiedCode);
        }
        for (const eq of (dEx.equivalents || [])) {
          if ((exId && eq.id === exId) || (exName && eq.name && eq.name.trim().toLowerCase() === exName.toLowerCase())) {
            if (eq.unifiedCode) return parseUnifiedCode(eq.unifiedCode);
          }
        }
      }
    }
  }

  return null;
}

/**
 * Normaliza nombres de ejercicios eliminando acentos, paréntesis, números y palabras de relleno,
 * conservando implementos distintivos como 'maquina' y 'banco'.
 */
export function normalizeExerciseName(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/\(.*?\)/g, '') // Quitar contenido entre paréntesis
    .replace(/[^a-z0-9\s]/g, ' ') // Quitar signos
    .replace(/\b(en|con|de|la|el|para|un|una|a|al|y|o|por|sobre|exactos|grados)\b/g, ' ') // Quitar conectores
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Diccionario de palabras clave por Familia de Carga para matching inteligente.
 */
const LOAD_FAMILY_KEYWORDS = {
  [LOAD_FAMILIES.INCLINE_PRESS]: [
    'press inclinado', 'nitro incline', 'incline press', 'inclinada smith', 'smith inclinado', 'hammer incline', 'pecho superior'
  ],
  [LOAD_FAMILIES.CHEST_PRESS]: [
    'chest press', 'prensa de pecho', 'press plano', 'machine chest press', 'press de pecho'
  ],
  [LOAD_FAMILIES.OVERHEAD_PRESS]: [
    'press militar', 'shoulder press', 'dual axis', 'overhead press', 'militar mancuerna', 'militar smith', 'press hombro'
  ],
  [LOAD_FAMILIES.VERTICAL_PULL]: [
    'jalon al pecho', 'lat pulldown', 'dominadas', 'jalon estrecho', 'jalon neutro', 'jalon pronado', 'jalon prono', 'amplitud dorsal', 'v grip'
  ],
  [LOAD_FAMILIES.HORIZONTAL_ROW]: [
    'remo compuesto', 'remo maquina', 'chest supported row', 'remo t bar', 'remo barra t', 'remo gironda', 'remo mancuerna'
  ],
  [LOAD_FAMILIES.HACK_SQUAT]: [
    'sentadilla hack', 'hack squat', 'v squat'
  ],
  [LOAD_FAMILIES.LEG_PRESS]: [
    'prensa piernas', 'prensa 90', 'leg press 45', 'prensa central', 'prensa horizontal', 'prensa pies altos', 'high stance leg press'
  ],
  [LOAD_FAMILIES.ROMANIAN_DEADLIFT]: [
    'peso muerto rumano', 'rdl', 'romanian deadlift', 'peso muerto', 'bisagra cadera'
  ],
  [LOAD_FAMILIES.HAMSTRING_CURL]: [
    'leg curl sentado', 'flexion femorales', 'seated leg curl', 'lying leg curl', 'leg curl'
  ],
  [LOAD_FAMILIES.GLUTE_EXTENSION]: [
    'extensiones gluteo', 'banco romano', 'butt blaster', 'glute extension', 'patada gluteo'
  ]
};

const SPANISH_SHORT_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const SPANISH_FULL_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/**
 * Formatea la fecha de una sesión de forma legible y corta para gráficas e historial.
 * Ejemplos de salida: "12 Sep", "28 Ago", "5 Oct"
 */
export function formatSessionDate(ses) {
  if (!ses) return 'Sesión';

  // 1. Si existe fecha ISO o formato YYYY-MM-DD
  const rawDate = ses.date || (ses.timestamp && typeof ses.timestamp === 'string' && ses.timestamp.includes('T') ? ses.timestamp.split('T')[0] : null);
  if (rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [y, m, d] = rawDate.split('-');
    const mIdx = parseInt(m, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${parseInt(d, 10)} ${SPANISH_SHORT_MONTHS[mIdx]}`;
    }
  }

  // 2. Si existe timestamp numérico o convertible a Date
  if (ses.timestamp) {
    const d = new Date(ses.timestamp);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${SPANISH_SHORT_MONTHS[d.getMonth()]}`;
    }
  }

  // 3. Si existe dateString (ej. "vie, 12 sept 2026" o "sábado, 12 de septiembre de 2026")
  if (ses.dateString && typeof ses.dateString === 'string') {
    const parts = ses.dateString.split(',');
    if (parts.length > 1) {
      const rest = parts[1].trim();
      const match = rest.match(/^(\d{1,2})\s+(?:de\s+)?([a-zA-ZáéíóúÁÉÍÓÚ]+)/i);
      if (match) {
        const day = match[1];
        const mStr = match[2].slice(0, 3).toLowerCase();
        const foundIdx = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(mStr);
        if (foundIdx !== -1) return `${day} ${SPANISH_SHORT_MONTHS[foundIdx]}`;
        return `${day} ${match[2].slice(0, 3)}`;
      }
      const clean = rest.replace(/\s+\d{4}$/, '');
      if (clean.length > 0) return clean;
    }
    return ses.dateString;
  }

  return ses.date || 'Sesión';
}

/**
 * Formatea la fecha completa y legible para auditoría en Tooltips.
 * Ejemplo: "Viernes, 12 de septiembre de 2026"
 */
export function formatSessionFullDate(ses) {
  if (!ses) return 'Sesión';
  if (ses.dateString && typeof ses.dateString === 'string') return ses.dateString;
  if (ses.date && /^\d{4}-\d{2}-\d{2}$/.test(ses.date)) {
    const [y, m, d] = ses.date.split('-');
    const mIdx = parseInt(m, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${parseInt(d, 10)} de ${SPANISH_FULL_MONTHS[mIdx]} de ${y}`;
    }
  }
  if (ses.timestamp) {
    const d = new Date(ses.timestamp);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
  return ses.date || 'Sesión';
}

/**
 * Comprueba si dos nombres de ejercicios son biomecánicamente incompatibles.
 * Previene robos de datos entre estaciones o tipos de aparatos diferentes.
 */
export function areIncompatibleExercises(nameA, nameB) {
  if (!nameA || !nameB) return false;
  if (nameA.trim().toLowerCase() === nameB.trim().toLowerCase()) return false;

  const a = nameA.toLowerCase();
  const b = nameB.toLowerCase();

  // Sentadilla Hack vs Prensa de Piernas NUNCA deben mezclarse
  const isHackA = a.includes('hack') || a.includes('v-squat') || a.includes('v squat');
  const isHackB = b.includes('hack') || b.includes('v-squat') || b.includes('v squat');
  const isPressA = (a.includes('prensa') && !a.includes('pecho') && !a.includes('chest press') && !a.includes('pallof')) || a.includes('leg press');
  const isPressB = (b.includes('prensa') && !b.includes('pecho') && !b.includes('chest press') && !b.includes('pallof')) || b.includes('leg press');

  if ((isHackA && isPressB) || (isPressA && isHackB)) return true;

  // Prensa de Piernas vs Curl de Femorales NUNCA deben mezclarse
  const isCurlLegA = (a.includes('curl') || a.includes('flexion')) && (a.includes('femoral') || a.includes('leg curl') || a.includes('isquio'));
  const isCurlLegB = (b.includes('curl') || b.includes('flexion')) && (b.includes('femoral') || b.includes('leg curl') || b.includes('isquio'));
  if ((isPressA && isCurlLegB) || (isCurlLegA && isPressB)) return true;

  // Peso Muerto / RDL vs Prensa o Sentadilla Hack NUNCA deben mezclarse
  const isRdlA = a.includes('muerto') || a.includes('rdl') || a.includes('deadlift');
  const isRdlB = b.includes('muerto') || b.includes('rdl') || b.includes('deadlift');
  if ((isRdlA && (isPressB || isHackB)) || (isRdlB && (isPressA || isHackA))) return true;

  // Pecho / Hombro vs Pierna NUNCA deben mezclarse
  const isUpperChestA = a.includes('inclinado') || a.includes('chest') || a.includes('pecho') || a.includes('pec deck') || a.includes('cristos');
  const isUpperChestB = b.includes('inclinado') || b.includes('chest') || b.includes('pecho') || b.includes('pec deck') || b.includes('cristos');
  const isLegA = isHackA || isPressA || isRdlA || isCurlLegA || a.includes('pierna') || a.includes('cuadriceps') || a.includes('pantorrilla');
  const isLegB = isHackB || isPressB || isRdlB || isCurlLegB || b.includes('pierna') || b.includes('cuadriceps') || b.includes('pantorrilla');
  if ((isUpperChestA && isLegB) || (isLegA && isUpperChestB)) return true;

  // Abductores vs Aductores NUNCA deben mezclarse
  const isAbductorA = a.includes('abduct') || a.includes('abducc');
  const isAbductorB = b.includes('abduct') || b.includes('abducc');
  const isAductorA = a.includes('aduct') || a.includes('aducc');
  const isAductorB = b.includes('aduct') || b.includes('aducc');
  if ((isAbductorA && isAductorB) || (isAductorA && isAbductorB)) return true;

  // Bíceps vs Tríceps NUNCA deben mezclarse
  const isBicepA = a.includes('bicep') || a.includes('scott') || a.includes('bayesian') || (a.includes('curl') && !isCurlLegA);
  const isBicepB = b.includes('bicep') || b.includes('scott') || b.includes('bayesian') || (b.includes('curl') && !isCurlLegB);
  const isTricepA = a.includes('tricep') || a.includes('pushdown') || a.includes('copa') || a.includes('katana') || a.includes('frances');
  const isTricepB = b.includes('tricep') || b.includes('pushdown') || b.includes('copa') || b.includes('katana') || b.includes('frances');
  if ((isBicepA && isTricepB) || (isTricepA && isBicepB)) return true;

  // Press Inclinado vs Press Plano de Pecho: no mezclar si son variantes biomecánicas distintas
  const isInclinePressA = a.includes('inclinad') || a.includes('incline') || a.includes('nitro');
  const isInclinePressB = b.includes('inclinad') || b.includes('incline') || b.includes('nitro');
  const isFlatChestA = (a.includes('plano') || a.includes('flat') || a.includes('chest press')) && !isInclinePressA;
  const isFlatChestB = (b.includes('plano') || b.includes('flat') || b.includes('chest press')) && !isInclinePressB;
  if ((isInclinePressA && isFlatChestB) || (isFlatChestA && isInclinePressB)) return true;

  // Mancuerna vs Máquina / Smith / Barra: Biomecánicamente incompatibles en pesos
  const isStrictDumbbellA = (a.includes('mancuerna') || a.includes('dumbbell')) && !a.includes('maquina') && !a.includes('máquina') && !a.includes('smith');
  const isStrictDumbbellB = (b.includes('mancuerna') || b.includes('dumbbell')) && !b.includes('maquina') && !b.includes('máquina') && !b.includes('smith');

  const isStrictMachineA = (a.includes('maquina') || a.includes('máquina') || a.includes('machine') || a.includes('smith') || a.includes('multipower') || a.includes('nitro') || a.includes('hammer')) && !a.includes('mancuerna');
  const isStrictMachineB = (b.includes('maquina') || b.includes('máquina') || b.includes('machine') || b.includes('smith') || b.includes('multipower') || b.includes('nitro') || b.includes('hammer')) && !b.includes('mancuerna');

  const isStrictBarbellA = ((a.includes('barra') || a.includes('barbell')) && !a.includes('mancuerna') && !a.includes('polea') && !a.includes('cable') && !a.includes('smith') && !a.includes('maquina'));
  const isStrictBarbellB = ((b.includes('barra') || b.includes('barbell')) && !b.includes('mancuerna') && !b.includes('polea') && !b.includes('cable') && !b.includes('smith') && !b.includes('maquina'));

  const isStrictCableA = (a.includes('polea') || a.includes('cable')) && !a.includes('mancuerna') && !a.includes('barra');
  const isStrictCableB = (b.includes('polea') || b.includes('cable')) && !b.includes('mancuerna') && !b.includes('barra');

  if ((isStrictDumbbellA && isStrictMachineB) || (isStrictMachineA && isStrictDumbbellB)) return true;
  if ((isStrictDumbbellA && isStrictBarbellB) || (isStrictBarbellA && isStrictDumbbellB)) return true;
  if ((isStrictMachineA && isStrictBarbellB) || (isStrictBarbellA && isStrictMachineB)) return true;
  if ((isStrictCableA && isStrictDumbbellB) || (isStrictDumbbellA && isStrictCableB)) return true;

  return false;
}

/**
 * Comprueba si un ejercicio histórico corresponde exactamente al ejercicio actual.
 * Prioriza el código unificado canónico de 3 segmentos ([GRUPO-MÁQUINA-ESPEC])
 * para garantizar aislamiento total y cero mezcla de datos entre máquinas.
 */
export function matchExercise(currentEx, historicalKey, historicalData, options = {}) {
  if (!currentEx || !historicalData) return { isMatch: false };

  const currentId = currentEx.id;
  const currentName = currentEx.name || '';
  const histName = historicalData.name || historicalData.originalName || historicalKey || '';
  const isSwapped = Boolean(currentEx.originalName && currentEx.originalName !== currentEx.name);

  // 1. PRIORIDAD MÁXIMA: Coincidencia por Código Unificado de 3 Segmentos
  const uCodeCurrent = getUnifiedCodeForExercise(currentEx);
  const histObj = (historicalData && typeof historicalData === 'object')
    ? (historicalData.id ? historicalData : { ...historicalData, id: historicalKey, name: historicalData.name || historicalData.originalName || (typeof historicalKey === 'string' && !historicalKey.startsWith('d') ? historicalKey : '') })
    : { id: historicalKey, name: (typeof historicalKey === 'string' && !historicalKey.startsWith('d') ? historicalKey : '') };
  const uCodeHist = getUnifiedCodeForExercise(histObj) || parseUnifiedCode(historicalData?.unifiedCode) || parseUnifiedCode(historicalKey);

  if (uCodeCurrent && uCodeHist) {
    if (uCodeCurrent.canonical === uCodeHist.canonical) {
      return { 
        isMatch: true, 
        matchType: 'unified_code', 
        matchedName: histName, 
        code: uCodeCurrent.canonical,
        machineKey: uCodeCurrent.machineKey 
      };
    } else {
      // Si se solicita expresamente coincidencia por familia de máquina biomecánica:
      if (options.matchFamily && uCodeCurrent.machineKey === uCodeHist.machineKey) {
        return { 
          isMatch: true, 
          matchType: 'machine_family', 
          matchedName: histName, 
          code: uCodeHist.canonical,
          family: uCodeCurrent.machineKey 
        };
      }
      // Por defecto para series de hoy / anterior sesión: AISLAMIENTO ESTRICTO DE ESTACIÓN
      return { isMatch: false, reason: 'different_unified_code' };
    }
  }

  // 2. Si son ejercicios biomecánicamente incompatibles, bloquear de inmediato
  if (areIncompatibleExercises(currentName, histName)) {
    return { isMatch: false };
  }

  // 3. Coincidencia exacta por nombre
  if (currentName.trim().toLowerCase() === histName.trim().toLowerCase()) {
    return { isMatch: true, matchType: 'exact_name', matchedName: histName };
  }

  // 4. Coincidencia por nombre normalizado estricto (SIN coincidencia parcial de subcadenas)
  const normCurrent = normalizeExerciseName(currentName);
  const normHist = normalizeExerciseName(histName);

  if (normCurrent && normHist && normCurrent === normHist) {
    return { isMatch: true, matchType: 'normalized_name', matchedName: histName };
  }

  // 5. Coincidencia por Equivalencias Directas Explícitas
  if (currentEx.equivalents && Array.isArray(currentEx.equivalents)) {
    for (const eq of currentEx.equivalents) {
      if (areIncompatibleExercises(eq.name, histName)) continue;
      const uCodeEq = getUnifiedCodeForExercise(eq);
      if (uCodeEq && uCodeHist && uCodeEq.canonical === uCodeHist.canonical) {
        return { isMatch: true, matchType: 'equivalent_code', matchedName: histName, equivalentName: eq.name };
      }
      const normEq = normalizeExerciseName(eq.name);
      if (normEq && normHist && normEq === normHist) {
        return { isMatch: true, matchType: 'equivalent_name', matchedName: histName, equivalentName: eq.name };
      }
    }
  }

  // 6. Coincidencia directa por ID sólo si no hay contradicción de ejercicio ni sustitución
  if (currentId === historicalKey || historicalData.id === currentId) {
    if (isSwapped && currentEx.originalName) {
      const normOrig = normalizeExerciseName(currentEx.originalName);
      if (normHist && normHist === normOrig) {
        return { isMatch: false };
      }
    }
    // Si los nombres normalizados son diferentes, rechazar coincidencia ciega de ID
    if (normHist && normCurrent && normHist !== normCurrent) {
      return { isMatch: false };
    }
    return { isMatch: true, matchType: 'exact_id', matchedName: histName };
  }

  return { isMatch: false };
}

/**
 * Extrae la lista de ejercicios de una sesión de forma uniforme.
 */
export function getExercisesFromSession(ses) {
  if (!ses) return [];

  if (ses.exercises && typeof ses.exercises === 'object' && !Array.isArray(ses.exercises)) {
    return Object.entries(ses.exercises)
      .filter(([key, data]) => data && typeof data === 'object' && key !== 'isWarmupDone')
      .map(([key, data]) => ({ key, data }));
  }

  if (Array.isArray(ses.exercises) && ses.exercises.length > 0) {
    return ses.exercises
      .filter(data => data && typeof data === 'object')
      .map((data, idx) => ({ key: data?.id || String(idx), data }));
  }

  if (Array.isArray(ses.exercisesDetailed) && ses.exercisesDetailed.length > 0) {
    return ses.exercisesDetailed
      .filter(data => data && typeof data === 'object')
      .map((data, idx) => ({ key: data?.id || String(idx), data }));
  }

  if (ses.rawWorkoutData && typeof ses.rawWorkoutData === 'object' && !Array.isArray(ses.rawWorkoutData)) {
    return Object.entries(ses.rawWorkoutData)
      .filter(([key, data]) => data && typeof data === 'object' && key !== 'isWarmupDone')
      .map(([key, data]) => ({ key, data }));
  }

  return [];
}

/**
 * Extrae las series completadas de un ejercicio de forma uniforme.
 */
export function extractExerciseSets(exData) {
  if (!exData) return [];
  const sets = [];

  if (Array.isArray(exData.sets)) {
    exData.sets.forEach((s, idx) => {
      if (!s) return;
      const w = parseFloat(s.weight) || 0;
      const r = parseInt(s.reps, 10) || Math.max(parseInt(s.repsR, 10) || 0, parseInt(s.repsL, 10) || 0) || 0;
      const isDone = s.completed !== false;
      const setNum = s.setNum !== undefined ? s.setNum : idx + 1;
      const label = (s.label || '').toLowerCase();
      const isWarmup = s.isWarmup === true || setNum <= 0 || label.startsWith('c') || label.includes('calentamiento') || label.includes('aprox');
      if (w > 0 && isDone) {
        sets.push({
          setNum,
          weight: w,
          reps: r,
          repsL: s.repsL,
          repsR: s.repsR,
          rpe: s.rpe || '8',
          unit: s.unit || exData.unit || 'lbs',
          isWarmup: !!isWarmup,
          label: s.label || (setNum <= 0 ? 'C1' : `S${setNum}`)
        });
      }
    });
    return sets;
  }

  Object.keys(exData).forEach(k => {
    const num = parseInt(k, 10);
    if (!isNaN(num)) {
      const s = exData[k];
      if (s) {
        const w = parseFloat(s.weight) || 0;
        const r = parseInt(s.reps, 10) || Math.max(parseInt(s.repsR, 10) || 0, parseInt(s.repsL, 10) || 0) || 0;
        const isDone = s.completed !== false;
        const label = (s.label || '').toLowerCase();
        const isWarmup = s.isWarmup === true || num <= 0 || label.startsWith('c') || label.includes('calentamiento') || label.includes('aprox');
        if (w > 0 && isDone) {
          sets.push({
            setNum: num,
            weight: w,
            reps: r,
            repsL: s.repsL,
            repsR: s.repsR,
            rpe: s.rpe || '8',
            unit: s.unit || exData.unit || 'lbs',
            isWarmup: !!isWarmup,
            label: s.label || (num <= 0 ? 'C1' : `S${num}`)
          });
        }
      }
    }
  });

  return sets;
}

/**
 * Parsea el timestamp de una sesión en orden cronológico estricto.
 */
export function parseSessionTimestamp(ses) {
  if (!ses) return 0;
  if (ses.timestamp) {
    const t = new Date(ses.timestamp).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (ses.startTime) {
    const t = new Date(ses.startTime).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (ses.date) {
    if (typeof ses.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(ses.date)) {
      const t = new Date(`${ses.date.slice(0, 10)}T12:00:00`).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    const t = new Date(ses.date).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (typeof ses.dateString === 'string') {
    const match = ses.dateString.match(/(\d{1,2})\s+(?:de\s+)?([a-zA-ZáéíóúÁÉÍÓÚ]+)(?:\s+(?:de\s+)?(\d{4}))?/i);
    if (match) {
      const day = parseInt(match[1], 10);
      const mStr = match[2].slice(0, 3).toLowerCase();
      const year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();
      const mIdx = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(mStr);
      if (mIdx !== -1) {
        return new Date(year, mIdx, day, 12, 0, 0).getTime();
      }
    }
  }
  if (typeof ses.id === 'string') {
    const match = ses.id.match(/\d{10,13}/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > 100000000000) return num;
      if (num > 100000000) return num * 1000;
    }
  }
  return 0;
}

/**
 * Extrae todo el historial de sobrecarga para un ejercicio específico sin contaminaciones.
 */
export function getHistoricalRecordsForExercise(currentEx, workoutHistory = [], options = {}) {
  if (!currentEx || !workoutHistory || workoutHistory.length === 0) {
    return {
      sessionOccurrences: [],
      startWeight: null,
      currentWeight: null,
      prWeight: null,
      delta: 0,
      deltaPercent: 0,
      unit: currentEx.defaultUnit || 'lbs',
      matchedSources: [],
      hasHistory: false
    };
  }

  const occurrences = [];
  const matchedNamesSet = new Set();

  const sortedHistory = [...workoutHistory].sort((a, b) => {
    const timeA = parseSessionTimestamp(a);
    const timeB = parseSessionTimestamp(b);
    return timeA - timeB;
  });

  sortedHistory.forEach(ses => {
    const sessionExercisesList = getExercisesFromSession(ses);
    if (!sessionExercisesList || sessionExercisesList.length === 0) return;

    let matchedExData = null;
    let matchedName = '';

    for (const item of sessionExercisesList) {
      const key = item.key;
      const exData = item.data;
      if (!exData || exData.machine) continue; // Saltar cardio

      const matchRes = matchExercise(currentEx, key, exData, options);
      if (matchRes.isMatch) {
        matchedExData = exData;
        matchedName = matchRes.matchedName || exData.name || key;
        matchedNamesSet.add(matchedName);
        break;
      }
    }

    if (matchedExData) {
      const detailedSets = extractExerciseSets(matchedExData);

      if (detailedSets.length > 0) {
        const effectiveSets = detailedSets.filter(s => !s.isWarmup && s.setNum > 0);
        const workingSets = effectiveSets.length > 0 ? effectiveSets : detailedSets;

        let maxW = 0;
        let minW = Infinity;
        let weightSum = 0;
        let maxR = 0;
        let minR = Infinity;
        let repsSum = 0;
        let best1RM = 0;
        let topSet = null;
        let unit = 'lbs';
        let effectiveTonnage = 0;

        workingSets.forEach((s, idx) => {
          const w = parseFloat(s.weight) || 0;
          const r = parseInt(s.reps, 10) || 0;
          const epley = (w > 0 && r > 0) ? (r === 1 ? Math.round(w) : Math.round(w * (1 + r / 30))) : 0;
          effectiveTonnage += (w * r);
          weightSum += w;
          repsSum += r;

          if (w > maxW) maxW = w;
          if (w < minW && w > 0) minW = w;
          if (r > maxR) maxR = r;
          if (r < minR && r > 0) minR = r;

          if (epley > best1RM || (!topSet && (w > 0 || r > 0))) {
            best1RM = epley;
            topSet = { ...s, setNum: s.setNum !== undefined ? s.setNum : idx + 1, est1RM: epley };
          }
          if (s.unit) unit = s.unit;
        });

        const avgW = workingSets.length > 0 ? Math.round((weightSum / workingSets.length) * 10) / 10 : maxW;
        const avgR = workingSets.length > 0 ? Math.round((repsSum / workingSets.length) * 10) / 10 : 0;

        const peakWeightSets = workingSets.filter(s => s.weight === maxW);
        const bestRepsAtPeakWeight = peakWeightSets.length > 0 ? Math.max(...peakWeightSets.map(s => s.reps)) : (topSet?.reps || maxR);

        if (maxW > 0 || maxR > 0) {
          const shortDateLabel = formatSessionDate(ses);
          const fullDateLabel = formatSessionFullDate(ses);

          occurrences.push({
            sessionId: ses.id,
            dateStr: shortDateLabel,
            dateFull: fullDateLabel,
            dateRaw: ses.date || (ses.timestamp ? ses.timestamp.split('T')[0] : null),
            weekNumber: ses.weekNumber || 1,
            maxWeight: maxW,
            avgWeight: avgW,
            minWeight: minW !== Infinity ? minW : maxW,
            bestReps: bestRepsAtPeakWeight,
            maxRepsSession: maxR,
            minRepsSession: minR !== Infinity ? minR : maxR,
            avgReps: avgR,
            est1RM: best1RM,
            totalVolume: effectiveTonnage,
            tonnage: effectiveTonnage,
            unit,
            setsCount: detailedSets.length,
            effectiveSetsCount: workingSets.length,
            warmupSetsCount: detailedSets.length - workingSets.length,
            detailedSets,
            workingSets,
            topSet: topSet || { weight: maxW, reps: bestRepsAtPeakWeight, est1RM: best1RM },
            sourceName: matchedName
          });
        }
      }
    }
  });

  const startWeight = occurrences.length > 0 ? occurrences[0].maxWeight : null;
  const currentWeight = occurrences.length > 0 ? occurrences[occurrences.length - 1].maxWeight : null;
  const prWeight = occurrences.length > 0 ? Math.max(...occurrences.map(s => s.maxWeight)) : null;
  const unit = occurrences.length > 0 ? occurrences[occurrences.length - 1].unit : (currentEx.defaultUnit || 'lbs');

  let best1RM = 0;
  occurrences.forEach(occ => {
    (occ.detailedSets || []).forEach(s => {
      const w = parseFloat(s.weight) || 0;
      const r = parseFloat(s.reps) || 0;
      const epley = (w > 0 && r > 0) ? (r === 1 ? Math.round(w) : Math.round(w * (1 + r / 30))) : 0;
      if (epley > best1RM) best1RM = epley;
    });
  });

  const delta = (startWeight !== null && currentWeight !== null) ? (currentWeight - startWeight) : 0;
  const deltaPercent = (startWeight && startWeight > 0) ? ((delta / startWeight) * 100).toFixed(1) : 0;
  const matchedSources = Array.from(matchedNamesSet);

  // Motor Inteligente: Si no hubo sesiones para la variante exacta pero existen variantes
  // de la misma familia biomecánica (ej. HOMB-LAT_RAISE con Mancuerna, Polea o Máquina),
  // hacer fallback automático para que nunca quede vacía la analítica ni la gráfica.
  if (occurrences.length === 0 && options.autoFallback !== false && !options.matchFamily) {
    const familyResult = getHistoricalRecordsForExercise(currentEx, workoutHistory, { ...options, matchFamily: true });
    if (familyResult.sessionOccurrences.length > 0) {
      return {
        ...familyResult,
        isFamilyFallback: true,
        stationOccurrencesCount: 0
      };
    }
  }

  return {
    sessionOccurrences: occurrences,
    startWeight,
    currentWeight,
    prWeight,
    best1RM,
    delta,
    deltaPercent,
    unit,
    matchedSources,
    hasHistory: occurrences.length > 0,
    isFamilyFallback: false,
    stationOccurrencesCount: occurrences.length
  };
}

/**
 * Encuentra la coincidencia más precisa para un ejercicio dentro de los ejercicios de una sesión.
 * Prioriza código unificado, nombre exacto y equivalentes configurados.
 */
function findBestMatchInSession(currentEx, sessionOrExercises) {
  if (!sessionOrExercises) return null;

  let entries = [];
  if (Array.isArray(sessionOrExercises)) {
    entries = sessionOrExercises.map((item, idx) => {
      if (item && item.key && item.data) return item;
      return { key: item?.id || String(idx), data: item };
    });
  } else if (sessionOrExercises.exercises || sessionOrExercises.exercisesDetailed || sessionOrExercises.rawWorkoutData) {
    entries = getExercisesFromSession(sessionOrExercises);
  } else {
    entries = Object.entries(sessionOrExercises).map(([key, data]) => ({ key, data }));
  }

  if (entries.length === 0) return null;

  const currentUCode = getUnifiedCodeForExercise(currentEx);
  const isSwapped = Boolean(currentEx.originalName && currentEx.originalName !== currentEx.name);

  // Prioridad 1: Coincidencia inequívoca por Código Unificado de 3 Segmentos
  if (currentUCode) {
    for (const { key, data: exData } of entries) {
      if (!exData || exData.machine) continue;
      const histUCode = getUnifiedCodeForExercise(exData) || parseUnifiedCode(exData.unifiedCode) || parseUnifiedCode(key);
      if (histUCode && histUCode.canonical === currentUCode.canonical) {
        return exData;
      }
    }
  }

  // Prioridad 2: Coincidencia exacta por Nombre
  for (const { key, data: exData } of entries) {
    if (!exData || exData.machine) continue;
    const histName = exData.name || exData.originalName || key;
    if (currentEx.name && histName && currentEx.name.trim().toLowerCase() === histName.trim().toLowerCase()) {
      return exData;
    }
  }

  // Prioridad 3: Coincidencia por nombre normalizado estricto
  const normCurrent = normalizeExerciseName(currentEx.name);
  for (const { key, data: exData } of entries) {
    if (!exData || exData.machine) continue;
    const histName = exData.name || exData.originalName || key;
    if (areIncompatibleExercises(currentEx.name, histName)) continue;
    const normHist = normalizeExerciseName(histName);
    if (normCurrent && normHist && normCurrent === normHist) {
      return exData;
    }
  }

  // Prioridad 4: Coincidencia por Equivalentes Directos Configurados
  if (currentEx.equivalents && Array.isArray(currentEx.equivalents)) {
    for (const eq of currentEx.equivalents) {
      const uCodeEq = getUnifiedCodeForExercise(eq);
      for (const { key, data: exData } of entries) {
        if (!exData || exData.machine) continue;
        const histUCode = getUnifiedCodeForExercise(exData) || parseUnifiedCode(exData.unifiedCode) || parseUnifiedCode(key);
        if (uCodeEq && histUCode && uCodeEq.canonical === histUCode.canonical) {
          return exData;
        }
        const histName = exData.name || exData.originalName || key;
        if (areIncompatibleExercises(eq.name, histName)) continue;
        const normEq = normalizeExerciseName(eq.name);
        const normHist = normalizeExerciseName(histName);
        if (normEq && normHist && normEq === normHist) {
          return exData;
        }
      }
    }
  }

  // Prioridad 5: Coincidencia exacta por ID sólo si no hay contradicción de ejercicio ni sustitución
  for (const { key, data: exData } of entries) {
    if (!exData || exData.machine) continue;
    if (key === currentEx.id || exData.id === currentEx.id) {
      const histName = exData.name || exData.originalName || key;
      if (areIncompatibleExercises(currentEx.name, histName)) continue;
      if (isSwapped && currentEx.originalName) {
        const normOrig = normalizeExerciseName(currentEx.originalName);
        const normHist = normalizeExerciseName(histName);
        if (normHist && normHist === normOrig) continue;
      }
      const normHist = normalizeExerciseName(histName);
      if (normHist && normCurrent && normHist !== normCurrent) continue;
      return exData;
    }
  }

  return null;
}

/**
 * Busca los datos de la sesión anterior para un ejercicio en WorkoutDay
 * con protección completa contra mezclas de máquinas y datos cruzados.
 */
export function getPreviousDataForExercise(currentEx, dayId, currentWeek, workoutHistory = [], currentSessions = {}) {
  if (!currentEx) return {};

  const hasValidLoggedSets = (exData) => {
    if (!exData || typeof exData !== 'object') return false;
    const sets = extractExerciseSets(exData);
    return sets.length > 0;
  };

  const normalizeResult = (matched) => {
    if (!matched) return {};
    const result = { ...matched };
    const isUni = isExerciseUnilateral(currentEx, matched);
    result.isUnilateral = isUni;

    if (Array.isArray(matched.sets)) {
      matched.sets.forEach((s, idx) => {
        const sNum = s.setNum !== undefined ? s.setNum : idx + 1;
        if (!result[sNum]) {
          const validRepsL = isUni && s.repsL !== null && s.repsL !== undefined && s.repsL !== '' && s.repsL !== 'null' ? s.repsL : undefined;
          const validRepsR = isUni && s.repsR !== null && s.repsR !== undefined && s.repsR !== '' && s.repsR !== 'null' ? s.repsR : undefined;
          const resolvedReps = s.reps !== undefined && s.reps !== null && s.reps !== '' 
            ? s.reps 
            : (s.repsR || s.repsL || 0);

          result[sNum] = {
            weight: s.weight,
            reps: resolvedReps,
            repsL: validRepsL,
            repsR: validRepsR,
            rpe: s.rpe || '8',
            unit: s.unit || matched.unit || 'lbs',
            completed: true,
            isUnilateral: isUni
          };
        }
      });
    }

    // Normalizar y sanear todas las claves numéricas de series (ej. result["1"], result["2"])
    Object.keys(result).forEach(key => {
      if (/^\d+$/.test(key) && result[key] && typeof result[key] === 'object') {
        const s = { ...result[key] };
        if (!isUni) {
          s.reps = (s.reps !== undefined && s.reps !== null && s.reps !== '' && s.reps !== 'null')
            ? s.reps
            : (s.repsR || s.repsL || 0);
          delete s.repsL;
          delete s.repsR;
          s.isUnilateral = false;
        } else {
          s.isUnilateral = true;
          if (s.repsL === 'null' || s.repsL === null) delete s.repsL;
          if (s.repsR === 'null' || s.repsR === null) delete s.repsR;
        }
        result[key] = s;
      }
    });

    return result;
  };

  const historyRev = [...workoutHistory].reverse();

  // 1. Si semana > 1, buscar en la sesión archivada de la semana anterior del MISMO día si tiene series válidas
  if (currentWeek > 1) {
    const prevWeekLog = historyRev.find(s => s.dayId === dayId && s.weekNumber === (currentWeek - 1));
    if (prevWeekLog) {
      const matched = findBestMatchInSession(currentEx, prevWeekLog);
      if (matched && hasValidLoggedSets(matched)) return normalizeResult(matched);
    }
  }

  // 2. Buscar en la última sesión del MISMO DÍA en el historial con series válidas
  for (const s of historyRev) {
    if (s.dayId === dayId) {
      const matched = findBestMatchInSession(currentEx, s);
      if (matched && hasValidLoggedSets(matched)) return normalizeResult(matched);
    }
  }

  // 3. Buscar en CUALQUIER sesión previa donde se haya realizado exactamente este ejercicio
  for (const s of historyRev) {
    const matched = findBestMatchInSession(currentEx, s);
    if (matched && hasValidLoggedSets(matched)) return normalizeResult(matched);
  }

  // 4. Fallback final para configuraciones de máquina si no hay series
  for (const s of historyRev) {
    const matched = findBestMatchInSession(currentEx, s);
    if (matched) return normalizeResult(matched);
  }

  return {};
}
