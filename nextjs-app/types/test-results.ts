
/**
 * Test Result Types
 * Centralized interfaces for all psychological assessments
 */

export interface DASS21SubscaleScores {
    depression: number;
    anxiety: number;
    stress: number;
}

export interface MBTIDimensions {
    EI: 'E' | 'I';
    SN: 'S' | 'N';
    TF: 'T' | 'F';
    JP: 'J' | 'P';
}

export interface MBTIFunctions {
    dominant: string;
    auxiliary: string;
    tertiary: string;
    inferior: string;
}

export interface MBTIGeneralResult {
    type: string;
    dimensions: MBTIDimensions;
    functions: MBTIFunctions;
    completedAt?: number;
}

export interface VIASizeStrength {
    rank: number;
    name: string;
    score: number;
    category: 'signature' | 'middle' | 'lower';
}

export interface VIAGeneralResult {
    strengths: VIASizeStrength[];
    topFive: string[];
    completedAt?: number;
}

export interface MIIndividualScore {
    linguistic: number;
    logicalMathematical: number;
    spatial: number;
    musicalRhythmic: number;
    bodilyKinesthetic: number;
    interpersonal: number;
    intrapersonal: number;
    naturalistic: number;
}

export interface MIGeneralResult {
    scores: MIIndividualScore;
    dominant: string[];
    completedAt?: number;
}
