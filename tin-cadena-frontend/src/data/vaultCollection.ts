// src/data/vaultCollection.ts

import type { Photo } from '../types'

export interface Category {
  id: number
  name: string
  description?: string
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Paisaje', description: 'Naturaleza, horizontes oceánicos y paisajes de autor' },
  { id: 2, name: 'Retrato', description: 'Fotografía de personas, poses artísticas y expresiones' },
  { id: 3, name: 'Urbano', description: 'Ciudades, arquitectura y geometrías metropolitanas' },
  { id: 4, name: 'Abstracto', description: 'Fotografía artística experimental y composiciones tonales' },
  { id: 5, name: 'Vida Silvestre', description: 'Especies y biodiversidad en su hábitat natural' },
  { id: 6, name: 'Marino', description: 'Composiciones náuticas y estética costera mediterránea' },
]

export const VAULT_COLLECTION: Photo[] = [
  {
    id: 101,
    title: 'Bastion',
    description: `===STORY===
Una mirada a la fortaleza marítima y el faro vigía del Mediterráneo, guardando la entrada histórica frente a las brumas de la costa provenzal.
===LOCATION===
Marseille, France [43.2965° N, 5.3698° E]
===TECHNICAL===
Leica M11, Summilux 50mm f/1.4, 1/500s, ISO 64`,
    price: 2800,
    edition: 10,
    status: 'AVAILABLE',
    photographerId: 1,
    categoryId: 3,
    image: '/photos/Bastion.jpg',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 102,
    title: 'Infinite Drift',
    description: `===STORY===
La soledad geométrica de un velero navegando en la inmensidad del horizonte en calma, donde el cielo plomizo y las aguas se funden en una sola escala cromática.
===LOCATION===
Mediterranean Sea, Offshore [43.1500° N, 5.2500° E]
===TECHNICAL===
Hasselblad X2D 100C, XCD 90mm f/2.5, 1/1000s, ISO 64`,
    price: 3400,
    edition: 7,
    status: 'AVAILABLE',
    photographerId: 1,
    categoryId: 1,
    image: '/photos/InfiniteDrift.webp',
    createdAt: '2026-04-02T16:30:00Z',
  },
  {
    id: 103,
    title: 'Silent Harbour',
    description: `===STORY===
La quietud matutina reflejada con precisión de espejo sobre las aguas del puerto antiguo, los mástiles trazando líneas verticales de pureza arquitectónica.
===LOCATION===
Vieux-Port, Marseille, France
===TECHNICAL===
Sony A7R V, FE 24-70mm f/2.8 GM II, 1/250s, ISO 100`,
    price: 2600,
    edition: 12,
    status: 'AVAILABLE',
    photographerId: 1,
    categoryId: 3,
    image: '/photos/SilentHarbour.webp',
    createdAt: '2026-02-20T08:15:00Z',
  },
  {
    id: 104,
    title: 'Slate Horizon',
    description: `===STORY===
Murallones de piedra y horizonte agreste bajo un cielo de pizarra cargado de atmósfera atemporal, testimonio de la resistencia costera frente al viento mistral.
===LOCATION===
Îles du Frioul, Mediterranean Sea
===TECHNICAL===
Leica SL2, Vario-Elmarit-SL 24-90mm f/2.8-4, 1/320s, ISO 50`,
    price: 3100,
    edition: 5,
    status: 'AVAILABLE',
    photographerId: 1,
    categoryId: 1,
    image: '/photos/SlateHorizon.webp',
    createdAt: '2026-05-11T14:45:00Z',
  },
  {
    id: 105,
    title: 'The Sentinel I',
    description: `===STORY===
La basílica de Notre-Dame de la Garde iluminada sobre la colina al caer la noche, vigilando la trama urbana y el pulso vibrante de la ciudad costera.
===LOCATION===
Notre-Dame de la Garde, Marseille, France
===TECHNICAL===
Leica M11, Noctilux 50mm f/0.95, 1/60s, ISO 400`,
    price: 3800,
    edition: 7,
    status: 'AVAILABLE',
    photographerId: 1,
    categoryId: 3,
    image: '/photos/TheSentinel1.webp',
    createdAt: '2026-06-01T21:10:00Z',
  },
  {
    id: 106,
    title: 'Urban Tide',
    description: `===STORY===
Una composición panorámica que dialoga entre la monumentalidad del fuerte histórico, los diques marítimos modernos y el tejido urbano expandiéndose hacia el mar.
===LOCATION===
Fort Saint-Jean & La Major, Marseille
===TECHNICAL===
Sony A7R V, 70-200mm f/2.8 GM OSS II, 1/400s, ISO 100`,
    price: 3200,
    edition: 10,
    status: 'AVAILABLE',
    photographerId: 1,
    categoryId: 3,
    image: '/photos/UrbanTide.webp',
    createdAt: '2026-06-18T18:00:00Z',
  },
]
